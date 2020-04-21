//全局方法
/* msg 提示窗
 * title->提示内容
 */
export function msg(title, duration=1500, mask=false, icon='none'){
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

export function prePage(){
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

export function subtract(a = 0, b = 0){
	return (a - b).toFixed(2);
}
