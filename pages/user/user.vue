<template>
	<view class="content">
		<view class="head">
			<image class="bg" src="/static/user-bg.png"></image>
			<view class="user-info-box" v-if="userInfo.nickName">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.avatarUrl"></image>
				</view>
				<view class="info-box">
					<text class="user-name">{{userInfo.nickName}}</text>
					<view class="user-type">{{userTypeName}}</view>
				</view>
			</view>
			<view class="user-info-box" v-else>
				<view class="portrait-box">
					<image class="portrait" :src="'/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<button class="user-name" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">微信授权登录</button>
				</view>
			</view>
		</view>
		<view class="footer">
			<!-- 订单 -->
			<view class="order-link" @click="navToOrder('/pages/user/order/order',0)">
				<text class="text">我的订单</text>
				<text class="cell-more hicon iconyou"></text>
			</view>
			<view class="order-section icon">
				<view class="order-item" @click="navToOrder('/pages/user/order/order',1)" hover-class="common-hover"  :hover-stay-time="50">
					<text class="hicon iconpending-payment"></text>
					<text>待付款</text>
					<view class="tag" v-if="waitPaymentNum">{{waitPaymentNum}}</view>
				</view>
				<view class="order-item" @click="navToOrder('/pages/user/order/order',2)"  hover-class="common-hover" :hover-stay-time="50">
					<text class="hicon iconbe-delivered"></text>
					<text>待发货</text>
					<view class="tag" v-if="waitSendOutNum">{{waitSendOutNum}}</view>
				</view>
				<view class="order-item" @click="navToOrder('/pages/user/order/order',3)" hover-class="common-hover"  :hover-stay-time="50">
					<text class="hicon iconpending-receipt"></text>
					<text>待收货</text>
					<view class="tag" v-if="waitReceivingNum">{{waitReceivingNum}}</view>
				</view>
				<view class="order-item" @click="navToOrder('/pages/user/order/order',4)" hover-class="common-hover"  :hover-stay-time="50">
					<text class="hicon iconshipped"></text>
					<text>已发货</text>
				</view>
				<view class="order-item" @click="navToOrder('/pages/user/order/order',9)" hover-class="common-hover"  :hover-stay-time="50">
					<text class="hicon iconorder-cancel"></text>
					<text>已取消</text>
				</view>
			</view>
			<!-- 功能列表 -->
			<view class="nav-section icon">
				<list-cell icon="iconassets" iconColor="#e07472" v-if="userType > 0" title="我的资产" :tips="money" @eventClick="navTo('/pages/user/withdraw/withdraw')"></list-cell>
				<list-cell icon="iconpersonal-information" iconColor="#5fcda2" title="个人信息" @eventClick="navTo('/pages/user/information/information')"></list-cell>
				<list-cell icon="iconaddress" iconColor="#9789f7" title="我的地址" @eventClick="navTo('/pages/user/address/address')"></list-cell>
				<list-cell icon="iconpickup-information" iconColor="#54b4ef" v-if="userType == 1" title="提货信息" @eventClick="navTo('/pages/user/takegoods/takegoods')"></list-cell>
				<list-cell icon="iconpromotion-ambassador" iconColor="#54b4ef" title="推广大使" @eventClick="navTo('/pages/user/ambassador/ambassador')"></list-cell>
				<list-cell icon="iconpromotion-details" iconColor="#e07472" v-if="userType > 0" title="推广明细" @eventClick="navTo('/pages/user/promotion/promotion')"></list-cell>
				<list-cell icon="iconmessage" iconColor="#ee883b" title="消息中心" @eventClick="navTo('/pages/user/message/message')"></list-cell>
			</view>
		</view>
		
	</view>
</template>

