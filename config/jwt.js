const jwt = require('jwt-simple')
const config = { secret: '1234' }

exports.enCode = (info) => jwt.encode(info, config.secret)
exports.deCode = (token) => jwt.decode(token, config.secret)