<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">可用余额：</text>
			<text>{{useableMoney}}</text>
		</view>
		<view class="row b-b">
			<text class="tit">提现金额：</text>
			<input class="input" type="number" v-model="money" placeholder="请输入申请提现金额" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">开户行名：</text>
			<input class="input" type="text" v-model="bankName" placeholder="请输入开户银行名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">银行卡号：</text>
			<input class="input" type="text" v-model="cardNo" placeholder="请输入银行卡号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">银行户名：</text>
			<input class="input" type="text" v-model="cardName" placeholder="请输入银行户名" placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<button class="add-btn" @click="record">提现记录</button>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				useableMoney: 0,
				money: '',
				bankName: '',
				cardNo: '',
				cardName: ''
			}
		},
		onLoad(option){
			this.loadData();
		},
		methods: {
			...mapMutations(['USER_RELOAD']),
			loadData(){
				this.$api.userBank().then(res =>{
					if(res.data.ok){
						let val = res.data.value;
						if(val){
							this.useableMoney = val.money;
							this.bankName = val.bankName;
							this.cardNo = val.cardNo;
							this.cardName = val.cardName;
						}
					}
				});
			},
			//提现
			confirm(){
				if(!this.money){
					this.$utils.msg('请填写提现金额');
					return;
				}
				if(this.money > this.useableMoney){
					this.$utils.msg('可用余额不足');
					return;
				}
				if(!this.bankName){
					this.$utils.msg('请填写银行名');
					return;
				}
				if(!this.cardNo){
					this.$utils.msg('请填写卡号');
					return;
				}
				if(!this.cardName){
					this.$utils.msg('请填写户名');
					return;
				}
				let params = {
					money: this.money,
					bankName: this.bankName,
					cardNo: this.cardNo,
					cardName: this.cardName
				}
				this.$api.withdraw(params).then(res => {
					if(res.data.ok){
						this.USER_RELOAD(true);
						this.$utils.msg('提现申请成功');
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
			record(){
				uni.navigateTo({
					url:'/pages/user/withdraw/record'
				})
			}
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
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
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
		margin: 30upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>