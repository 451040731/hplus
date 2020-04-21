<template>
	<view class="content">
		<view v-if="addressList.length == 0" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<text class="tips">
				地址一片荒芜，赶紧去增加地址
			</text>
		</view>
		<view v-else class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.isDefault" class="tag">默认</text>
					<text class="address">{{item.provinceName}} {{item.cityName}} {{item.countyName}} {{item.detailInfo}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.userName}}</text>
					<text class="mobile">{{item.telNumber}}</text>
				</view>
			</view>
			<text class="hicon iconedit" @click.stop="addAddress('edit', item)"></text>
		</view>
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList: []
			}
		},
		onLoad(option){
			this.loadData()
			console.log(option.source);
			this.source = option.source;
		},
		methods: {
			//请求数据
			loadData(){
				this.$api.addressList().then(res => {
					if(res.data.ok){
						this.addressList = res.data.value;
					}
				}).catch(err => {
				    console.log(err)
				})
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$utils.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			//新增或编辑地址
			addAddress(type, item){
				this.$Router.push({
					path: '/pages/user/address/addressEdit',
					query: { type: type, data: JSON.stringify(item)},
				})
			},
			//添加或修改成功之后回调
			refreshList(){
				this.loadData();
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.empty{
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width: 300upx;
		}
		.tips{
			text-align: center;
			font-size: $font-base;
			color: $font-color-base;
		}
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
