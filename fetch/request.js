// import flyio from 'flyio'
var Fly=require("flyio/dist/npm/wx")
var fly=new Fly
import { wxLogin } from '@/fetch/user'

//设置超时
fly.config.timeout = 30000;
//设置请求基地址
fly.config.baseURL = 'https://mini.changsyl.cn'	// 正式坏境
// fly.config.baseURL = 'https://www.zhoulz.cn'	// 测试坏境

// 添加请求拦截器
fly.interceptors.request.use((request) => {
	// 在发送请求之前做些什么
	uni.showLoading({
	    title: '加载中'
	})
	let token = uni.getStorageSync('hplusToken')
	if (token) {
		request.headers['hplus-token'] = token
	}
	request.headers['X-Requested-With'] = 'XMLHttpRequest';
	return request
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error)
})

fly.interceptors.response.use((response) => {
	// 对响应数据做些事
	uni.hideLoading();
	return response;
}, (error) => {
	uni.hideLoading();
	uni.showToast({
		icon: 'none',
		title: '网络异常,稍后再试'
	})
	return Promise.reject(error)
})

export default fly

