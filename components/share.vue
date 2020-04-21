<template>
	<view>
		<!-- 分享弹窗-->
		<view class="share-pro" >
			<view class="share-pro-mask" v-if="deliveryFlag"></view>
			<view class="share-pro-dialog" :class="deliveryFlag?'open':'close'" >
				<view class="close-btn" @tap="closeShareEvn">
					<span class="hicon iconguanbi"></span>
				</view>
				<view class="share-pro-title">分享</view>
				<view class="share-pro-body">
					<view class="share-item">
						<button class="share-button" open-type="share">
							<view class="share-icon">
								<text class="hicon iconweixin"></text>
							</view>
							<view >分享给好友</view>
						</button>
					</view>
					<view class="share-item" @tap="createCanvasImageEvn">
						<view class="share-button">
							<view class="share-icon">
								<text class="hicon iconimg"></text>
							</view>
							<view >生成分享图片</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
		</view>
	</view>
</template>
 
<script>
	import hchPoster from '@/components/hch-poster/hch-poster.vue'
	import {mapState} from "vuex"
	export default {
		components: {
			hchPoster
		},
		data() {
			return {
				canvasFlag: true,
				posterData: {}
			}
		},
		computed:{
			...mapState({
				sid: state => state.user.sid,
				share: state => state.share
			})
		},
		props: {
			deliveryFlag: {
				type: Boolean,
				default: false
			}
		},
		onLoad() {
		},
		methods: {
			shareAppMessage() {
				return {
					title: this.share.title,
					path: '/' + this.share.path + '?sid=' + this.sid + '&' + this.share.scene,
					imageUrl: this.share.imageUrl,
					success(res){  
						this.$emit('deliveryState', false)
						this.$utils.msg('分享成功');
					},
					fail: function(){
			 　　　　　　this.$utils.msg('分享失败');
			 　　　　}
				}
			},
			//分享
			createCanvasImageEvn(){
				// 以下是根据后端接口动态生成小程序码
				this.codeImg().then((res)=>{
					let code = res;
					Object.assign(this.posterData,
					{
						url: this.share.imageUrl,//商品主图
						title: this.share.title,//标题
						discountPrice: this.share.price,//折后价格
						code: code,//小程序码
					});
					this.$forceUpdate();//强制渲染数据
					this.$nextTick(function(){
						this.canvasFlag=false;//显示canvas海报
						this.$emit('deliveryState', false)//关闭分享弹窗
						this.$refs.hchPoster.createCanvasImage(this);//调用子组件的方法
					});
				})
				// 以下是根据后端接口动态生成小程序码 end
			},
			// 获取海报的小程序码
			codeImg(){
				return new Promise((resolve,reject)=>{
					this.$api.checkUser(true).then(res => {
						if(res.data.ok){
							this.$api.wxAcode({
								scene: 'sid=' + this.sid + '&' + this.share.scene,//自己的参数
								page: this.share.path,//想要生成小程序码的页面地址
								width: "128px",//小程序码大小
							}).then(res => {
								if (res.data.ok) {
									resolve(res.data.value);
								}else{
									this.$utils.msg(res.data.msg);
								}
							}).catch(err => {
								this.canvasFlag = false;
								this.$utils.msg('海报生成失败');
							});
						}
					});
				})
			},
			// 分享弹窗
			shareEvn() {
				this.$emit('deliveryState', true)
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.$emit('deliveryState', false)
			},
			// 取消海报
			canvasCancel(val){
				this.canvasFlag = val;
			}
		},
	}
</script>

<style lang='scss'>
	.share-btn{
		padding: 30upx 60upx;
		background-color:#ff5f33;
		color: $uni-text-color-inverse;
	}
	.share-pro{
	    display: flex;
	    align-items: center;
	    justify-content: flex-end;
	    flex-direction: column;
	    z-index: 5;
	    line-height: 1;
	    box-sizing: border-box;
	    .share-pro-mask{
	        width: 100%;
	        height: 100%;
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	        background: rgba(0, 0, 0, 0.5);
			z-index: 999;
	    }
	    .share-pro-dialog {
	        width: 750rpx;
	        height: 310rpx;
	        overflow: hidden;
	        background-color: #fff;
	        border-radius: 24rpx 24rpx 0px 0px;
	        position: relative;
	        box-sizing: border-box;
	        position: fixed;
	        bottom: 0;
			z-index: 999;
	        .close-btn {
	            padding: 20rpx 15rpx;
	            position: absolute;
	            top: 0rpx;
	            right: 29rpx;
	        }
	        .share-pro-title {
	            font-size: 28rpx;
	            color: #1c1c1c;
	            padding: 28rpx 41rpx;
	            background-color: #f7f7f7;
	        }
	        .share-pro-body{
	            display: flex;
	            flex-direction: row;
	            justify-content: space-around;
				padding-top: 40upx;
	            .share-item{
	                display: flex;
	                flex-direction:column;
	                justify-content: center;
	                justify-content: space-around;
					.share-button{
						margin-left: 0;
						line-height: 1;
						color: #1c1c1c;
						font-size: 28rpx;
						margin-right: 0;
						padding-left: 0;
						padding-right: 0;
						background: none;
					}
					.button-hover {
						color:#1c1c1c;
						background:none;
					}
	                .share-icon{
	                    width: 80upx;
						height: 80upx;
	                    margin-top: 0rpx;
	                    margin-bottom: 16rpx;
	                    background-color: #42ae3c;
						border-radius: 50%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin: 0 auto;
						margin-bottom: 14upx;
						.hicon{
							font-size: 44upx;
							color: #fff;
							text-align: center;
						}
	                }
	                &:nth-child(2){
	                    .share-icon{
	                        background-color: #ff5f33;
	                    }
	                }
	            }
	        }
	    }
	
	    /* 显示或关闭内容时动画 */
	    .open {
	        transition: all 0.3s ease-out;
			transform: translateY(0);
	    }
	    .close {
	        transition: all 0.3s ease-out;
			transform: translateY(310rpx);
	    }
	}
	 .canvas{
	    position: fixed !important;
	    top: 0 !important;
	    left: 0 !important;
	    display: block !important;
	    width: 100% !important;
	    height: 100% !important;
	    z-index: 10;
	}
</style>
