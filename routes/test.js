var express = require('express');
var router = express.Router();
const { MongoClient, url, UserDoc } = require('../config/db')
const User = require('../models/user')
const One = require('../models/test')
const testController = require('../controllers/test')

// const authMiddleWare = require('../middlewares/auth')
const auth = require('../middlewares/auth-in')
/* GET users listing. */
// router.get('/', authMiddleWare, testController.findUser);
router.get('/', auth, testController.findUser);
router.post('/list', auth, testController.findUserList)

module.exports = router;
