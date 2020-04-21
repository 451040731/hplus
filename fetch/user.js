import fly from './request'
import {msg} from '@/utils/index.js'
import store from '@/store'

export function weixinLogin(){
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: function(res) {
				resolve(res.code);
			}
		})
	});
}

export function wxGetUserInfo(e, code){
	if(e.detail.userInfo){
		let wxInfo = {}
		wxInfo.refUserId = uni.getStorageSync('rid');
		wxInfo.code = code;
		wxInfo.userInfo = e.detail;
		return store.dispatch('wxLogin', wxInfo).then((res) => {
			if(res.data.ok){
				msg('授权登陆成功');
			}else{
				msg(res.data.msg);
			}
			return res;
		});
	}
	return Promise.reject(e.detail);
}

// 微信授权
export function wxLogin(params){
    return fly.post('/api/wx/login', params).then(res => res);
}

// 检查token是否有效
export function checkToken(){
	let hplusToken = uni.getStorageSync('hplusToken');
	if(!hplusToken){
		return Promise.resolve({data: {ok: false}});
	}
	
	const key = 'checkTokenTime';
	let checkTokenTime = uni.getStorageSync(key);
	let now = new Date().getTime();
	if(checkTokenTime){
		let ago = now - checkTokenTime;
		// 5分钟缓存时间
		if(ago < 5 * 60 * 1000){
			return Promise.resolve({data: {ok: true}});
		}
	}
    return fly.get('/api/user/checkToken').then(res => {
		if(res.data.ok){
			uni.setStorageSync(key, now);
		}else{
			uni.removeStorageSync(key);
		}
		return res;
	})
}

// 检查用户是否已授权登陆过,有则自动登陆
export function checkUser(autoNavigateTo){
	return checkToken().then(res => {
		// token失效
		if(!res.data.ok){
			// 已有用户,自动登陆
			let openId = uni.getStorageSync('openId');
			if(openId){
				let wxInfo = {
					openId: openId
				}
				return store.dispatch('wxLogin', wxInfo).then((res) => {
					if(res.data.ok){
						// 隐身登录
					}else{
						msg(res.data.msg);
					}
					return res;
				});
			}
			if(autoNavigateTo){
				uni.navigateTo({
					url: "/pages/public/wxlogin"
				});
			}
		}else if(!store.state.user.hplusToken){
			store.commit('INIT_USER');
		}
		return res;
	}).catch(err => console.log(err));
}

// 用户首页信息
export function userIndex(){
    return fly.get('/api/user/index').then(res => res)
}

// 用户收货地址列表
export function addressList(){
    return fly.get('/api/user/address').then(res => res)
}

// 用户默认收货地址列表
export function defaultAddressList(){
    return fly.get('/api/user/address/default').then(res => res)
}


// 保存收货地址
export function saveAddress(params){
    return fly.post('/api/user/address/save',params,
	{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}

// 用户基本信息
export function getUserInfo(){
    return fly.get('/api/user/info').then(res => res)
}

// 保存用户基本信息
export function saveUserInfo(params){
    return fly.post('/api/user/info/save',params,
	{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}

// 解密手机号
export function getPhoneNumber(params){
    return fly.post('/api/wx/phone',params,
	{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}

// 查询订单
export function orderQuery(orderId){
    return fly.get('/api/user/order/query', {orderId: orderId}).then(res => res)
}

// 查询订单
export function orderCancel(orderId){
    return fly.get('/api/user/order/cancel', {orderId: orderId}).then(res => res)
}

// 发货
export function orderSendout(params){
    return fly.post('/api/user/order/sendout', params,{
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(res => res)
}
// 发货
export function orderReceive(orderId){
    return fly.post('/api/user/order/receive', {orderId: orderId},{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then(res => res)
}

// 微信统一下单
export function wxCreateOrder(orderId){
    return fly.post('/api/wx/createOrder', {orderId: orderId},{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then(res => res)
}

// 查询用户订单列表
export function orderList(params){
    return fly.get('/api/user/order/list', params).then(res => res)
}

//银行卡
export function userBank(){
    return fly.get('/api/user/bank', {}).then(res => res)
}


//提现申请
export function withdraw(params){
    return fly.post('/api/user/withdraw/submit', params,{
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(res => res)
}

//提现申请记录
export function withdrawRecord(params){
    return fly.get('/api/user/withdraw/record', params).then(res => res)
}

// 用户推广信息
export function promotionList(params){
    return fly.get('/api/user/promotion', params).then(res => res)
}

// 用户推广信息明细
export function promotionDetail(params){
    return fly.get('/api/user/promotion/record', params).then(res => res)
}

// 用户提货信息
export function takegoods(params){
    return fly.get('/api/user/takegoods', params).then(res => res)
}

// 推广大使礼包
export function ambassador(){
    return fly.get('/api/user/promotion/goods').then(res => res)
}

// 查询消息
export function messageList(params){
    return fly.get('/api/user/message/list', params).then(res => res)
}

// 消息设置为已读
export function messageReaded(params){
    return fly.post('/api/user/message/readed', params).then(res => res)
}