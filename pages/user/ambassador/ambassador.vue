<template>
	<view class="content">
		<view class="ambassador">
			<view class="content">
				购买礼包，成为平台推广大使
				<button class="share-btn" @click="shareEvn">分享给好友</button>
			</view>
			<view class="recommend">
				<view class="title"><view class="title-text">可 / 选 / 礼 / 包</view></view>
				<goods :dataList="ambassadorList"></goods>
			</view>
		</view>
		<share ref="share" :deliveryFlag="deliveryFlag" @deliveryState="deliveryState"></share>
	</view>
</template>

<script>
	import goods from "@/components/goods/goods-list.vue"
	import share from "@/components/share.vue"
	import {mapMutations} from 'vuex'
	export default {
		components:{
			goods,share
		},
		data() {
			return {
				deliveryFlag: false,
				ambassadorList: [],
				firstGoods: null
			}
		},
		onShow() {
			if(this.firstGoods){
				this.setShare({
					title: '成为推广大使',
					imageUrl: this.firstGoods.murl,
					path: 'pages/product/detail',
					scene: 'id='+this.firstGoods.id,
					price: this.firstGoods.price - this.firstGoods.proxyPrice
				});
			}
		},
		onLoad(option){
			this.loadData();
		},
		methods: {
			...mapMutations(['setShare']),
			loadData(){
				this.$api.ambassador().then(res =>{
					if(res.data.ok){
						this.ambassadorList = res.data.value.goodsList;
						if(this.ambassadorList){
							this.firstGoods = this.ambassadorList[0];
							this.setShare({
								title: '成为推广大使',
								imageUrl: this.firstGoods.murl,
								path: 'pages/product/detail',
								scene: 'id='+this.firstGoods.id,
								price: this.firstGoods.price - this.firstGoods.proxyPrice
							});
						}
					}
				});
			},
			onShareAppMessage(){
				return this.$refs.share.shareAppMessage();
			},
			//分享
			shareEvn(){
				this.$refs.share.shareEvn();
			},
			//子组件改变父组件的弹窗状态
			deliveryState() {
			  this.deliveryFlag = !this.deliveryFlag
			},
			//去商品详情页
			navToDetailPage(url, goodId) {
				this.$Router.push({
					path: url,
					query: { id: goodId }
				});
			}
		}
	}
</script>

<style lang="scss">
.ambassador {
	.content{
		padding: 50upx 0;
		text-align: center;
		font-size: $font-lg;
		color: $uni-color-primary;
	}
	.share-btn {
		margin-top: 40upx;
		width: 250upx;
		padding: 18upx;
		font-size: 28upx;
		border: 1upx solid #ff5530;
		border-radius: 60upx;
		color: #ff5530;
	}
}
.recommend {
	.title {
		display: flex;
		height: 120upx;
		font-size: $font-six;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280373/1567400719411-assets/web-upload/96c5aed9-e281-4638-abf0-1c1c14d64b30.png);
		background-size: cover;
		background-color: #fff;
		.title-text {
			background-image: -webkit-linear-gradient(0deg, #ff5530, #ff8307);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
}
</style>