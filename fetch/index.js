import * as home from './home'
import * as goods from './goods'
import * as user from './user'
import Vue from 'vue'
import qs from 'qs'

//api返回结果，正确的状态
export const STATUS_OK = '0'

const api = {
	STATUS_OK: STATUS_OK,
	...home,
	...goods,
	...user,
}

Vue.prototype.$api = api //挂载全局api
Vue.prototype.$qs = qs //挂载全局参数序列化
export default api