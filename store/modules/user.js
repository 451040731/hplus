import { wxLogin } from '@/fetch/user'

const state = {
	userInfo: {},
	hplusToken: '',
	openId: '',
	sid: '',
	reload: true
}
const mutations = {
	SET_USERINFO: (state, provider) => {
		console.log('set user');
		state.userInfo = provider;
		state.hplusToken = provider.token;
		state.openId = provider.openId;
		state.sid = provider.sid;
		uni.setStorageSync('openId', state.openId);
		uni.setStorageSync('sid', state.sid);
		uni.setStorageSync('hplusToken', state.hplusToken);
		uni.setStorageSync('userInfo', provider);
	},
	INIT_USER: (state) => {
		console.log('init user');
		state.userInfo = uni.getStorageSync('userInfo');
		if(!state.userInfo){
			state.userInfo = {};
		}
		state.hplusToken = state.userInfo.token;
		state.openId = state.userInfo.openId;
		state.sid = state.userInfo.sid;
	},
	USER_RELOAD: (state, value) => {
		console.log('reload user');
		state.reload = value;
	}
}

const actions = {
	// 微信授权登录
	wxLogin({ commit }, wxInfo) {
		const { code, userInfo, openId, refUserId } = wxInfo;
		return new Promise((resolve, reject) => {
			wxLogin({
				code: code,
				openId: openId,
				refUserId: refUserId,
				userInfo: userInfo
			}).then(response => {
				const { data } = response
				if(data.ok){
					commit('SET_USERINFO', data.value);
				}
				resolve(response);
			}).catch(error => {
				reject(error)
			})
		})
	}
}

export default {
	state,
	mutations,
	actions
}
