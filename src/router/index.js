import Vue from 'vue'
import Router from 'vue-router'
// @ 是别名，对应着 src 目录
Vue.use(Router)
// 选择生产模式和开发模式两种不同的模块导入
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const asyncRouterMap = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }, {
    // 401，未授权，需要输入正确的身份认证
    path: '/401',
    name: '401',
    component: _import('errorPage/401'),
    hidden: true
    // 二级路由，path的值没有'/'
  }, {
    path: '/404',
    name: '404',
    component: _import('errorPage/404'),
    hidden: true
  }, {
    path: '/',
    component: _import('GoodsList'),
    hidden: true
  }, {
    path: '/cart',
    component: _import('Cart'),
    hidden: true
  }, {
    path: '/address',
    component: _import('Address'),
    hidden: true
  }, {
    path: '/orderConfirm',
    component: _import('OrderConfirm'),
    hidden: true
  }, {
    path: '/orderSuccess',
    component: _import('OrderSuccess'),
    hidden: true
  }
]

export default new Router({
  mode: 'history',
  // 当切换到新路由时，页面的滚动位置
  scrollBehavior: () => ({ y: 0 }),
  routes: asyncRouterMap
})
