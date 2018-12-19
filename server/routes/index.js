var express = require('express')
var router = express.Router()

/* 后端路由，在 http://localhost:3000访问， 只有在前端登录的时候，才显示内容，否则显示未登录提示 */
router.get('/', function (req, res, next) {
  // 指定了对应的模板引擎
  res.render('index', {
    title: 'Express'
  })
})

module.exports = router
