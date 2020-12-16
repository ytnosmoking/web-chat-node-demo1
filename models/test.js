const mongoose = require('mongoose')
const { dbTest } = require('../config/mongoose')

const OneSchema = new mongoose.Schema({
  name: {
    type: String | Number
  },
  age: {
    type: String | Number
  },
  sex: {
    type: String | Number
  }
}, {
  collection: 'one'
})

module.exports = dbTest.model('One', OneSchema)