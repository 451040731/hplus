<template>
	<view class="price-wrap">
		<text :class="cls">
			<text class="item-price">￥{{ subtract(item.price, item.proxyPrice) }}</text>
			<text class="item-proxyPrice" v-if="item.proxyPrice">￥{{ item.price }}</text>
		</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			item: {
				type: Object
			},
			cls: {
				type: String
			}
		},
		methods:{
			subtract(a, b){
				return (a - b).toFixed(2);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.price-wrap{
		.item-price {
			font-size: $font-sm;
			color: $font-color-spec;
			line-height: 1;
		}
		.item-proxyPrice {
			font-size: $font-sm - 2upx;
			color: $font-color-light;
			text-decoration: line-through;
			margin-left: 14upx;
		}
	}
</style>
