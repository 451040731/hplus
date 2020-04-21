<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="isCanUse">
			<view>
				<view class="header"><image src="../../static/wx_login.png"></image></view>
				<view class="content">
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>

				<button class="bottom" type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">授权登录</button>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>

export default {
	data() {
		return {
			code: '',
			redirectTo: '',
			id: '',
			isCanUse: uni.getStorageSync('isCanUse') || true //默认为true
		};
	},
	onLoad(options){
		this.redirectTo = options.redirectTo;
		this.id = options.id;
		
		// 提前登陆微信，获取code
		this.$api.weixinLogin().then(code => this.code = code);
	},
	methods: {
		//第一授权获取用户信息===》按钮触发
		wxGetUserInfo(e) {
			this.$api.wxGetUserInfo(e, this.code).then(res =>{
				if(res.data.ok){
					this.$Router.back(1);
				}
			}).catch(err => err);
		}, 
	}
};
</script>

<style lang="scss">
.header {
	margin: 90rpx 0 90rpx 50rpx;
	border-bottom: 1px solid #ccc;
	text-align: center;
	width: 650rpx;
	height: 300rpx;
	line-height: 450rpx;
}

.header image {
	width: 200rpx;
	height: 200rpx;
}

.content {
	margin-left: 50rpx;
	margin-bottom: 90rpx;
}

.content text {
	display: block;
	color: #9d9d9d;
	margin-top: 40rpx;
}

.bottom {
	border-radius: 80rpx;
	margin: 70rpx 50rpx;
	font-size: 35rpx;
}
</style>