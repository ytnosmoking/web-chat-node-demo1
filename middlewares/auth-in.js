module.exports = (req, res, next) => {
  // console.log(req.headers.authorization)
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    res.send({
      code: 204,
      msg: '请先登录验证'
    })
  } else {
    console.log(req.session)
    console.log(req.session.token)
    if (token !== req.session.token) {
      return res.send({
        code: 205,
        msg: `token错误`
      })
    }
    next()
  }
}