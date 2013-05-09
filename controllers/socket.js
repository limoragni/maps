module.exports = function(io){

	var server = require('../classes/server');
	var config = require('../config');
	io.set('log level', 1);
	io.sockets.on('connection', function (socket) {

		socket.on('askGames', function(n){
			socket.emit('askGames_back', server.list);
			
		});
		
		socket.on('createGame', function(data){
			var g = server.createGame(data, config.game.colors);
			g.setPlayer(data, socket.id);
			socket.join(g.id);
			console.log(socket);
			socket.emit('createGame_back', g.getPublics());
			io.sockets.emit('refreshGames', server.list);
		});

		socket.on('join', function(data){
			var g = server.games[data.joinedGame];
			g.setPlayer(data.username, socket.id);
			socket.join(g.id);
			io.sockets.in(g.id).emit('join_back', g);
		});
		
		socket.on('click', function (data) {
			console.log(data);
			socket.broadcast.to(data.gameId).emit('click_back', data);
		});

		socket.on('start', function(data){
			server.games[data.id].setPublics(data);
			io.sockets.in(data.id).emit('start_back', server.games[data.id].getPublics());
		});

		socket.on('disconnect', function(){
			/*for (g in games){
				if(games[g].socket == socket.id){
					delete games[g];
					delete games.list[g];
				}
			}
			*/
		});

		socket.on('move', function(data){
			socket.broadcast.to(data.gameId).emit('move_back', data);
		});

		socket.on('zoom', function(data){
			socket.broadcast.to(data.gameId).emit('zoom_back', data.matrix);
		});

		socket.on('pan', function(data){
			socket.broadcast.to(data.gameId).emit('pan_back', data.matrix);
		});

		socket.on('chat', function(data){
			socket.broadcast.to(data.game).emit('chat_back', data);
		});
		
	});
}

