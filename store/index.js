import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import goods from './modules/goods'
import share from './modules/share'

Vue.use(Vuex)

// 导出一个新生成的Store对象
export default new Vuex.Store({
	modules: {
		user,
		goods,
		share
	},
})