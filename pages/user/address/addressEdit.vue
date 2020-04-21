<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">收货人姓名</text>
			<input class="input" type="text" v-model="addressData.userName" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号码</text>
			<input class="input" type="number" v-model="addressData.telNumber" placeholder="请输入收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">收货人地址</text>
			<text class="input" @click="clickPicker" v-if="addressData.provinceName == ''">{{pickerName}}</text>
			<text class="input" @click="clickPicker" v-else>{{addressData.provinceName}} {{addressData.cityName}} {{addressData.countyName}}</text>
			<w-picker
				mode="region"
				:defaultVal="['浙江省','杭州市','滨江区']"
				:areaCode="['33','3301','330108']"
				:hideArea="false"
				@confirm="onConfirm" 
				ref="region"
				:timeout="true"
				themeColor="#ff5530"
			></w-picker>
			<text class="hicon iconyou"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.detailInfo" placeholder="请输入详细地址" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault==1" color="#ff5530" @change="switchChange" />
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
				addressData: {
					userName: '', //姓名
					telNumber: '', //手机号码
					provinceName: '',//省
					cityName: '',//市
					countyName: '',//区
					nationalCode: '',//国家代码
					postalCode: '',//邮政编码
					detailInfo: '',//详细信息
					isDefault: 0 //默认地址
				}
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				
				this.addressData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			//默认地址选择
			switchChange(e){
				this.addressData.isDefault = e.detail.value?1:0;
			},
			//选择省市区
			clickPicker(){
				this.$refs['region'].show()
			},
			//选择项
			onConfirm(val){
				this.addressData.provinceName = val.checkArr[0];
				this.addressData.cityName = val.checkArr[1];
				this.addressData.countyName = val.checkArr[2];
				this.pickerName = val.result;
				this.resultInfo=val;
			},
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.userName){
					this.$utils.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.telNumber)){
					this.$utils.msg('请输入正确的手机号码');
					return;
				}
				if(!data.detailInfo){
					this.$utils.msg('请填写详细地址');
					return;
				}
				this.$api.saveAddress(this.addressData).then(res => {
					if(res.data.ok){
						this.$utils.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
						this.$utils.prePage().refreshList();
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
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
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
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
