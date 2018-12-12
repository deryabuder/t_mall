var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var goodsRouter = require('./routes/goods')
var usersRouter = require('./routes/users')
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// 登录拦截
app.use(function (req, res, next) {
  // 如果cookie中有userId的话，说明已经登录了
  if (req.cookies.userId) {
    next()// next不拦截,直接跳过
  } else {
    // 对所有接口进行底层的拦截
    // 在用户未登录的情况下，后端只可以访问登录、登录、查看商品列表
    if (req.originalUrl === '/users/login' || req.originalUrl === '/users/logout' || req.path === '/goods/list') {
      next()
    } else {
      res.json({
        status: '10001',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})

app.use('/', indexRouter)
app.use('/goods', goodsRouter)
app.use('/users', usersRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
