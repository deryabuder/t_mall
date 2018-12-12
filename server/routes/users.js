var express = require('express')
var router = express.Router()
var User = require('./../models/user')
require('../util/util')
// 后端路由处理来自前端的请求，req是请求对象，res响应对象
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

/**
 * 登入接口
*/
// express的方法
router.post('/login', function (req, res, next) {
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  // mongoose的方法
  User.findOne(params, function (err, doc) {
    if (err) {
      // 前端接收后端的数据通过response.data.来获取
      res.json({
        status: '400',
        msg: err.message
      })
    } else {
      if (doc) {
        // 如果数据库中存在请求的用户，则返回cookie
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // express的方法 cookie(name: string, val: any, options: CookieOptions)
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.json({
          status: '200',
          msg: '',
          result: {
            userNmae: doc.userName
          }
        })
      }
    }
  })
})

/**
 * 登出接口
*/
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '200',
    msg: '',
    result: ''
  })
})

// 是否登录接口
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '200',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: '400',
      msg: '未登录',
      result: ''
    })
  }
})

/**
 * 获得购物车列表
 */
router.get('/cartList', function (req, res, next) {
  // 获得用户的购物车列表
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: doc.cartList
      })
    }
  })
})

/**
 * 购物车删除商品
 */
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId
  var productId = req.body.productId
  // Model.update(conditions, update, function(error)
  // 更新,参数1:查询条件, 参数2:更新对象, 参数3:回调函数
  User.update({userId: userId}, {
    // $pull修饰符会删除掉数组中符合条件的元素(Mongodb)
    // { $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: 'success'
      })
    }
  })
})

/**
 * cartEdit 购物车编辑器
 */
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId
  var productId = req.body.productId
  var productNum = req.body.productNum
  var checked = req.body.checked
  // 更新数据库  Model.update(conditions, update, function(error)
  User.update({
    'userId': userId,
    'cartList.productId': productId
  }, {
    // 购物车更新的内容：商品数量、商品是否选中
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: 'success'
      })
    }
  })
})

/**
 * 1 选中 0 未选中
 * cartCheckAll 购物车全选
 */
router.post('/cartCheckAll', function (req, res, next) {
  var userId = req.cookies.userId
  var checkAll = req.body.checkAll === 'true' ? 1 : 0
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      // 当点击全选按钮时，用户的购物车列表的商品的选中状态与全选按钮一致
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll
        })
        user.save(function (err, doc) {
          if (err) {
            res.json({
              status: '400',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '200',
              msg: '',
              result: 'success'
            })
          }
        })
      }
    }
  })
})

/**
 * getCartCount 获取购物车总数
 */
router.post('/getCartCount', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      var cartList = doc.cartList
      var cartCount = 0
      // 不判断是否选中
      cartList.forEach(item => {
        cartCount += item.productNum
      })
      res.json({
        status: '200',
        msg: '',
        result: cartCount
      })
    }
  })
})
/**
 * 获得地址列表
 */
router.get('/addressList', function (req, res, next) {
  // 获得用户的购物车列表
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: doc.addressList
      })
    }
  })
})
/**
 * 设置默认的地址列表
*/
router.post('/setDefault', function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    })
  } else {
    User.findOne({userId: userId}, function (err, doc) {
      if (err) {
        res.json({
          status: '400',
          msg: err.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList
        addressList.forEach((item) => {
          if (item.addressId === addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })

        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: '400',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '200',
              msg: '',
              result: ''
            })
          }
        })
      }
    })
  }
})
/**
 * delAddress删除地址
 */
router.post('/delAddress', function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  // Model.update(conditions, update, function(error)
  // 更新,参数1:查询条件, 参数2:更新对象, 参数3:回调函数
  User.update({userId: userId}, {
    // $pull修饰符会删除掉数组中符合条件的元素(Mongodb)
    // { $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: 'suc'
      })
    }
  })
})
/**
 * 支付成功后，添加订单信息到orderList中，并返回orderId和orderTotal
 */
router.post('/payMent', function (req, res, next) {
  var userId = req.cookies.userId
  var orderTotal = req.body.orderTotal
  var addressId = req.body.addressId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var address = ''
      var goodsList = []
      // 获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId === item.addressId) {
          address = item
        }
      })
      // 获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodsList.push(item)
        }
      })

      var platForm = '622'
      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)

      var sysDate = new Date().Format('yyyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId = platForm + r1 + sysDate + r2

      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }

      doc.orderList.push(order)

      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: {
              orderId: '',
              orderTotal: ''
            }
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 根据订单Id查询订单信息
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId
  var orderId = req.param('orderId')
  User.findOne({userId: userId}, function (err, userInfo) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = userInfo.orderList
      if (orderList.length > 0) {
        var orderTotal = -1
        orderList.forEach((item) => {
          if (item.orderId === orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal >= 0) {
          res.json({
            status: '200',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '402',
            msg: '无此订单',
            result: ''
          })
        }
      } else {
        res.json({
          status: '403',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})

module.exports = router
