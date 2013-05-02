var config = require('./config');

if(process.env.SUBDOMAIN){
	var db = config.db.prod;
}else{
	var db = config.db.local;
}


var express = require('express')
  , http = require('http')

var app = express();
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore(db);
 
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

