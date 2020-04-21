<template>
	<view class="content">
		<view class="result">
			<view class="succ" v-if="succ == 1">
				<view class="hicon iconsuc"></view>
				<text class="text">支付成功</text>
			</view>
			<view class="err" v-else>
				<view class="hicon iconerr"></view>
				<text class="text">支付失败</text>
			</view>
		</view>
		<view class="btn">
			<button class="action-btn" @click="redirectTo('/pages/user/order/detail?orderId='+orderId)">查看订单</button>
			<navigator url="/pages/index/index" open-type="switchTab">
				<button class="action-btn recom" @click="redirectTo('/pages/index/index')"><text class="hicon iconhome"></text>去首页</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				succ: 0,
				orderId: 0
			}
		},
		onLoad(options) {
			this.orderId = options.orderId;
			this.succ = options.succ;
		},
		methods: {
			redirectTo(url){
				uni.redirectTo({
					url: url
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content{
		padding-top: 180upx;
		text-align: center;
		.result{
			.hicon{
				font-size: 100upx;
				margin-bottom: 40upx;
				&.iconsuc{
					color: #1ed360;
				}
				&.iconerr{
					color: #e72627;
				}
			}
			.text{
				font-size: $font-big;
				color: $font-color-dark;
			}
		}
		.btn{
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			padding-top: 80upx;
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
