# h+商城小程序
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

> umi-app构建微信小程序微商城

## 预览
![hplus](/screenshot/hplus-demo.jpg)


# 依赖组件库
 - [flyio](https://ext.dcloud.net.cn/plugin?id=561)
 - [uni-simple-router](https://ext.dcloud.net.cn/plugin?id=578)
 - [mescroll-uni](http://www.mescroll.com/)
 - [w-picker](https://ext.dcloud.net.cn/plugin?id=273)
 - [uni-number-box](https://ext.dcloud.net.cn/plugin?id=31)
 - [ui布局参考](https://ext.dcloud.net.cn/plugin?id=200)


## 目录结构

```bash
|__ components                                # 组件库
    |__ goods                                   # 商品信息
    |__ hch-poster                              # 生成海报
    |__ mescroll-uni                            # 下拉刷新，上拉加载更多
    |__ uni-number-box                          # 数字number
    |__ mescw-picker                            # picker
    |__ city-data                               # 省市数据
    |__ mix-list-cell.vue                       # 通用列表
    |__ share.vue                               # 通用分享
|__ fetch                                     # 数据请求
    |__ index.js                                # flyio
    |__ request.js                              # 请求封装
    |__ home.js                                 # 首页模块
    |__ goods.js                                # 商品模块
    |__ user.js                                 # 用户模块
|__ pages                                     # 页面
    |__ index                                   # 首页
    |__ product                                 # 商品
    |__ cart                                    # 购物车
    |__ public                                  # 微信授权
    |__ user                                    # 用户中心
        |__ user.vue                                # 我的
        |__ order                                   # 我的订单
        |__ address                                 # 我的地址
        |__ ambassador                              # 推广大使
        |__ assets                                  # 账户
        |__ information                             # 个人信息
        |__ message                                 # 消息
        |__ order                                   # 订单
        |__ paypws                                  # 我的资产
        |__ promotion                               # 返点
        |__ takegoods                               # 提货信息
        |__ withdraw                                # 绑卡提现
|__ router                                    # 路由
    |__ useRouter.js                               # 路由配置
|__ store                                     # vuex仓库
    |__ index.js                                # 全局配置
    |__ modules                                 # 分模块
        |__ goods.js                                # 商品
        |__ share.js                                # 分享
        |__ user.js                                 # 用户
|__ utils                                     # 全局公共方法
    |__ index.js                              
|__ static                                    # 静态资源
|__ screenshot                                # 预览截图
|__ main.js                                   # 入口
|__ App.vue                                   # 入口
|__ uni.scss                                  # 全局样式
|__ .gitignore                                # git过滤
```

`uni-app`官网文档详见[https://uniapp.dcloud.io](https://uniapp.dcloud.io)

更多uni-app的模板、示例详见[插件市场](https://ext.dcloud.net.cn/)