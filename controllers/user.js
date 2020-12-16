const UserModel = require('../models/user')
const { enCode, deCode } = require('../config/jwt')
const path = require('path')
const fs = require('fs')
class User {
  register(req, res, next) {
    const { name, nickname, sex, iphone, password, src } = req.body


    let code = 200
    let msg = 'ok'
    if (!src) {
      code = 202
      msg = '没有用户头像'
    }
    if (!name) {
      code = 202
      msg = '没有账户名'
    }
    if (!nickname) {
      code = 202
      msg = '没有昵称'
    }
    if (!sex && sex !== 0) {
      code = 202
      msg = '没有性别'
    }
    if (!iphone) {
      code = 202
      msg = '没有电话'
    }
    if (!password) {
      code = 202
      msg = '没有密码'
    }
    if (!name || !nickname || (!sex && sex !== 0) || !iphone || !password || !src) {
      return res.send({
        code,
        msg,
      })
    }
    UserModel.findOne({ name }, (err, data) => {
      if (err) {
        throw Error(err)
      }
      if (data) {
        res.send({
          code: 203,
          msg: '用户已经存在'
        })
      } else {
        const user = new UserModel({
          name, nickname, password, sex, iphone, src
        })
        user.save((err, data) => {
          if (err) {
            throw Error(err)
          } else {
            res.send({
              code: 200,
              msg: '注册成功'
            })
          }
        })
      }
    })
  }

  upload(req, res, next) {
    console.log(req.file)
    const imgs = req.file
    const extname = path.extname(imgs.originalname)
    const oriPath = imgs.destination + '/' + imgs.filename
    const destPath = oriPath + extname

    fs.rename(path.join(__dirname, '..', oriPath), path.join(__dirname, '..', destPath), (err, data) => {
      if (err) {
        throw Error('上传错误')
      }
      console.log(data)
      const url = '/images/avatar/' + imgs.filename + extname
      res.send({
        code: 200,
        msg: '上传成功',
        url
      })
    })
  }

  login(req, res, next) {
    let msg = null;
    let code = 200
    const { name, password } = req.body
    if (!name || !password) {
      msg = '输入用户名或密码'
      code = 202
      return res.send({
        code,
        msg
      })
    }
    UserModel.findOne({ name }, (err, user) => {
      console.log(err, user)
      if (err) {
        throw err;
      }
      //  有用户  校验用户密码
      if (user) {
        user.compare(password, (err, isMatch) => {
          if (err) {
            throw Error(err)
          }
          let token = null
          if (isMatch) {
            code = 200
            msg = '登录成功'
            const { name, nickname, sex, iphone, src, _id: id } = user
            const userInfo = {
              id,
              name,
            }
            token = enCode(userInfo)
            req.session.token = token

          } else {
            code = 201
            msg = '密码错误'
          }
          res.send({
            code,
            msg,
            token
          })
        })
      } else {
        code = 201
        msg = '用户未注册'
        res.send({
          code,
          msg,
        })
      }

    })
  }

  userInfo(req, res, next) {
    const { token } = req.session
    console.log(req.query)
    const { id } = deCode(token)
    UserModel.findOne({ _id: id }, (err, data) => {
      if (err) {
        throw Error('更新查找错误')
      }
      console.log(data)
      console.log(1)
      const { _id, nickname, sex, iphone, src } = data
      res.send({
        code: 200,
        msg: 'ok',
        info: { id: _id, nickname, sex, iphone, src }
      })
    })
  }

  update(req, res, next) {
    const { token } = req.session
    const body = req.body
    console.log(body)
    const { id } = deCode(token)
    UserModel.updateOne({ _id: id }, { $set: body }, (err, data) => {
      if (err) {
        throw Error('查找错误')
      }
      console.log(data)
      res.send({
        code: 200,
        msg: '更新成功',
        data
      })
    })
  }
  delete(req, res, next) {
    const { token } = req.session
    const { id } = deCode(token)
    UserModel.deleteOne({ _id: id }, (err, data) => {
      if (err) {
        throw Error('删除失败')
      }
      res.send({
        code: 200,
        msg: '删除成功'
      })
    })
  }
  updateCode(req, res, next) {
    const { token } = req.session
    const { id } = deCode(token)
    const { oldCode, newCode, againCode } = req.body
    if (newCode !== againCode) {
      return res.send({
        code: 201,
        msg: '两次密码不一样- server'
      })
    }
    UserModel.findOne({ _id: id }, (err, user) => {
      if (err) {
        throw Error('查找用户信息失败')
      }
      if (user) {
        user.compare(oldCode, (err, isMatch) => {
          if (err) {
            throw Error('密码校验失败')
          }
          if (isMatch) {
            user.password = newCode
            user.save((err, data) => {
              if (err) {
                throw Error(err)
              } else {
                res.send({
                  code: 200,
                  msg: '更新成功'
                })
              }
            })

          } else {
            res.send({
              code: 201,
              msg: '密码校验不匹配'
            })
          }
        })
      }
    })

  }
}



module.exports = new User()