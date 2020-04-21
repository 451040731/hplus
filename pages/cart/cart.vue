<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="cartList.length == 0" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hplusToken" class="empty-tips">
				空空如也
				<navigator class="navigator" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<view class="cart-top">
				<text class="edit hicon iconedit" v-if="isEdit" @click="editCart">编辑</text>
				<text class="edit" v-else @click="sucConfirm">完成</text>
			</view>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item">
						<view class="item-check">
							<view
								class="hicon checkbox"
								:class="[item.checked?'checked iconchecked':'iconcheckbox']"
								@click="check('item', index)"
							></view>
						</view>
						<view class="image-wrapper">
							<image :src="item.murl" 
								:class="[item.loaded]"
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goodsName}}</text>
							<text class="attr">{{item.specName}}</text>
							<view class="bot">
								<price :item="item" :cls="'price'"></price>
								<view class="number-r">
									<uni-number-box 
										:min="1" 
										:value="item.choseNum"
										:max="999" 
										
										@change="bindChange($event, index)"
									>
									</uni-number-box>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<text
						class="hicon checkbox"
						:class="[allChecked?'checked iconchecked':'iconcheckbox']"
						@click="check('all')"
					></text>
					<text class="txt">全选</text>
				</view>
				<view class="total-box">
					<text class="price" v-if="isEdit">合计：¥{{total}}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" :class="{disabled: isDisabled}" @click="createOrder" v-if="isEdit" :disabled="isDisabled">去结算</button>
				<button type="primary" class="no-border confirm-btn" :class="{disabled: isDisabled}" @click="clearCart" :disabled="isDisabled" v-else>删除</button>
			</view>
		</view>
	</view>
</template>

