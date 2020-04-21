基于fly.js封装的http请求库，flyio官网https://wendux.github.io/dist/#/doc/flyio/readme

1.安装flyio
	npm install flyio --s
	
2.新建api目录，新建http.js，引入fly
	let Fly = require("flyio/dist/npm/wx")
	let fly = new Fly
	
3.全局请求配置
	//设置超时
	fly.config.timeout = 30000;
	//设置请求基地址
	fly.config.baseURL = 'uniapp.dcloud.io'
	...
	
4.拦截器
	// 添加请求拦截器
	fly.interceptors.request.use((request) => {
		// 在发送请求之前做些什么
		let token = uni.getStorageSync('aliToken')
		if (token) {
			request.headers['token'] = token
		}
		return request
	}, function(error) {
		// 对请求错误做些什么
		return Promise.reject(error)
	})
	
	// 添加响应拦截器
	fly.interceptors.response.use((res) => {
		// 对响应数据做些事
		// if (!res.data) {
		// return Promise.reject(res)
		// }
		return res
	}, (error) => {
		return Promise.reject(error)
	})

5.添加api接口配置
	新建home.js，引入fly
	
	import fly from './http'
	
	新增挨批接口配置
	
	export function testFly(params){
		return fly.post('/test/test1', params).then(res => res)
	}
	
	新建index.js，引入配置的api接口
	
	import * as user from './user'
	import * as home from './home'
	import * as wallet from './wallet'
	import * as task from './task'
	import Vue from 'vue'

	//api返回结果，正确的状态
	export const STATUS_OK = '000'

	const api = {
		STATUS_OK: STATUS_OK,
		...user,
		...home,
		...wallet,
		...task
	}
	
	挂载api到全局
	Vue.prototype.$api = api
	export default api
	
	mmain.js 引入api
	
	import './api'

6.调用接口
	this.$api.testFly().then(res => {
		console.log(res)
	}).catch(err => {
		console.log(err)
	})






