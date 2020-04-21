<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="userInfo.nickName" placeholder="昵称" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<text class="input" @click="clickPicker('selector')">{{userInfo.genderName}}</text>
			<w-picker
				v-if="selectList.length!=0"
				mode="selector" 
				:defaultVal="['女']" 
				@confirm="onConfirm" 
				ref="selector" 
				themeColor="#f00"
				:selectList="selectList"
			></w-picker>
			<text class="hicon iconyou"></text>
		</view>
		<view class="row b-b">
			<text class="tit">手机号码</text>
			<view class="phome">
				<text class="input">{{userInfo.phone}}</text>
				<button class="get-phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定微信手机号</button>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">城市</text>
			<text class="input" @click="clickPicker('region')">{{userInfo.province}}{{userInfo.city}}</text>
			<w-picker
				mode="region"
				:defaultVal="['{{userInfo.province}}','{{userInfo.city}}']"
				:hideArea="true"
				@confirm="onConfirm" 
				ref="region"
				:timeout="true"
				themeColor="#ff5530"
			></w-picker>
			<text class="hicon iconyou"></text>
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	
	export default {
		components:{
			wPicker
		},
		data() {
			return {
				pickerName: '请选择省市区',
				mode:"range",
				code: '',
				userInfo: {
					"city": "",
					"gender": 0,
					"nickName": "",
					"phone": "",
					"province": ""
				},
				selectList:[{
					label:"未知",
					value:0
				},{
					label:"男",
					value:1
				},{
					label:"女",
					value:2
				}],
			}
		},
		onLoad(option){
			this.loadData()
		},
		methods: {
			loadData() {
				// 提前登陆，否则获取手机号时刷新登录态，会解密失败
				uni.login({
					provider: 'weixin',
					success: (res) => {
						this.code = res.code;
					}
				});
				this.$api.getUserInfo().then(res => {
					if(res.data.ok){
						this.userInfo = res.data.value;
						this.selectList.forEach(v =>{
							if(v.value == res.data.value.gender){
								this.userInfo.genderName = v.label;
							}
						});
					}
				}).catch(err => {
				    console.log(err)
				})
			},
			getPhoneNumber: function(e){
				this.$api.getPhoneNumber({
					code: this.code,
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				}).then(res => {
					if(res.data.ok){
						this.userInfo.phone = res.data.value.phoneNumber;
					}else{
						this.$utils.msg(res.data.msg);
					}
				})
			},
			//选择省市区
			clickPicker(index){
				this.mode = index
				this.$refs[index].show()
			},
			//选择项
			onConfirm(val){
				//如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
				switch(this.mode){
					case "selector":
						this.userInfo.gender = val.result;
						break;
					case "region":
						this.userInfo.province = val.checkArr[0];
						this.userInfo.city = val.checkArr[1];
						this.pickerName = val.result;
						break;
				}
			},
			//提交
			confirm(){
				let data = this.userInfo;
				if(!data.nickName){
					this.$utils.msg('请填写昵称');
					return;
				}
				if(!data.province){
					this.$utils.msg('请填写省市');
					return;
				}
				this.$api.saveUserInfo(data).then(res => {
					if(res.data.ok){
						this.$utils.msg('保存成功');
						setTimeout(()=>{
							uni.navigateBack();
						}, 800)
					}else{
						this.$utils.msg(res.data.msg);
					}
				}).catch(err => {
				    console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.phome{
			flex: 1;
			display: flex;
			justify-content: space-between;
			.get-phone{
				width: 180upx;
				height: 50upx;
				margin: 0;
				padding: 0;
				text-align: center;
				line-height: 50upx;
				font-size: $font-sm - 2upx;
				color: $uni-color-primary;
				background: none;
				border-radius: 100px;
				border: 1px solid #ff5530;
				&:after{
					border-radius: 100px;
					border: none;
				}
			}
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
			line-height: 2;
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>