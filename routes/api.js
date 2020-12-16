var express = require('express');
const multer = require('multer')
var router = express.Router();
const auth = require('../middlewares/auth-in')
const User = require('../controllers/user')

router.post('/login', User.login)
router.post('/register', User.register)
router.get('/userInfo', auth, User.userInfo)
router.patch('/userInfo', auth, User.update)
router.delete('/userInfo', auth, User.delete)
router.patch('/userInfoCode', auth, User.updateCode)
router.post('/upload', multer({ dest: './public/images/avatar' }).single('avatar'), User.upload)



module.exports = router;