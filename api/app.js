const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const multer = require('multer');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/postRouter');
const UserRouter = require('./routes/user');
const MessageRouter = require('./routes/messages');
const ConversationRouter = require('./routes/conversations');

const config = require('./config');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

const app = express();
app.use(cors());
console.log('Server Online');
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json('Your file has been uploaded');
  } catch (err) {
    console.log(err);
  }
});

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', UserRouter);
app.use('/conversations', ConversationRouter);
app.use('/messages', MessageRouter);

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
