<template>
	<view>
		<view class="content">
			<view v-for="(item, index) in dataList" :key="index" class="item" @click="navToDetailPage('/pages/product/detail', item.id)">
				<view class="image-wrapper"><image :src="item.murl" mode="aspectFill"></image></view>
				<text class="item-title">{{ item.name }}</text>
				<price :item="item"></price>
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
			}
		},
		methods:{
			navToDetailPage(url, goodId) {
				this.$Router.push({
					path: url,
					query: { id: goodId }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-wrap: wrap;
		padding: 30upx 30upx 0;
		background: #fff;
		.item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}
		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.item-title {
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
		}
	}
</style>
