var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')
// 连接名称为mall的数据库,
mongoose.connect('mongodb://127.0.0.1:27017/mall', { useNewUrlParser: true })
// 数据库连接成功
mongoose.connection.on('connected', function () {
  console.log('Mongodb connected success.')
})
// 数据库连接失败
mongoose.connection.on('error', function () {
  console.log('Mongodb connected fail.')
})
// 数据库连接断开
mongoose.connection.on('disconnected', function () {
  console.log('Mongodb connected disconnected.')
})

// 查询商品列表(不登录也可以操作)
router.get('/list', function (req, res, next) {
  // req.param()是express提供的方法，获取get请求查询参数的值
  // 当前的页数
  let page = parseInt(req.param('page'))
  // 每页的数据
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  var priceGt = ''
  let priceLte = ''
  // 跳过几条数据
  let skip = (page - 1) * pageSize
  let params = {}

  if (priceLevel !== 'all') {
    switch (priceLevel) {
      // 价格区间
      case '0':priceGt = 0; priceLte = 100; break
      case '1':priceGt = 100; priceLte = 500; break
      case '2':priceGt = 500; priceLte = 1000; break
      case '3':priceGt = 1000; priceLte = 5000; break
    }
    // momgoose的查询条件
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  // 跳过skip条数据，使用limit()方法来读取pageSize条数据（实现每次获取4条数据）
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize) // 查找所有数据
  goodsModel.sort({'salePrice': sort}) // 1是升序,-1是降序
  // 执行查询
  goodsModel.exec({}, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message
      })
    } else {
      res.json({
        status: '200',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
// 加入到购物车（登录之后才可以操作）
router.post('/addCart', function (req, res, next) {
  var userId = req.cookies.userId
  // post方法获取参数的方法
  var productId = req.body.productId
  let User = require('../models/user')
  // 找到对应的用户
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      // 如果数据库中用户的购物车已经有添加的商品，商品数目+1
      if (user) {
        var cartList = user.cartList
        var goodItem = ''
        cartList.forEach(item => {
          if (item.productId === productId) {
            // 接下来通过判断goodItem是否为空来判断添加的商品是否已经存在于购物车
            goodItem = item
            item.productNum++
          }
        })
        // 如果购物车中已经存在商品，则保存修改到数据库
        if (goodItem) {
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
        } else {
        // 用户购物车不存在该商品的话，就在商品数据库集合中寻找，并添加两个属性，然后添加到用户的购物车列表中，最后保存用户集合
          Goods.findOne({productId: productId}, function (err, product) {
            if (err) {
              res.json({
                status: '400',
                msg: err.message,
                result: ''
              })
            } else {
              if (product) {
                // 因为通过mongoose查询的结果为Document文档类型而并非对象类型，
                // 因此，虽然在后台可以获取到新增的doc.productNum与doc.checked属性，但其实并没有对doc进行更改。
                // 只要将文档对象转换为Object对象即可，使用mongoose自带的Document.prototype.toObject()方法，
                // 或者使用JSON.stringify()方法，将doc转换为Object对象。
                var obj = product.toObject()
                obj.productNum = 1
                obj.checked = 1
                user.cartList.push(obj)
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
        }
      }
    }
  })
})

module.exports = router
