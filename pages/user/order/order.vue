<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="nav">
				<view :class="{active:tabType==0}" @click="changeTab(0)">用户订单</view>
				<view :class="{active:tabType==1}" @click="changeTab(1)">代理订单</view>
			</view>
		</view>
		
		<!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<mescroll-uni top="60" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick" @init="mescrollInit">
			<!-- 数据列表 -->
			<view class="order-wrap">
				<view class="order-item" v-for="(item, index) in pdList" :key="index">
					<view class="i-top b-b">
						<text class="time">订单号：{{item.orderNo}}</text>
						<text class="state">{{item.statusDesc}}</text>
					</view>
					<goods :dataList="item.goods" :orderId="item.orderId"></goods>
					<view class="price-box b-t">
						共
						<text class="num">{{item.totalNum}}</text>
						件商品 合计￥
						<text class="price">{{item.totalOrderPrice}}</text>
					</view>
					<view class="action-box b-t" v-if="item.status == 1">
						<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
						<button class="action-btn recom" @click="goDetail(item.orderId)">去支付</button>
					</view>
					<view class="action-box b-t" v-if="item.status == 2 && tabType == 1">
						<input type="text" placeholder="快递单号" v-model="item.expressNumber" />
						<button class="action-btn" @click="sendOut(item)">发货</button>
						<button class="action-btn recom" @click="scanSendOut(item, index)">扫码</button>
					</view>
					<view class="action-box b-t" v-if="item.status == 3">
						<text>快递单号：{{item.expressNumber}}</text>
						<button class="action-btn recom" @click="receive(item)">确认收货</button>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import goods from "@/components/goods/goods-record.vue"
	import {mapMutations} from 'vuex'
	export default {
		components: {
			MescrollUni,
			goods
		},
		onLoad(options) {
			this.status = options.status == 0 ? '' : parseInt(options.status);
		},
		onShow() {
			
		},
		data() {
			return {
				status: undefined,
				expressNumber: [],
				mescroll: null, //mescroll实例对象
				upOption:{
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 5 // 每页数据的数量
					},
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				pdList: [], //列表数据
				tabType: 0 // 菜单
			}
		},
		methods: {
			...mapMutations(['USER_RELOAD']),
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				this.getListDataFromNet(mescroll.num, mescroll.size, this.status, this.tabType, (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
					this.pdList=this.pdList.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick(){
				this.$Router.pushTab({
					path: '/pages/index/index',
				});
			},
			// 切换菜单
			changeTab (type) {
				if (this.tabType !== type) {
					this.tabType = type
					this.pdList = []// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
				}
			},
			//获取数据
			getListDataFromNet(page,limit,status,type,successCallback,errorCallback) {
				this.$api.orderList(this.$qs.stringify({
					page: page,
					limit: limit,
					status: this.status,
					type: this.tabType
				})).then(res => {
					if(res.data.ok){
						let listData = res.data.value;
						successCallback && successCallback(listData);
					}
				}).catch(err => {
				    errorCallback && errorCallback();
				})
			},
			//取消订单
			cancelOrder(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定要取消订单吗？',
					success: function (res) {
						if (res.confirm) {
							that.$api.orderCancel(item.orderId).then(res =>{
								if(res.data.ok){
									that.USER_RELOAD(true);
									that.mescroll.resetUpScroll();
								}else{
									that.$utils.msg(res.data.msg);
								}
							});
						}
					}
				});
			},
			//去详细页
			goDetail(id){
				this.$Router.push({
					path: '/pages/user/order/detail',
					query: { orderId: id }
				});
			},
			scanSendOut(item,index){
				let that = this;
				uni.scanCode({
					scanType: 'barCode',
					success(res) {
						if(res.result){
							item.expressNumber = res.result;
							that.$forceUpdate();
						}
					}
				});
			},
			sendOut(item){
				let that = this;
				if(!item.expressNumber){
					this.$utils.msg('请填写快递单号');
					return;
				}
				this.$api.orderSendout({
					id: item.orderId,
					expressNumber: item.expressNumber
				}).then(res =>{
					if(res.data.ok){
						that.USER_RELOAD(true);
						this.$utils.msg('发货成功');
						this.mescroll.resetUpScroll();
					}
				});
			},
			receive(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定已收到货？',
					success: function (res) {
						if (res.confirm) {
							that.$api.orderReceive(item.orderId).then(res =>{
								if(res.data.ok){
									that.USER_RELOAD(true);
									that.mescroll.resetUpScroll();
								}else{
									that.$utils.msg(res.data.msg);
								}
							});
						}
					}
				});
			}
			
		}
	}
</script>

<style lang="scss">
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 60upx;
		background-color: #fff;
		.tips{
			font-size: $font-base;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
		}
		.nav{
			text-align: center;
			height: 60upx;
			view{
				display: inline-block;
				width: 30%;
				line-height: 60upx;
				font-size: $font-base;
			}
			.active{
				position: relative;
				color: $uni-color-primary;
				&:before{
					position: absolute;
					bottom: 0;
					content: '';
					display: block;
					width: 60upx;
					height: 4upx;
					background-color: $uni-color-primary;
					border-radius: 6upx;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}
	
	.order-wrap{
		padding: 0 30upx;
		.order-item{
			display: flex;
			flex-direction: column;
			margin-top: 16upx;
			border-radius: 10upx;
			background-color: #fff;
			box-shadow: 0 0 40upx 0 rgba(0,0,0,.03);
			.i-top{
				display: flex;
				align-items: center;
				height: 70upx;
				line-height: 70upx;
				padding: 0 30upx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
				.time{
					flex: 1;
				}
				.state{
					color: $base-color;
				}
			}
			/* 单条商品 */
			.price-box{
				position: relative;
				display: flex;
				justify-content: flex-end;
				align-items: baseline;
				padding: 20upx 30upx;
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				.num{
					margin: 0 8upx;
					color: $font-color-dark;
				}
				.price{
					font-size: $font-lg;
					color: $font-color-dark;
					&:before{
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
			.action-box{
				position: relative;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 100upx;
				position: relative;
				padding-right: 30upx;
				text{
					flex: 1;
					height: 60upx;
					display: flex;
					align-items: center;
					padding-left: 10upx;
				}
			}
			.action-btn{
				width: 160upx;
				height: 60upx;
				margin: 0;
				margin-left: 24upx;
				padding: 0;
				text-align: center;
				line-height: 60upx;
				font-size: $font-sm + 2upx;
				color: $font-color-dark;
				background: #fff;
				border-radius: 100px;
				&:after{
					border-radius: 100px;
				}
				&.recom{
					background: #fff9f9;
					color: $base-color;
					&:after{
						border-color: #f7bcc8;
					}
				}
			}
		}
	}
</style>