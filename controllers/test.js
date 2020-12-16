
const User = require('../models/user')
const One = require('../models/test')



class Test {
  findUser(req, res, next) {
    User.find((err, data) => {
      console.log(err)
      console.log(data)
      res.send({
        code: 200,
        data: data
      })
    })
  }
  findUserList(reg, res, next) {
    One.find((err, data) => {
      console.log(err)
      console.log(data)
      res.send({
        code: 200,
        data: data
      })
    })
  }
}
module.exports = new Test()