// Vue允许我们自定义过滤器，使用地点:双花括号插值和v-bind表达式。
const digitsRE = /(\d{3})(?=\d)/g
// 值,货币符号,小数位数
export function currency (value, currency, decimals) {
  value = parseFloat(value)
  // 不是一个有限值或者值为undefined时
  if (!isFinite(value) || (!value && value !== 0)) return ''
  // 给参数设置默认值
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  // 设置小数位的位数
  var stringified = Math.abs(value).toFixed(decimals)
  // 得到整数位
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  // 整数位数是否是3的倍数，不是的话，位数是否大于3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  // 小数位数大于0的话，获得包括小数点的小数位
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  // 判断正负数
  var sign = value < 0 ? '-' : ''
  // 组合在一起，并用正则表达式给整数位添加分好
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}
