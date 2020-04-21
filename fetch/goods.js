import fly from './request'

// 商品详情页
export function goodsDetail(params){
    return fly.post('/api/goods/detail', params).then(res => res)
}

// 加入购物车
export function joinCart(params){
    return fly.post('/api/user/joinCart', params,{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}
// 删除购物车
export function deleteCart(params){
    return fly.post('/api/user/cart/delete',params).then(res => res)
}

// 购物车显示
export function cartList(){
    return fly.get('/api/user/cart').then(res => res)
}

// 购物车数量显示
export function cartNum(){
    return fly.get('/api/user/cartNum').then(res => res)
}

// 订单确认
export function checkoutOrder(params){
    return fly.post('/api/user/order/checkout',params,
	{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}

// 提交平台订单
export function orderSubmit(params){
    return fly.post('/api/user/order/submit',params,
	{
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	}).then(res => res)
}