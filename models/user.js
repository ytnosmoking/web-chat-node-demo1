const mongoose = require('mongoose')

// 要对密码加密后存储 //用于md5加密
const bcrypt = require('bcryptjs')
//加盐数
const SALT_WORK_FACTOR = 10


const UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  nickname: String, // 昵称
  sex: Boolean, // 性别 0-男  1-女
  iphone: {     // 电话号
    type: String,
    max: 20,
  },
  password: String,
  src: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
UserSchema.pre('save', function (next) {
  console.log(`--------`)
  const user = this
  //  还要检测 用户是否是最新的  进行时间的更新

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })

})
UserSchema.methods.compare = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('Users', UserSchema)