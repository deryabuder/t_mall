import fetch from 'common/js/fetch'
/**
 * 登陆接口
 * @param {*userName,userPwd} param
 */
// 可以通过将相关配置传递给 axios 来进行请求。axios(config)
export function login (param) {
  return fetch({
    // 后端路由
    url: '/users/login',
    method: 'post',
    // 后端通过req.body.来获取data中的键对应的值
    data: param
  })
}

/**
 * 登出接口
 */
export function logout () {
  return fetch({
    url: '/users/logout',
    method: 'post'
  })
}

/**
 * 是否登录
 */
export function checkLogin () {
  return fetch({
    url: '/users/checkLogin',
    method: 'get'
  })
}

/**
 * goods 列表
 * @param {*} param
 */
export function goodsList (param) {
  return fetch({
    url: '/goods/list',
    methods: 'get',
    params: param
  })
}

/**
 * addCart 加入购物车
 * @param {*} param
 */
export function addCart (param) {
  return fetch({
    url: '/goods/addCart',
    method: 'post',
    data: param
  })
}

/**
 * cartsList 获取购物车列表
 */
export function cartsList () {
  return fetch({
    url: '/users/cartList',
    method: 'get'
  })
}

/**
 * cartDel 购物车删除
 */
export function cartDel (param) {
  return fetch({
    url: '/users/cartDel',
    method: 'post',
    data: param
  })
}

/**
 * cartEdit 购物车编辑
 */
export function cartEdit (param) {
  return fetch({
    url: '/users/cartEdit',
    method: 'post',
    data: param
  })
}

/**
 * cartCheckAll 购物车全选
 */
export function cartCheckAll (param) {
  return fetch({
    url: '/users/cartCheckAll',
    method: 'post',
    data: param
  })
}

/**
 * getCartCount 购物车总数
 */
export function getCartCount (param) {
  return fetch({
    url: '/users/getCartCount',
    method: 'post',
    data: param
  })
}

/**
 * addressList 获取地址列表
 */
export function addressList () {
  return fetch({
    url: '/users/addressList',
    method: 'get'
  })
}

/**
 * setDefault设置默认地址
 */
export function setDefault (param) {
  return fetch({
    url: '/users/setDefault',
    method: 'post',
    data: param
  })
}
/**
 * delAddress删除地址
 */
export function delAddress (param) {
  return fetch({
    url: '/users/delAddress',
    method: 'post',
    data: param
  })
}

/**
 * orderDetail查询订单信息
 */
export function orderDetail (param) {
  return fetch({
    url: '/users/orderDetail',
    method: 'get',
    params: param
  })
}
/**
 * 提交订单信息到数据库
 */
export function payMent (param) {
  return fetch({
    url: '/users/payMent',
    method: 'post',
    data: param
  })
}
