var IoEvents = new Class({
	
	initialize: function(){

	},

	createGame: function(){
		
		//ASK SERVER FOR GAME CREATTON. RECIVES BACK THE GAME OBJECT
		clientServer.socket.emit('createGame', game.session.username);
		clientServer.socket.on('createGame_back', function(data){
			console.log('THE GAME: ' + data.id + ' WAS CREATED');
			mainMenu.showJoined(data.players);
			//game.propertiesSet(data); TEORICAMENTE NO ES NECESARIO REFRESCAR DATOS EN ESTA INSTANCIA
			
			//AFTER CREATE, LISTEN FOR FURTHER JOININGS
			clientServer.socket.on('join_back', function (data) {
				console.log("NEW PLAYER ADDED TO THE GAME");
				//game.propertiesSet(data); TEORICAMENTE NO ES NECESARIO REFRESCAR DATOS EN ESTA INSTANCIA
				mainMenu.showJoined(data.players);
			});
		})
	},
	
	joinGame: function(joinedGame){
		
		//JOIN THE GAME
		console.log("YOU HAVE JOINED TO: " + joinedGame)
		game.session.joinedGame = joinedGame
		clientServer.socket.emit('join', game.session);
		
		//LISTEN FOR NEW PLAYERS TO JOIN
		clientServer.socket.on('join_back', function (data) {
			console.log("NEW PLAYER ADDED TO THE GAME");
			game.propertiesSet(data);
			mainMenu.showJoined(data.players);
		});

		//LISTEN FOR GAME TO START
		console.log('WAITING FOR START');
		var self = this;
		clientServer.socket.on('start_back', function (data) {
			game.propertiesSet(data);
			console.log('First Move: ' + game.players.current);
			mainMenu.hide();
			events.ask();
			self.startGame();
		});
	},

	showGames: function(){
		//SHOW MULTIPLAYER OPTIONS. ADD LISTENER TO BUTTONS
		mainMenu.multiplayer();
		//STABLISH SOCKET CONNECTION
		clientServer.connect();
		
		//ASK FOR LISTED GAMES
		clientServer.socket.emit('askGames', null);
		clientServer.socket.on('askGames_back', function(data){
			console.log('SHOWING GAMES: ');
			console.log(data);
			mainMenu.showGames(data);
		})
		
		//LISTEN FOR NEW CREATED GAMES (REFRESH THE LIST)
		clientServer.socket.on('refreshGames', function(data){
			mainMenu.showGames(data);
		})
	},

	

	startGame: function(){
		//LISTEN FOR CLICKS ON REGIONS
		clientServer.socket.on('click_back', function (data) {
			var region = map.getRegionById(data);
			events.guess(region, 'foreign');
		});
	}
});