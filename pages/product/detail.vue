<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item.imgUrl" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{title}}</text>
			<price :item="goods" :cls="'price-box'"></price>
		</view>
		
		<view class="c-list">
			<view class="c-row" @click="toggleSpec">
				<text class="tit">购买类型：</text>
				<view class="con">
					<text class="selected-text">
						<text class="color">
							{{specSelected.name}}
						</text>
						<text class="choseNum">
							<text class="tit">数量：</text>
							{{specSelected.choseNum}}
						</text>
					</text>
				</view>
				<text class="hicon iconyou"></text>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="desc" class="d-desc"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="hicon iconhome"></text>
				<text>首页</text>
			</navigator>
			<view @tap="shareEvn" class="p-b-btn">
				<text class="hicon iconshare"></text>
				<text>分享</text>
			</view>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="hicon iconcart"></text>
				<text>购物车</text>
				<text class="tag">{{cartNum}}</text>
			</navigator>
			
			<view class="action-btn-group" v-if="specSelected.price == 0">
				<button type="primary" class="action-btn no-border no-goods" disabled @click="clickCart">暂时缺货</button>
			</view>
			<view class="action-btn-group" v-else>
				<button type="primary" class="action-btn no-border add-cart-btn" @click="clickCart">加入购物车</button>
				<button type="primary" class="action-btn no-border buy-now-btn" @click="clickBuy">立即购买</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="specSelected.murl"></image>
					<view class="right">
						<price :item="specSelected" :cls="'price'"></price>
						<text class="selected-text">商品款号：{{specSelected.remainNum}}</text>
						<view class="selected">
							已选：
							<text class="selected-text">
								{{specSelected.name}}
							</text>
						</view>
					</view>
				</view>
				<view class="attr-list">
					<view class="item-spec">
						<text>规格</text>
						<view class="item-list">
							<text 
								v-for="(childItem, childIndex) in specChildList" 
								:key="childIndex" class="tit"
								:class="{selected: childItem.selected}"
								@click="selectSpec(childIndex, childItem.id)"
							>
								{{childItem.name}}
							</text>
						</view>
					</view>
					<view class="item-number">
						<view class="number-l" >
							<text>数量</text>
							<text class="stock">（库存）{{specSelected.remainNum}}</text>
						</view>
						<view class="number-r">
							<uni-number-box :min="1" :max="specSelected.remainNum" @change="bindChange"></uni-number-box>
						</view>
					</view>
				</view>
				<view class="buy" v-if="specSelected.price == 0">
					<button class="btn buy-btn no-goods" disabled="">暂时缺货</button>
				</view>
				<view class="buy" v-else>
					<view class="buy-wrap" v-if="isCart == 0">
						<button class="btn cart-btn" @click="joinCart">加入购物车</button>
						<button class="btn buy-btn" @click="buyNow">立即购买</button>
					</view>
					<button class="btn cart-btn btn-100" v-else-if="isCart == 1" @click="joinCart">加入购物车</button>
					<button class="btn buy-btn btn-100" v-else @click="buyNow">立即购买</button>
				</view>
			</view>
		</view>
		<share ref="share" :deliveryFlag="deliveryFlag" @deliveryState="deliveryState"></share>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import Share from "@/components/share.vue"
	import price from "@/components/goods/goods-price.vue"

	
	import { mapMutations,mapState } from 'vuex'
	export default{
		components: {
			uniNumberBox,
			Share,
			price
		},
		data() {
			return {
				goods: {},
				sid: '',// 自身id
				id: undefined,
				specClass: 'none',
				isCart: 0, //0=>直接点击规则，1=>点击购物车，2=>点击购买
				specSelected: {},
				styleNumSelected: '',//默认选择第一个，返回styleNum
				title: '',
				price: '',
				proxyPrice: '',
				shareList: [],
				imgList: [],
				desc: '',
				specChildList: [],
				joinCartList: {},
				deliveryFlag: false,
				parPosterData: {}//分享参数
			};
		},
		onLoad(options){
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			console.log(options);
			if(options.id){
				this.id = options.id
			}else if(options.scene){
				 let json = {};
				 let scene = decodeURIComponent(options.scene);
				 let params = scene.split('&');
				 for (var i = 0; i < params.length; i++) {
				 	let keyValues = params[i].split('=');
				 	json[keyValues[0]] = keyValues[1];
				 }
				 this.id = json['id'];
			}
			this.loadData()
			this.loadCartNum()
		},
		computed:{
			...mapState({
				cartNum: state => state.goods.cartNum
			})
		},
		methods:{
			...mapMutations(['setCartNum', 'addCartNum', 'setShare']),
			loadData() {
				this.$api.goodsDetail(this.$qs.stringify({
					id: this.id,
				})).then(res => {
					this.goods = res.data.value.goods;
					this.imgList = res.data.value.goods.specs[0].banner;
					this.desc = res.data.value.goods.content.replace(/\<img/gi, '<img style="max-width:100%;display: block;" ');
					this.title = res.data.value.goods.name;
					this.price = res.data.value.goods.price;
					this.proxyPrice = res.data.value.goods.proxyPrice;
					this.specChildList = res.data.value.goods.specs;
					this.styleNumSelected = res.data.value.goods.specs[0].styleNum;
					
					this.setShare({
						title: this.title,
						imageUrl: this.imgList[0].imgUrl,
						path: 'pages/product/detail',
						scene: 'id='+this.id,
						price: this.price - this.proxyPrice
					});
					
					//规格 默认选中第一条
					for(let cItem of this.specChildList){
						if(cItem.styleNum === this.styleNumSelected){
							cItem.choseNum = 1;
							this.$set(cItem, 'selected', true);
							this.specSelected = Object.assign(cItem) 
							//this.specSelected.push(cItem);
							break; //forEach不能使用break
						}
					}
				}).catch(err => {
				    console.log(err)
				})
				
				
			},
			//购物车数量
			loadCartNum(){
				this.$api.checkToken().then(res =>{
					if(res.data.ok){
						return this.$api.cartNum().then(res => {
							if(res.data.ok){
								this.setCartNum(res.data.value);
							}else{
								this.$utils.msg(res.dat.msg);
							}
						})
					}
				}).catch(err => console.log(err));
			},
			//规格弹窗开关
			toggleSpec() {
				this.isCart = 0;
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, id){
				let list = this.specChildList;
				list.forEach(item=>{
					this.$set(item, 'selected', false);
					item.choseNum = 1;
					if(item.id === id){
						this.$set(item, 'selected', true);
					}
				})

				// //存储已选择
				// /**
				//  * 修复选择规格存储错误
				//  * 将这几行代码替换即可
				//  * 选择的规格存放在specSelected中
				//  */
				list.forEach(item=>{ 
					if(item.selected === true){ 
						this.specSelected = Object.assign(item) 
						//this.specSelected.push(item); 
					} 
				})
			},
			//判断是加入购车还是购买
			bindChange(value){
				this.specSelected.choseNum = value;
			},
			//点击加入购物车
			clickCart(){
				this.toggleSpec();
				this.isCart = 1;
			},
			//点击购买
			clickBuy(){
				this.toggleSpec();
				this.isCart = 2;
			},
			checkForm(){
				if(this.specSelected.remainNum < this.specSelected.choseNum){
					this.$utils.msg('库存不足');
					return false;
				}
				return true;
			},
			//加入购物车
			joinCart(){
				if(!this.checkForm()){
					return;
				}
				this.$api.checkUser(true).then(res => {
					if(res.data.ok){
						this.joinCartList.goodsSpecsId = this.specSelected.id;
						this.joinCartList.choseNum = this.specSelected.choseNum;
						return this.$api.joinCart(this.joinCartList).then(res => {
							if(res.data.ok){
								this.$utils.msg('加入购物车成功！');
								this.toggleSpec();
								this.addCartNum(this.specSelected.choseNum);
							}else{
								this.$utils.msg(res.data.msg)
							}
						})
					}
				}).catch(err => console.log(err));
			},
			//立即购买
			buyNow(){
				if(!this.checkForm()){
					return;
				}
				let goodsData = [];
				let newSpecSelected = {};
				newSpecSelected.choseNum = this.specSelected.choseNum
				newSpecSelected.goodsSpecsId = this.specSelected.id
				goodsData.push(newSpecSelected);
				this.$Router.push({
					path:'/pages/user/order/createOrder',
					query: { goodsData: JSON.stringify(goodsData)},
				})
			},
			stopPrevent(){},
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
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		background: $page-color-base;
		padding-bottom: 130upx;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.uni-swiper-dot-active{
			background-color: #fff;
		}
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx !important;
			color:$uni-color-primary !important;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		margin-top: 16upx;
		.c-row{
			display:flex;
			align-items:center;
			padding: 30upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
			color: $font-color-light;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
				.color{
					margin-right: 30upx;
				}
				.choseNum{
					
				}
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
		.d-desc{
			width: 100%;
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			padding-bottom: 30upx;
			image{
				width: 186upx;
				height: 186upx;
				flex-shrink: 0;
				margin-top: -60upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 20upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			.item-spec{
				border-top: solid 1px $border-color-light;
				border-bottom: solid 1px $border-color-light;
				padding: 30upx 0;
				.item-list{
					padding: 20upx 0 0;
					display: flex;
					flex-wrap: wrap;
					text{
						display: flex;
						align-items: center;
						justify-content: center;
						background: #eee;
						margin-right: 20upx;
						margin-bottom: 20upx;
						border-radius: 100upx;
						min-width: 60upx;
						height: 60upx;
						padding: 0 20upx;
						font-size: $font-base;
						color: $font-color-dark;
					}
					.selected{
						background: #fbebee;
						color: $uni-color-primary;
					}
				}
			}
			.item-number{
				padding: 30upx 0;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				.number-l{
					line-height: 2.2;
					.stock{
						font-size: $font-sm;
						color: $font-color-light;
					}
				}
				.number-r{
					margin-left: auto;
				}
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 30vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.buy{
				.buy-wrap{
					display: flex;
					flex-wrap: wrap;
					align-items: center;
				}
				.btn{
					height: 66upx;
					line-height: 66upx;
					border-radius: 100upx;
					background: $uni-color-primary;
					font-size: $font-base + 2upx;
					color: #fff;
					margin: 30upx auto 20upx;
					width: 48%;
					&.cart-btn{
						background-color: $font-color-spec;
					}
					&.buy{
						background-color: $uni-color-primary
					}
					&.btn-100{
						width: 100%;
					}
					&.no-goods{
						background-color: $font-color-disabled;
						width: 100%;
					}
				}
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 110upx;
		background: #fff;
		box-shadow: 0 0 10upx 2upx rgba(0, 0, 0, 0.1);
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 22upx;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			position: relative;
			.tag{
				position: absolute;
				right: 0;
				top: 0;
				background-color: $uni-color-primary;
				border-radius: 50%;
				color: #fff;
				padding: 2upx 6upx;
				font-size: $font-sm - 4upx;
				line-height: 1;
			}
			.hicon{
				font-size: 38upx;
				line-height: 40upx;
				color: $font-color-base;
			}
			&.active, &.active .hicon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 70upx;
			border-radius: 100px;
			overflow: hidden;
			margin-left: 20upx;
			position:relative;
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 200upx;
				height: 100%;
				font-size: $font-sm ;
				padding: 0;
				border-radius: 0;
				background: transparent;
				color: #fff;
				&.add-cart-btn{
					background-color: $font-color-spec;
				}
				&.buy-now-btn{
					background-color: $uni-color-primary;
				}
				&:after{
					content: none;
				}
				&.no-goods{
					background-color: $font-color-disabled;
					width: 400upx;
				}
			}
		}
	}
</style>