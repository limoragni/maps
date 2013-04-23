var IoEvents = new Class({
	
	initialize: function(){

	},

	join: function(){
		

		console.log('Sending session: ' + game.session.username);
		clientServer.socket.emit('join', game.session.username);
		
		clientServer.socket.on('join_back', function (data) {
			console.log('Reciving join_back data: ');
			console.log(data)
			game.setPlayer(data);
		});

		clientServer.socket.on('click_back', function (data) {
			var region = map.getRegionById(data);
			events.guess(region, 'foreign');
		});
	},

	showGames: function(){
		console.log('X');
		clientServer.connect(db.options.host);
		clientServer.socket.emit('askGames', null);
		clientServer.socket.on('askGames_back', function(data){
			mainMenu.showGames(data);
		})
		clientServer.socket.on('refreshGames', function(data){
			mainMenu.showGames(data);
		})
		mainMenu.multiplayer();
	},

	createGame: function(){
		
		clientServer.socket.emit('createGame', game.session.username);
		clientServer.socket.on('createGame_back', function(data){
			mainMenu.showGames(data);
			game.propertiesSet(data);
		})
	}
});