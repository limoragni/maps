var IoEvents = new Class({
	
	initialize: function(){
		//STABLISH SOCKET CONNECTION
		clientServer.connect();
		this.setCallbacks();
	},

	createGame: function(){
		$('multiplayer-parent').setStyle('display', 'none');
		//ASK SERVER FOR GAME CREATTON. RECIVES BACK THE GAME OBJECT
		clientServer.socket.emit('createGame', game.session.username);
		clientServer.socket.on('createGame_back', function(data){
			console.log('THE GAME: ' + data.id + ' WAS CREATED');
			mainMenu.showJoined(data.players);
			game.propertiesSet(data); 
		})
	},
	
	joinGame: function(){
		mainMenu.nextScreen('join-parent', 'multiplayer-parent')
		var inputs = document.getElementsByTagName('input');
		for (i in inputs){
			if(inputs[i].type == "radio" && inputs[i].checked){
				var joinedGame = inputs[i].value
			}
		}
		
		//JOIN THE GAME
		console.log("YOU HAVE JOINED TO: " + joinedGame)
		game.session.joinedGame = joinedGame
		clientServer.socket.emit('join', game.session);
		
		//LISTEN FOR GAME TO START
		console.log('WAITING FOR START');
		var self = this;
	},

	showGames: function(){
		//SHOW MULTIPLAYER OPTIONS.
		mainMenu.nextScreen('multiplayer-parent', 'mod-parent')
		
		
		//ASK FOR LISTED GAMES
		clientServer.socket.emit('askGames', null);
		
		clientServer.socket.on('askGames_back', function(data){
			console.log('SHOWING GAMES: ');
			console.log(data);
			mainMenu.showGames(data);
		})
	},

	

	startGame: function(){
		game.setQueue();
		//BROADCAST GAME OBJECT TO ALL PARTICIPANTS
		clientServer.socket.emit('start', game.propertiesGet());
	},

	setCallbacks: function(){
		//LISTEN FOR CLICKS ON REGIONS
		clientServer.socket.on('click_back', function (data) {
			var region = map.getRegionById(data);
			events.guess(region, 'foreign');
		});

		//LISTEN FOR SERVER RESPONSE ON START
		clientServer.socket.on('start_back', function (data) {
			game.propertiesSet(data);
			console.log('First Move: ' + game.players.current);
			router.send('events-start', null);
		});

		//LISTEN FOR NEW CREATED GAMES (REFRESH THE LIST)
		clientServer.socket.on('refreshGames', function(data){
			mainMenu.showGames(data);
		})

		//LISTEN FOR NEW PLAYERS TO JOIN
		clientServer.socket.on('join_back', function (data) {
			console.log("NEW PLAYER ADDED TO THE GAME");
			game.propertiesSet(data);
			mainMenu.showJoined(data.players);
		});
	}
});