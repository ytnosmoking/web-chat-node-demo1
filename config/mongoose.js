const mongoose = require('mongoose')
// 默认启动连接一个数据库 
const url = 'mongodb://127.0.0.1:27017/'
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
mongoose.connect(url + 'vuechat', opts)

const con = mongoose.connection
con.on('open', function () {
  console.log('connect vuechat has connect')
})
con.on('error', () => {
  console.log('connect vuechat has sth wrong')
})


// 可以启动连接多个数据库
const dbTest = mongoose.createConnection(url + 'test', opts)
dbTest.on('open', function () {
  console.log('createConnect test has connect')
})
dbTest.on('error', function () {
  console.log('createConnect test has sth wrong')
})
exports.dbTest = dbTest