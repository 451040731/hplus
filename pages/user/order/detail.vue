<template>
	<view class="content">
		<view class="head">
			<image class="bg" src="/static/index-bg.png"></image>
		</view>
		<view class="body">
			<view class="order-status">
				<text class="hicon iconpayment" :class="[order.status==1?'iconpayment':'iconcancel']"></text>
				<view class="s-l">
					<text class="status">订单状态：{{order.statusDesc}}</text>
					<text class="time" v-if="order.status == 1">剩余时间：{{remainTimeDesc}}</text>
				</view>
			</view>
			<view class="address">
				<text class="hicon iconaddress"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{order.distributionAddress}}</text>
					</view>
				</view>
			</view>
			<view class="order-list">
				<goods :dataList="order.goods" :cls="'item'"></goods>
			</view>
			<view class="order-detail">
				<view class="top b-b">
					<view>订单编号：{{order.orderNo}}</view>
					<view>下单时间：{{order.createTime}}</view>
					<view>支付方式：微信支付</view>
					<view v-if="order.payTime">支付时间：{{order.payTime}}</view>
				</view>
				<view class="min b-b">
					<view class="i-item">
						<text>商品合计：</text>
						<text>￥{{order.totalPrice}}</text>
					</view>
					<view class="i-item">
						<text>优惠合计：</text>
						<text>￥{{order.totalDiscountPrice}}</text>
					</view>
					<view class="i-item">
						<text>运费：</text>
						<text>￥{{order.freight}}</text>
					</view>
				</view>
				<view class="bot">
					<text>需要付款：<text class="total">￥{{order.totalOrderPrice}}</text></text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="action-box" v-if="order.status == 1">
				<button class="action-btn" @click="cancelOrder(order)">取消订单</button>
				<button class="action-btn recom" @click="pay">立即支付</button>
			</view>
			<view class="action-box" v-else>
				<button class="action-btn home" @click="toHome">返回首页</button>
			</view>
		</view>
	</view>
</template>

<script>
	import goods from "@/components/goods/goods-record.vue"
	export default {
		components:{
			goods
		},
		data() {
			return {
				orderId: 0,
				order: {
					statusDesc: '',
					distributionAddress: '',
					orderNo: '',
					createTime: '',
					totalPrice: 0,
					totalDiscountPrice: 0,
					totalOrderPrice: 0
				},
				remainTimeDesc: '',
				payNow: 0
			}
		},
		onLoad(options) {
			this.orderId = options.orderId;
			this.payNow = options.payNow;
			this.loadData();
		},
		methods: {
			loadData(){
				let that = this;
				this.$api.orderQuery(this.orderId).then(res =>{
					if(res.data.ok){
						that.order = res.data.value;
						let remainTime = that.order.remainTime;
						let intval = setInterval(function(){
							let mins = parseInt(remainTime/60);
							let secs = remainTime % 60;
							that.remainTimeDesc = mins + ':'+secs;
							remainTime--;
							if(remainTime <= 0){
								clearInterval(intval);
							}
						}, 1000);
						
						if(this.payNow){
							this.pay();
						}
					}else{
						this.$utils.msg(res.data.msg);
					}
				});
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
									uni.navigateBack({
										delta:1
									});
								}else{
									that.$utils.msg(res.data.msg);
								}
							});
						}
					}
				});
			},
			pay(){
				this.$api.wxCreateOrder(this.orderId).then(res => {
					if (res.data.ok) {
						let payParam = res.data.value;
						if(res.data.code == 2000){
							// 支付成功，跳转
							uni.redirectTo({
								url: '/pages/user/order/result?orderId='+this.orderId+'&succ=1'
							});
							return;
						}
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: payParam.timeStamp,
							nonceStr: payParam.nonceStr,
							package: payParam.packageValue,
							signType: payParam.signType,
							paySign: payParam.paySign,
							success: res => {
								uni.redirectTo({
									url: '/pages/user/order/result?orderId='+this.orderId+'&succ=1'
								})
							},
							fail: err => {
								uni.redirectTo({
									url: '/pages/user/order/result?orderId='+this.orderId+'&succ=0'
								})
							}
						});
					} else {
						this.$utils.msg(res.data.msg);
					}
				});
			},
			toHome(){
				uni.navigateBack({
					delta:999
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		background: $page-color-base;
		padding-bottom: 120upx;
	}
	.head{
		position: relative;
		height: 340upx;
		padding-top: 40upx;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 340upx;
			z-index: 9;
		}
	}
	.body{
		padding: 0 30upx;
		margin-top: -180upx;
		position: relative;
		z-index: 10;
		.order-status{
			display: flex;
			.hicon{
				font-size: 70upx;
				color: #fff;
			}
			.s-l{
				flex: 1;
				display: flex;
				justify-content: center;
				flex-direction: column;
				color: #fff;
				padding-left: 30upx;
				.status{
					font-size: $font-big;
				}
				.time{
					font-size: $font-sm;
				}
			}
			.order-status{
				float: flex;
			}
		}
		.address{
			margin-top: 20upx;
			background-color: #fff;
			border-radius: 10upx;
			padding: 30upx 20upx;
			display: flex;
			box-shadow: 0 0 40upx 0 rgba(0,0,0,.03);
			.cen{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-left: 20upx;
			}
		}
		.order-list{
			margin-top: 20upx;
			background-color: #fff;
			border-radius: 10upx;
			box-shadow: 0 0 40upx 0 rgba(0,0,0,.03);
			padding: 0 20upx;
			.item{
				position: relative;
				display: flex;
				padding: 20upx 0;
				.goods-img{
					display: block;
					width: 120upx;
					height: 120upx;
				}
				.right{
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 20upx;
					.title{
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						line-height: 1;
					}
					.attr-box{
						font-size: $font-sm + 2upx;
						color: $font-color-light;
						padding: 10upx 12upx;
					}
					.price{
						font-size: $font-base + 2upx;
						color: $font-color-dark;
					}
				}
			}
		}
		.order-detail{
			margin-top: 20upx;
			background-color: #fff;
			border-radius: 10upx;
			box-shadow: 0 0 40upx 0 rgba(0,0,0,.03);
			padding: 0 20upx;
			.top{
				position: relative;
				padding: 20upx 0;
				view{
					line-height: 60upx;
					font-size: $font-sm;
					color: $font-color-dark;
				}
			}
			.min{
				position: relative;
				padding: 20upx 0;
				line-height: 60upx;
				.i-item{
					display: flex;
					justify-content: space-between;
					font-size: $font-base;
					color: $font-color-dark;
				}
			}
			.bot{
				padding: 10upx 0;
				line-height: 60upx;
				font-size: $font-base;
				color: $font-color-dark;
				text-align: right;
				.total{
					font-size: $font-big;
					color: $uni-color-primary;
				}
			}
		}
	}
	.footer{
		position:fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 95;
		height: 100upx;
		background-color: #fff;
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			position: relative;
			padding-right: 30upx;
			height: 100upx;
			
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
				&.home{
					background: #fff9f9;
					color: $base-color;
					&:after{
						border-color: #f7bcc8;
					}
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