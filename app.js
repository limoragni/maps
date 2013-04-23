var express = require('express')
  , http = require('http')

var app = express();
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore({
	db: 'maps',
	host: 'localhost'
})

var server = app.listen(1344);
var io = require('socket.io').listen(server);

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'secret', store: sessionStore}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
})

app.get('/check', function(req, res){
	res.contentType('json');
  	//res.send({ some: JSON.stringify({response:req.session.message}) });
  	res.json({username:req.session.username});
})


app.post('/register', function(req,res){
	
	var User = require('./models/Users')
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/maps', function(err){
		if (err) throw err;
		console.log('Successfully connected to MongoDB');
	});
	var username = req.body.username.value;
	var password = req.body.username.value;
	
	User.findOne({username: username}, function(err, user){
		if (err) throw err;
		
		if(!user){
			var newUser = new User({
				username: username,
				password: password
			});
			newUser.save(function(err){
				if (err) throw err;
				req.session.username = username;
				console.log('User saved');
				mongoose.connection.close();
				res.json({username:req.session.username});
			});
		
		}else{
			user.comparePassword(password, function(err, isMatch) {
        		if (err) throw err;
        		if(isMatch){
        			req.session.username = username;
        			console.log('login');
        		}else{
        			console.log('logout');
        		}
        		
        		
			mongoose.connection.close();
			res.json({username:req.session.username});
        	});
		}
		
	});
	
  	
})

var games = {}
games.list = {};
games.list['default'] = 'default';
var colors = {
	0:'#004444',
	1:'#004400',
	2:'#000044'
};


io.sockets.on('connection', function (socket) {

	socket.on('createGame', function(data){
		games[data] = {};
		games[data].count = 0;
		games[data].players = {};
		 
		games[data].players[data] = {id: data, number: games[data].count + 1, color: colors[games[data].count]}
		games[data].players.lenght = games[data].count + 1;
		var send = games[data];
		games[data].count += 1;
		games.list[data] = data;
		io.sockets.emit('createGame_back', games.list);
	})

	socket.on('askGames', function(n){
		socket.emit('askGames_back', games.list);
	})
	
	socket.on('join', function(data){
		game.players[data] = {id: data, number: count + 1, color: colors[count]}
		game.players.lenght = count + 1;
		var send = game.players;
		io.sockets.emit('join_back', game.players)
		count += 1;
	});
	
	socket.on('click', function (data) {
		socket.broadcast.emit('click_back', data);
	});

	socket.on('start', function(data){
		game = data;
		io.sockets.emit('start_back', game);
	})
	
});

