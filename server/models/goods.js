var mongoose = require('mongoose')
var Schema = mongoose.Schema
// Mongoose中的一切都是由Schema开始的。每一个schema都映射到一个Mongodb的collection
// 并定义了该集合(collection)中的文档(document)的形式。
var productSchema = new Schema({
  'productId': {type: String},
  'productName': String,
  'salePrice': Number,
  'productImage': String
})
// 导出创建的model，参数一为Model的名字，参数二为生成Model所需要的schema
// 会与goods集合关联
module.exports = mongoose.model('Good', productSchema)
