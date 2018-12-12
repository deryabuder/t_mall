// 返回一个箭头函数
module.exports = file => () => import('@/views/' + file + '.vue')
