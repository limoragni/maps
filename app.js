var config = require('./config');
var nomo = require('node-monkey').start();

var express = require('express')
  , http = require('http')

var app = express();
var MongoStore = require('connect-mongo')(express);
console.log(config.db)
var sessionStore = new MongoStore({url:config.db});
 
var server = app.listen(1344);
var io = require('socket.io').listen(server);

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'secret', store: sessionStore}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
})

require('./controllers/router')(app);
require('./controllers/socket')(io); 

