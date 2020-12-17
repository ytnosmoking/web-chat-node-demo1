const createError = require('http-errors');
const express = require('express');
const path = require('path');

const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const logger = require('morgan');
const fs = require('fs')

require('./config/mongoose')
const router = require('./routes')
console.log(1)
const app = express();

// 创建文件夹
const mkdirSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  }
  if (mkdirSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname)
    return true
  }
}

const createFoleder = folder => {
  try {
    fs.accessSync(folder)
  } catch (e) {
    mkdirSync(folder)
  }
}

const imgFolder = './public/images'
createFoleder(imgFolder)


// view engine setup
// 如果不是用nodejs 做前端开发的话 不需要这个模版引擎
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade'); // 设置模版引擎

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 用上传文件的地址  可以做中间键 放在相关的上传路由中
// app.use(multer({ dest: './public/images' }).any())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat', //加密字符串
  resave: false, //强制保存session，即使它没有变化
  saveUninitialized: true, //强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true
  cookie: { maxAge: 24 * 60 * 60 * 1000 },//一天
  rolling: false, //在每次请求时进行设置cookie，将重置cookie过期时间
  store: new mongoStore({ //将session数据存储到mongo数据库中
    url: 'mongodb://127.0.0.1:27017/usertoken',
    touchAfter: 24 * 3600  //多长时间往数据库中更新存储一次，除了在会话数据上更改了某些数据除外
  })
}));


router(app) // 所有路由控制
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
