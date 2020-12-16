module.exports = (req, res, next) => {
  console.log(req)
  console.log(req.body)
  console.log(req.query)
  const { login } = req.query
  if (login) {
    req.session.token = 'login'
    next()
  } {
    return res.send('no login')
  }

}