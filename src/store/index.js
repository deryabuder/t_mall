import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 日志， 包含state的状态信息
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// vuex的调试工具， 只在开发环境中使用，不在生产环境中使用
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
