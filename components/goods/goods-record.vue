<template>
	<view class="i-min">
		<!-- 数据列表 -->
		<view :class="'goods-box b-b '+cls"  @click="goDetail(orderId)"
			v-for="(goodsItem, goodsIndex) in dataList" :key="goodsIndex"
		>
			<image class="goods-img" :src="goodsItem.murl" mode="aspectFill"></image>
			<view class="right">
				<text class="title clamp">{{goodsItem.goodsName}}</text>
				<text class="attr-box">{{goodsItem.specName}}  x {{goodsItem.choseNum}}</text>
				<price :item="goodsItem"></price>
			</view>
		</view>
	</view>
</template>

<script>
	import price from "@/components/goods/goods-price.vue"
	export default {
		components:{
			price
		},
		data() {
			return {
				
			};
		},
		props:{
			dataList: {
				type: Array
			},
			orderId: {
				type: Number
			},
			cls:{
				type: String
			}
		},
		methods:{
			goDetail(id){
				if(id){
					this.$Router.push({
						path: '/pages/user/order/detail',
						query: { orderId: id }
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.i-min{
		padding: 0 20upx;
		.goods-box{
			display: flex;
			padding: 20upx 0;
			position: relative;
			&:last-child:after{
				border: none;
			}
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 1upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base;
					color: $font-color-dark;
				}
			}
		}
	}
</style>
