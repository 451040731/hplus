<script>
	import Vue from 'vue'
	import {checkUser} from "@/fetch/user.js"
	import {mapMutations} from 'vuex'
	export default {
		onLaunch: function() {

		},
		onShow: function(options) {
			console.log('App Show')
			console.log(options)
			if(options.query.sid){
				// 微信分享进入，设置推荐人
				uni.setStorageSync('rid', options.query.sid);
			}
			if(options.query.scene){
				// 通过图片分享进入，设置推荐人
				let json = {};
				let scene = decodeURIComponent(options.query.scene);
				let params = scene.split('&');
				for (var i = 0; i < params.length; i++) {
					let keyValues = params[i].split('=');
					json[keyValues[0]] = keyValues[1];
				}
				if(json['sid']){
					uni.setStorageSync('rid', json['sid']);
				}
			}
			if(options.scene){
				// 自动登陆
				checkUser().then(res =>{
					if(!res.data.ok){
						this.INIT_USER(); 
					}
				});
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['INIT_USER'])
		}

	}
</script>

<style >
	/* 重置默认样式 */
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
	
	body {
		background-color: #f8f8f8;
		font-size: 28upx;
		color: #333333;
		font-family: Helvetica Neue, Helvetica, sans-serif;
	}
</style>
