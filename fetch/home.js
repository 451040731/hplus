import fly from './request'

// 首页
export function homeList(params){
    return fly.post('/api/index', params).then(res => res)
}

// 首页banner
export function bannerList(params){
    return fly.get('/api/banner', params).then(res => res)
}

// 小程序码
export function wxAcode(params){
    return fly.get('/api/wx/acode',params).then(res => res)
}