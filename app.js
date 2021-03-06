//external dependencies
var express = require('express');
var path = require('path');
var sio = require('socket.io');
var http = require('http');


// imports external middlewares
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var session = require('express-session')

//import native middlewares
var main_route = require('./routes/index');
var users_route = require('./routes/users');
var scripts_route = require('./routes/scripts');
var edms = require('./lib/lib');

//initialize app
var app = express();
//sets the views location  
//sets view engine to jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//sets deployment setting to development
app.set('env','development');

//invoking middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//sets sessions,logger,bodyparser,cookieparser, and static external middlewares
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'perlasngsilanganan', 
  cookie: { maxAge: 3600000 }
 } ));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//sets native middlewares
app.use('/', main_route);
app.use('/users', users_route);
app.use('/scripts', scripts_route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// display error message if env is 'development', none if otherwise
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}else {
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
    });
 });
}

var port = process.env.PORT || 3000;

//console.log('Cache is %s', app.get('view cache'));

//configures database

//configure socket.io
var server = http.Server(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket){
  socket.on('data',function(username){
    console.log('getting data for %s', username);
    edms.u.findOne({username:username},function(doc){
      if(doc){
        console.log('data found, now sending data to %s', username);
        socket.emit('data',doc);
      }
    });
  });
});

edms.d.db.open(function(err){
  if(!err) {
    server.listen(port, function(){
      console.log('App is listening at %s in %s',port,app.get('env'));
    });
  } else {
    console.log('Unable to connect to the database.');
  }
}); 


