import Vue from 'vue'
import { wxLogin,checkUser,checkToken } from '@/fetch/user'

import Router, {
	RouterMount
} from 'uni-simple-router';
import store from '../store' //状态管理
import {
	vueDevRoutes
} from './vueRouterDev_true/devTrue.js'
Vue.use(Router);


const routesConfig = {
	h5: {
		paramsToQuery:true,
		loading: true,
		vueRouterDev: false,
		useUniConfig: true,
		resetStyle: () => {
			return {
				style: `
				#router-loadding .loadding {
					background-color: #ff8307 !important;
					box-shadow: 0 0 15px #ff8307 !important;
				}
				`
			}
		}
	},
	encodeURI: false,
	debugger: true,
	routes: [{
			path: "/pages/index/index",
			name: 'index',
			aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
			meta:{
				requiresAuth: false
			},
		},
		{
			path: "/pages/product/detail",
			name: 'productDetail',
			meta:{
				requiresAuth: false
			},
		},
		{
			path: "/pages/cart/cart",
			name: 'cart',
			aliasPath: '/cart',
			meta:{
				requiresAuth: false
			},
		},
		{
			path: "/pages/user/user",
			name: 'user',
			aliasPath: '/user',
			meta:{
				requiresAuth: false
			},
		},
		{
			path: "/pages/public/wxlogin",
			name: 'wxlogin',
			meta:{
				requiresAuth: false
			}
		},
		{
			path: "/pages/user/order/createOrder",
			name: 'createOrder',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/order/detail",
			name: 'orderDetail',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/order/order",
			name: 'order',
			meta:{
				requiresAuth: true
			},
		},
{
			path: "/pages/user/order/result",
			name: 'orderResult',
			meta:{
				requiresAuth: false,
			},
		},
		{
			path: "/pages/user/assets/assets",
			name: 'assets',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/information/information",
			name: 'information',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/address/address",
			name: 'address',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/address/addressEdit",
			name: 'addressEdit',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/withdraw/withdraw",
			name: 'withdraw',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/withdraw/record",
			name: 'withdrawRecord',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/promotion/promotion",
			name: 'promotion',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/promotion/detail",
			name: 'promotionDetail',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/takegoods/takegoods",
			name: 'takegoods',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/ambassador/ambassador",
			name: 'ambassador',
			meta:{
				requiresAuth: true
			},
		},
		{
			path: "/pages/user/message/message",
			name: 'message',
			meta:{
				requiresAuth: true
			},
		}
	]
}

if (routesConfig.h5.vueRouterDev) {
	routesConfig.routes = vueDevRoutes;
}

const router = new Router(routesConfig);
//全局前置守卫
router.beforeEach(async (to, from, next) => {
	/*  路由拦截
	 * to.meta.requiresAuth 判断是否需要登录才能访问
	 * 判断本地储存是否有hplusToken
	 * requiresAuth = true和hplusToken为空则需要跳转微信授权登录
	 * 否则直接跳转相应next路由
	 */
	if(to.meta.requiresAuth){
		checkUser(true).then(res => {
			if(res.data.ok){
				next();
			}
		})
	}else{
		next();
	}
})
//全局后置钩子
router.afterEach((to, from) => {
	//console.log('afterEach')
})

export default RouterMount;