<script>
	import price from "@/components/goods/goods-price.vue"
	import { mapState,mapMutations } from 'vuex';
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		components: {
			uniNumberBox,
			price
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				isEdit: true,
				isDisabled: false,
				goodsSpecsIds: '',
				pageCartNum: 0
			};
		},
		onShow(){
			//微信授权登录后刷新
			if(this.cartNum != this.pageCartNum){
				this.loadData();
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		onLoad(){
			if(this.hplusToken){
				this.loadData();
			}
		},
		computed:{
			...mapState({
				cartNum: state => state.goods.cartNum,
				hplusToken: state => state.user.hplusToken
			})
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		methods: {
			...mapMutations(['setCartNum']),
			//请求数据
			loadData(refresh){
				this.$api.cartList().then(res => {
					if(refresh){
						uni.stopPullDownRefresh();
					}
					if(res.data.ok){
						let list = res.data.value.goods;
						let cartList = list.map(item=>{
							item.checked = true;
							return item;
						});
						this.pageCartNum = res.data.value.totalNum;
						this.setCartNum(this.pageCartNum);
						
						this.cartList = cartList;
						this.isDisabled = false;
						this.calcTotal();  //计算总价
					}else{
						this.pageCartNum = 0;
						this.setCartNum(0);
						this.cartList = [];
					}
				}).catch(err => {
				    console.log(err)
				})
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].DefaultPicURL = '/static/errorImage.jpg';
			},
			navToLogin(){
				this.$Router.push({
					path: '/pages/public/wxlogin',
				})
			},
			//编辑
			editCart(){
				this.isEdit = false;
				this.isDisabled = true;
				this.cartList.forEach(item=>{
					item.checked = false;
				})
				this.allChecked = false;
				
			},
			//完成
			sucConfirm(){
				this.isEdit = true;
				this.isDisabled = true;
				this.cartList.forEach(item=>{
					item.checked = false;
				})
				this.allChecked = false;
				this.calcTotal();
			},
			//选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				let checkedStateList = this.cartList.filter(item => item.checked );
				if(checkedStateList.length > 0){
					this.isDisabled = false;
				}else{
					this.isDisabled = true;
				}
				this.calcTotal(type);
			},
			//数量
			bindChange(data,index){
				this.cartList[index].choseNum = data;
				this.calcTotal();
			},
			//清空 - 删除购物车
			clearCart(){
				let newCartList = this.cartList.filter(item => item.checked)
				uni.showModal({
					content: `清空选中的${newCartList.length}种商品？`,
					success: (e)=>{
						if(e.confirm){
							let list = this.cartList;
							this.cartList  = list.filter(item => !item.checked );
							list.filter(item => {
								if(item.checked){
									this.goodsSpecsIds += item.goodsSpecsId + ','
								}
							})
							this.$api.deleteCart(this.$qs.stringify({
								goodsSpecsIds: this.goodsSpecsIds,
							})).then(res => {
								if(res.data.ok){
									uni.showToast({
									    title: '删除成功',
									    duration: 2000
									});
									this.isEdit = true;
									this.isDisabled = true;
									this.cartList.forEach(item=>{
										item.checked = false;
									})
									this.allChecked = false;
									this.calcTotal();
								}
							}).catch(err => {
							    console.log(err)
							})
							
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += (item.price - item.proxyPrice).toFixed(2) * item.choseNum;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total).toFixed(2);
			},
			//去结算
			createOrder(){
				let cartList  = this.cartList.filter(item => item.checked );
				this.$Router.push({
					path:'/pages/user/order/createOrder',
					query: { goodsData: JSON.stringify(cartList)},
				})
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: $page-color-base;
			image{
				width: 294upx;
				height: 254upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $font-color-red;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 编辑 */
	.cart-top{
		padding: 20upx 30upx;
		background-color: #fff;
		.edit{
			font-size: $font-sm;
			color: $font-color-dark;
			&:before{
				margin-right: 6upx;
			}
		}
	}
	/* 购物车列表项 */
	.cart-list{
		padding: 0 30upx;
		.cart-item{
			display: flex;
			position: relative;
			padding: 20upx 10upx 20upx 20upx;
			background-color: #fff;
			border-radius: 12upx;
			margin-top: 20upx;
			.item-check{
				width: 50upx;
				height: 50upx;
				padding-top: 56upx;
				.hicon{
					color: $font-color-disabled;
					&.checked{
						color: $uni-color-primary;
					}
					&:before{
						font-size: 40upx;
					}
				}
			}
			.image-wrapper{
				width: 150upx;
				height: 150upx;
				flex-shrink: 0;
				position:relative;
				image{
					border-radius:8upx;
				}
			}
			.item-right{
				position: relative;
				display:flex;
				flex-direction: column;
				flex: 1;
				overflow: hidden;
				position:relative;
				padding-left: 30upx;
				.title,.price{
					font-size: $font-base;
					color: $font-color-dark;
					height: 40upx;
					line-height: 40upx;
				}
				.attr{
					font-size: $font-sm;
					color: $font-color-light;
					height: 50upx;
					line-height: 50upx;
				}
				.bot{
					position: absolute;
					bottom: 0;
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					margin-bottom: auto;
					.price{
						line-height: 30upx;
						color: $uni-color-primary;
						.proxyPrice{
							font-size: $font-sm;
							color: $font-color-light;
							text-decoration: line-through;
							margin-left: 10upx;
						}
					}
					.number-r{
						margin-left: auto;
						.uni-numbox{
							width: 220upx;
							.uni-numbox__minus,.uni-numbox__plus{
								width: 30px;
								height: 30px;
							}
							.uni-numbox__value{
								height: 30px;
								font-size: $font-sm;
							}
						}
					}
				}
			}
			.del-btn{
				padding:4upx 10upx;
				font-size:34upx; 
				height: 50upx;
				color: $font-color-light;
			}
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100upx;
		padding: 0 30upx;
		background: #fff;
		box-shadow: 0 0 10upx 2upx rgba(0, 0, 0, 0.1);
		.checkbox{
			height:52upx;
			position:relative;
			text-align: left;
			display: flex;
			align-items: center;
			margin-right: 10upx;
			.hicon{
				margin-right: 6upx;
				color: $font-color-disabled;
				&:before{
					font-size: 44upx;
				}
				&.checked{
					color: $uni-color-primary;
				}
			}
			.txt{
				font-size: $font-sm;
				color: $font-color-base;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align: left;
			.price{
				font-size: $font-base;
				color: $uni-color-primary;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 46upx;
			margin: 0;
			border-radius: 100px;
			height: 60upx;
			line-height: 60upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			&.disabled{
				background-color: #ffbbac;
			}
		}
	}
	
	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;
		image {
			width: 100%;
			height: 100%;
			opacity: 1;
			&.loaded {
				opacity: 1;
			}
		}
	}
</style>