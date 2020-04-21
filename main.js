/* * @Author: LCJ  * @Date: 2019-11-22 11:19:14    */
import Vue from 'vue'
import App from './App'
import store from './store' //状态管理
import './fetch'//请求模块
import fly from './fetch/request'//请求模块
import { msg, prePage } from '@/utils'//公共方法

import RouterMount from './router/useRouter.js'
import routerLink from './node_modules/uni-simple-router/component/router-link.vue'
Vue.component('router-link', routerLink)

Vue.config.productionTip = false
Vue.prototype.$store = store  //挂载全局store
Vue.prototype.$utils = {msg, prePage};
Vue.prototype.$baseURL = fly.config.baseURL;
App.mpType = 'app'


const app = new Vue({
	store,
    ...App
})

// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount();
// #endif