


exports.MongoClient = require('mongodb').MongoClient
exports.url = 'mongodb://127.0.0.1:27017/'



// exports.UserDoc = ()

exports.UserDoc = (cb) => {
  return MongoClient.connect(url, (err, db) => {
    if (err) {
      throw err
    }
    const dbase = db.db('vuechat')
    dbase.collection('users').find().toArray((err1, result) => {
      console.log(err1)
      console.log(result)
      cb(result)
    })

  })
}

