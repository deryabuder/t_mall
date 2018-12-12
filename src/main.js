// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

import store from './store'
import {currency} from './common/js/currency'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(infiniteScroll)
Vue.use(VueLazyload, {
  loading: '../static/loading-svg/loading-bars.svg'
})
// Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式
Vue.filter('currency', currency)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
