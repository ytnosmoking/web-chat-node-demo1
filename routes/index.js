const base = require('./base')
const user = require('./users')
const test = require('./test')
const api = require('./api')

module.exports = (app) => {
  // app.use('/', base)
  app.use('/api', api)
  app.use('/user', user)
  app.use('/test', test)
}

