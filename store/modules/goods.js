import { cartNum } from '@/fetch/goods'

const state = {
	cartNum: 0,
}

const types = {
	setCartNum: 'setCartNum',
	addCartNum: 'addCartNum'
}

const mutations = {
	setCartNum: (state, number) => {
		state.cartNum = number;
	},
	addCartNum: (state, number) => {
		state.cartNum = state.cartNum + parseInt(number);
	}
}


export default {
	state,
	types,
	mutations,
}
