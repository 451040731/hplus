<template>
	<view class="content">
		<view class="head">
			<image class="bg" src="/static/index-bg.png"></image>
			<view class="carousel-section">
				<view class="logo">
					<view class="title"><text>长胜H+</text></view>
				</view>
				<swiper class="carousel" circular @change="swiperChange" autoplay="autoplay">
					<swiper-item v-for="(item, index) in bannerList" :key="index" class="carousel-item">
						<image v-if="!item.pageUrl" :src="item.imgUrl"/>
						<image v-else :src="item.imgUrl" @click="navTo(item.pageUrl)"/>
					</swiper-item>
				</swiper>
				<!-- 自定义swiper指示器 -->
				<view class="swiper-dots">
					<text class="num">{{ swiperCurrent + 1 }}</text>
					<text class="sign">/</text>
					<text class="num">{{ swiperLength }}</text>
				</view>
			</view>
		</view>
		<view class="cate-section">
			<router-link to="{name: order, params: {status: 0}}" navType="push">
				<view class="cate-item">
					<image src="/static/quicklink1.png"></image>
					<text>我的订单</text>
				</view>
			</router-link>
			<router-link to="/pages/user/takegoods/takegoods" navType="push">
				<view class="cate-item">
					<image src="/static/quicklink2.png"></image>
					<text>提货信息</text>
				</view>
			</router-link>
			<router-link to="/pages/user/message/message" navType="push">
				<view class="cate-item">
					<image src="/static/quicklink3.png"></image>
					<text>我的消息</text>
				</view>
			</router-link>
			<router-link to="/pages/user/ambassador/ambassador" navType="push">
				<view class="cate-item">
					<image src="/static/quicklink4.png"></image>
					<text>推广大使</text>
				</view>
			</router-link>
		</view>
		<view class="ad"><image src="/static/index-ad.png"></image></view>
		<view class="recommend">
			<view class="title"><view class="title-text">商 / 品 / 列 / 表</view></view>
			<goods :dataList="goodsList"></goods>
		</view>
	</view>
</template>

<script>
	import goods from "@/components/goods/goods-list.vue"
export default {
	components: {
		goods
	},
	data() {
		return {
			swiperCurrent: 0,
			swiperLength: 0,
			bannerList: [],
			goodsList: []
		};
	},
	onLoad() {
		this.swiperLength = this.bannerList.length;
		this.loadData();
	},
	onPullDownRefresh() {
		this.loadData('refresh');
	},
	methods: {
		loadData(refresh) {
			this.$api.bannerList({type: 1}).then(res => {
				if(res.data.ok){
					this.bannerList = res.data.value;
				}
			});
			this.$api.homeList(
				this.$qs.stringify({
					offset: 100,
					limit: 10,
					page: 1
				})
			).then(res => {
				if (refresh) {
					uni.stopPullDownRefresh();
				}
				if (res.data.ok) {
					this.goodsList = res.data.value.goods;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		navTo(url){
			let pushParams = {};
			if(url.indexOf('?') != -1){
				pushParams.path = url.substring(0, url.indexOf('?'));
				pushParams.query = {};
				let queryStr = url.split('?')[1];
				let queryParams = queryStr.split('&');
				for (var i = 0; i < queryParams.length; i++) {
					let params = queryParams[i].split('=');
					pushParams.query[params[0]] = params[1];
				}
			}else{
				pushParams.path = url;
			}
			this.$Router.push(pushParams);
		},
		//轮播图切换修改背景色
		swiperChange(e) {
			const index = e.detail.current;
			this.swiperCurrent = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.head {
	position: relative;
	height: 480upx;
	padding-top: 40upx;
	background-color: #fff;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 340upx;
		z-index: 9;
	}
	.carousel-section {
		position: absolute;
		z-index: 10;
		width: 100%;
		.logo {
			padding: 0 30upx;
			margin-bottom: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			.title {
				flex: 1;
				font-size: $font-big;
				color: #fff;
				font-weight: bold;
			}
		}
		.carousel {
			width: 100%;
			height: 350upx;
			.carousel-item {
				width: 100%;
				height: 100%;
				padding: 0 28upx;
				overflow: hidden;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 10upx;
			}
		}
		.swiper-dots {
			display: flex;
			position: absolute;
			left: 60upx;
			bottom: 15upx;
			width: 72upx;
			height: 36upx;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
			background-size: 100% 100%;
			.num {
				width: 36upx;
				height: 36upx;
				border-radius: 50px;
				font-size: 24upx;
				color: #fff;
				text-align: center;
				line-height: 36upx;
			}

			.sign {
				position: absolute;
				top: 0;
				left: 50%;
				line-height: 36upx;
				font-size: 12upx;
				color: #fff;
				transform: translateX(-50%);
			}
		}
	}
}
/* 分类 */
.cate-section {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	padding: 30upx 20upx 26upx;
	background: #fff;
	.cate-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 20upx;
		color: #303133;
	}
	/* 原图标颜色太深,不想改图了,所以加了透明度 */
	image {
		width: 88upx;
		height: 88upx;
		margin-bottom: 14upx;
		border-radius: 50%;
	}
}
/* 广告 */
.ad {
	display: none;
	width: 100%;
	height: 200upx;
	background: #fff;
	image {
		width: 100%;
		height: 100%;
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
/* #ifdef MP */
.head {
	padding-top: 60upx;
}
/* #endif */
</style>
