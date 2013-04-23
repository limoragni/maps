var IoEvents = new Class({
	
	initialize: function(){

	},

	joinGame: function(joinedGame){
		console.log("Selected Game on joinGame: " + joinedGame)
		game.session.joinedGame = joinedGame
		console.log("Session Object to send on join");
		console.log(game.session);
		clientServer.socket.emit('join', game.session);
		clientServer.socket.on('join_back', function (data) {
			console.log('Join_Back');
			console.log(data);
			game.propertiesSet(data);
			mainMenu.showJoined(data.players);
		});

		clientServer.socket.on('click_back', function (data) {
			var region = map.getRegionById(data);
			events.guess(region, 'foreign');
		});
		/*
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
		*/
	},

	showGames: function(){
		clientServer.connect();
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
			mainMenu.showJoined(data.players);
			game.propertiesSet(data);
			clientServer.socket.on('join_back', function (data) {
			console.log('Join_Back');
			console.log(data);
			game.propertiesSet(data);
			mainMenu.showJoined(data.players);
		});
		})
	}
});