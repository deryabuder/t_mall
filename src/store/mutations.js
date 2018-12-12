// mutation本质上是函数，函数名是mutation-type里定义的字符串常量
// 在某一个动作会触发多个mutation时，用action对mutation进行封装
// 设置 state 中的数据
import * as types from './mutation-types'

const mutations = {
  // 方法简写
  [types.SET_NIKE_NAME] (state, nickName) {
    state.nickName = nickName
  },
  [types.SET_CART_COUNT] (state, cartCount) {
    state.cartCount = cartCount
  },
  [types.UPDATE_CART_COUNT] (state, cartCount) {
    state.cartCount = parseInt(state.cartCount) + parseInt(cartCount)
  }
}
export default mutations
