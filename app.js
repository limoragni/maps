var $config = {
	prod: {
		url: 'mongodb://nodejitsu_limoragni:rmvu66uk7rjj263topikd6kjf5@ds059887.mongolab.com:59887/nodejitsu_limoragni_nodejitsudb2595313817'
	},
	local:{
		url: 'mongodb://localhost/maps'
	}
};

if(process.env.SUBDOMAIN){
	var config = $config.prod;
}else{
	var config = $config.local;
}


var express = require('express')
  , http = require('http')

var app = express();
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore(config);
 
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
	mongoose.connect(config.url, function(err){
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


///// SERVER OBJECT /////
function Server(){
	this.games = {};
	this.list = {};
};

Server.prototype.createGame = function(creator, colors){
	this.games[id] = new Game(creator, colors);
	this.list[id] = {
		id: game.id,
		status: game.status
	}
};

Server.prototype.closeGame = function(id){
	delete this.list[id];
	delete this.games[id]; //TODO save the game after delete.
};


/*Server.prototype.gameList = function(){
	var list = {};
	for (g in this.games){
		var game = this.games[g];
		list[g] = {
			id: game.id,
			status: game.status
		};
	}
};*/

////// GAME OBJECT /////
function Game(creator, colors){
	this.id = this.setId(creator);
	this.players = {};
	this.colors = colors;
	this.status = 0; // 1 playing - 0 aviable
};

Game.prototype.setId = function(){
	this.date = new Date();
	this.id = creator + this.date.valueOf();
};

Game.prototype.setPLayer = function(id, color){
	this.players[id] = id;
	this.players[id].number = this.players.lenght;
	this.players[id].color = this.colors[this.players.lenght];

};

///// PLAYER OBJECT /////
function Player(id, color){
	this.id = id;
	this.color = color;
	this.socket = '';
};

var server = new Server();

var colors = {
	0:'#004444',
	1:'#004400',
	2:'#000044'
};


io.sockets.on('connection', function (socket) {

	socket.on('askGames', function(n){
		socket.emit('askGames_back', server.list);
	})
	
	socket.on('createGame', function(data){
		games[data] = {};
		games[data].count = 0;
		games[data].players = {};
		games[data].id = data;
		games[data].socket = socket.id;
		 
		games[data].players[data] = {id: data, number: games[data].count + 1, color: colors[games[data].count]}
		games[data].players.lenght = games[data].count + 1;
		var send = games[data];
		games[data].count += 1;
		games.list[data] = data;
		socket.emit('createGame_back', games[data]);
		io.sockets.emit('refreshGames', games.list);
	})

	
	
	socket.on('join', function(data){
		games[data.joinedGame].players[data.username] = {id: data.username, number: games[data.joinedGame].count + 1, color: colors[games[data.joinedGame].count]}
		games[data.joinedGame].players.lenght = games[data.joinedGame].count + 1;
		var send = games[data.joinedGame].players;
		io.sockets.emit('join_back', games[data.joinedGame]);
		games[data.joinedGame].count += 1;
	});
	
	socket.on('click', function (data) {
		socket.broadcast.emit('click_back', data);
	});

	socket.on('start', function(data){
		games[data.id] = data;
		io.sockets.emit('start_back', games[data.id]);
	})

	socket.on('disconnect', function(){
		for (g in games){
			if(games[g].socket == socket.id){
				delete games[g];
				delete games.list[g];
			}
		}
	})
	
});