<script>
	import listCell from '@/components/mix-list-cell';
	import {mapState,mapMutations} from 'vuex'
	export default {
		components: {
			listCell
		},
		data() {
			return {
				money: 0,
				userType: 0,
				userTypeName: '普通用户',
				waitPaymentNum: 0,
				waitReceivingNum: 0,
				waitSendOutNum: 0,
				code: ''			}
		},
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		onLoad() {
			this.$api.weixinLogin().then(code => this.code = code);
		},
		onShow(){
			// 登陆加载
			if(this.reload){
				this.USER_RELOAD(false);
				this.loadData();
			}
		},
		computed:{
			...mapState({
				userInfo: state => state.user.userInfo,
				reload: state => state.user.reload
			})
		},
		methods: {
			...mapMutations(['USER_RELOAD']),
			//请求数据
			loadData(refresh){
				this.$api.checkUser().then(res => {
					if(refresh){
						uni.stopPullDownRefresh();
					}
					if(res.data.ok){
						this.$api.userIndex().then(res => {
							if(res.data.ok){
								let val = res.data.value;
								this.userType = val.userType;
								this.money = val.money + '元';
								this.waitPaymentNum = val.waitPaymentNum;
								this.waitReceivingNum = val.waitReceivingNum;
								this.waitSendOutNum = val.waitSendOutNum;
							}else if(res.data.code == 1000){
								uni.removeStorageSync('checkTokenTime');
							}else{
								this.userType = 0;
								this.money = 0 + '元';
								this.waitPaymentNum = 0;
								this.waitReceivingNum = 0;
								this.waitSendOutNum = 0;
							}
							switch (this.userType){
								case 1:
									this.userTypeName = '代理';
									break;
								case 2:
									this.userTypeName = '推广大使';
									break;
								default:
									this.userTypeName = '普通用户';
									break;
							}
						}).catch(err => {
							console.log(err)
						});
					}
				});
			},
			wxGetUserInfo: function(e){
				this.$api.wxGetUserInfo(e, this.code).then(res =>{
					if(!res.data.ok){
						this.$api.weixinLogin().then(code => this.code = code);
					}
				});
			},
			/**
			 * 统一跳转接口
			 */
			navTo(url){
				this.$Router.push({
					path:url,
				})
			}, 
			navToOrder(url,status){
				this.$Router.push({
					path:url,
					query: { status: status},
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		.head{
			position:relative;
			height: 420upx;
			padding: 0 30upx 0;
			.bg{
				position:absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.user-info-box{
				height: 350upx;
				display:flex;
				align-items:center;
				position:relative;
				z-index: 1;
				.portrait{
					width: 120upx;
					height: 120upx;
					border: 5upx solid #fff;
					border-radius: 50%;
				}
				.user-name{
					font-size: $font-six;
					color: #fff;
					margin-left: 20upx;
					font-weight: bold;
					line-height: 1.5;
					background: none;
					border: none;
					&:after{
						display: none;
					}
				}
				.user-type{
					font-size: $font-sm;
					margin-left: 20upx;
					color: #fff;
				}
			}
		}
		.footer{
			padding: 0 30upx 30upx;
			margin-top: -140upx;
			z-index: 11;
			position: relative;
			.order-link{
				background-color: #fff;
				padding: 20upx 30upx;
				border-bottom: 2upx solid #E4E7ED;
				display:flex;
				align-items: baseline;
				border-top-left-radius: 10upx;
				border-top-right-radius: 10upx;
				.text{
					flex: 1;
					font-size: $font-base;
					color: $font-color-dark;
					margin-right:10upx;
				}
				.cell-more{
					align-self: center;
					font-size:30upx;
					color: $font-color-base;
					margin-left: $uni-spacing-row-sm;
				}
			}
			.order-section{
				@extend %section;
				padding: 20upx 30upx;
				border-bottom-left-radius: 10upx;
				border-bottom-right-radius: 10upx;
				.order-item{
					@extend %flex-center;
					width: 120upx;
					height: 120upx;
					font-size: $font-sm;
					color: $font-color-dark;
					position: relative;
					.tag{
						position: absolute;
						right: 0;
						top: 0;
						background-color: $uni-color-primary;
						border-radius: 50%;
						color: #fff;
						padding: 2upx 6upx;
						font-size: $font-sm - 4upx;
						line-height: 1;
					}
				}
				.hicon{
					font-size: 48upx;
					margin-bottom: 18upx;
					color: $base-color;
				}
				.icon-shouhoutuikuan{
					font-size:44upx;
				}
			}
			.nav-section{
				margin-top: 20upx;
				background: #fff;
				border-radius: 10upx;
				.sec-header{
					display:flex;
					align-items: center;
					font-size: $font-base;
					color: $font-color-dark;
					line-height: 40upx;
					margin-left: 30upx;
					.yticon{
						font-size: 44upx;
						color: #5eba8f;
						margin-right: 16upx;
						line-height: 40upx;
					}
				}
				.h-list{
					white-space: nowrap;
					padding: 30upx 30upx 0;
					image{
						display:inline-block;
						width: 160upx;
						height: 160upx;
						margin-right: 20upx;
					}
				}
			}
		}
	}
</style>
