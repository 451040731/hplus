<template>
	<view>
		<!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<mescroll-uni top="0" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick" @init="mescrollInit">
			<!-- 数据列表 -->
			<view class="promotion-wrap">
				
				<view class="promotion-item" v-for="(item, index) in pdList" :key="item.id">
					<view :class="['name b-b',{succ: item.status == 1},{error: item.status == -1}]" @click="toggle(item)">
						<text>￥{{item.money}} - {{formatStatus(item)}}</text>
						<text class="time">{{item.createTime}}</text>
					</view>
					<view v-if="item.show" class="con">
						<view class="mix">提现金额：￥{{item.money}}</view>
						<view class="mix">银行卡：{{item.bankName}}</view>
						<view class="mix">卡号：{{item.cardNo}}</view>
						<view class="mix">户名：{{item.cardName}}</view>
						<view class="mix" v-if="item.status != 0">备注：{{item.remark}}</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	
	export default {
		components: {
			MescrollUni,
		},
		onLoad(options) {
			this.id = parseInt(options.id);
		},
		data() {
			return {
				id: undefined,
				mescroll: null, //mescroll实例对象
				upOption:{
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				pdList: [], //列表数据
				tabType: 0 ,// 菜单
				toggleIndex: -1
			}
		},
		methods: {
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
				this.getListDataFromNet(mescroll.num, mescroll.size, this.id, (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					
					//设置列表数据
					if(mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
					this.pdList=this.pdList.concat(curPageData); //追加新数据
					this.pdList.forEach(v => {
						v.show = false;
					});
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick(){
				this.$Router.push({
					path: '/pages/index/index',
				});
			},
			//获取数据
			getListDataFromNet(page,limit,id,successCallback,errorCallback) {
				this.$api.withdrawRecord(this.$qs.stringify({
					page: page,
					limit: limit
				})).then(res => {
					if(res.data.ok){
						let listData = res.data.value;
						successCallback && successCallback(listData);
					}
				}).catch(err => {
				    errorCallback && errorCallback();
				})
			},
			formatStatus(item){
				let status = item.status;
				switch (status){
					case -1:
						return '提现失败';
					case 0:
						return '提现审核中';
					case 1:
						return '提现成功';
					default:
						return status;
				}
			},
			toggle(item){
				item.show = !item.show;
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss">
	.promotion-wrap{
		.promotion-item{
			margin-top: 20upx;
			background-color: #fff;
			.name{
				position: relative;
				padding: 10upx 30upx;
				font-size: $font-lg - 2upx;
				color: $font-color-dark;
				line-height: 60upx;
				display: flex;
				justify-content: space-between;
				.time{
					font-size: $font-sm - 2upx;
					color: $font-color-disabled;
				}
			}
			.succ{
				color: $uni-color-success;
			}
			.error{
				color: $uni-color-error;
			}
			.con{
				padding: 20upx 30upx;
				.mix{
					font-size: $font-sm;
					color: $font-color-light;
					line-height: 50upx;
				}
			}
		}
	}
</style>