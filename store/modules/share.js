const state = {
	title: '',
	imageUrl: '',
	path: '',
	scene: '',
	price: null
}
const type = {
	setShare: 'setShare'
}

const mutations = {
	setShare: (state, options) => {
		state.title = options.title;
		state.imageUrl = options.imageUrl;
		state.path = options.path;
		state.scene = options.scene;
		state.price = options.price;
	}
}

export default {
	state,
	type,
	mutations
}
