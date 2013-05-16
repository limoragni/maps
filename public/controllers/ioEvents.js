var IoEvents = new Class({
	
	initialize: function(){
		//STABLISH SOCKET CONNECTION @TODO: JUST WHEN MULTIPLAYER IS ON
		clientServer.connect();
	},

	//CREATES A NEW MULTIPLAYER GAME
	createGame: function(){
		mainMenu.nextScreen('join-parent', 'multiplayer-parent');
		$('ioEvents-startGame').setStyle('display', 'block')
		//ASK SERVER FOR GAME CREATTON. RECIVES BACK THE GAME OBJECT
		clientServer.socket.emit('createGame', game.session.username);
		clientServer.socket.on('createGame_back', function(data){
			console.log('THE GAME: ' + data.id + ' WAS CREATED');
			mainMenu.showJoined(data.players);
			game.propertiesSet(data);
			clientServer.setGameId(data.id);
		})
	},
	
	//JOIN TO A MULTIPLAYER GAME
	joinGame: function(){
		mainMenu.nextScreen('join-parent', 'multiplayer-parent')
		console.log('INPUTS')
		var radio = mainMenu.getRadio('radio-game');
		var joinedGame = radio;
		
		//SEND INFO TO THE SERVER
		console.log("YOU HAVE JOINED TO: " + joinedGame)
		game.session.joinedGame = joinedGame
		clientServer.socket.emit('join', game.session);
		
		//LISTEN FOR GAME TO START
		console.log('WAITING FOR START');
		var self = this;
	},

	//SHOW A LIST OF AVAILABLE GAMES
	showGames: function(){
		//SET THE CALLBACKS FOR MULTIPLAYER INTERACTION
		this.setCallbacks();
		game.options.mod = 'mp';
		
		//SHOW MULTIPLAYER OPTIONS.
		mainMenu.nextScreen('multiplayer-parent', 'mod-parent')
		
		//GET THE GAME LIST FROM THE SERVER
		clientServer.socket.emit('askGames', null);
		clientServer.socket.on('askGames_back', function(data){
			console.log('SHOWING GAMES: ');
			console.log(data);
			mainMenu.showGames(data);
		})
	},

	
	//START THE MULTIPLAYER GAME
	startGame: function(){
		//CREATE THE LIST OF COUNTRIES TO PLAY WITH
		game.setQueue();
		//BROADCAST GAME OBJECT TO ALL PARTICIPANTS
		clientServer.socket.emit('start', game.propertiesGet());
	},

	//SET GENERAL CALLBACKS FOR SOCKET INTERACTION
	setCallbacks: function(){
		var self = this;
		//LISTEN FOR CLICKS ON REGIONS
		clientServer.socket.on('click_back', function (data) {
			console.log('REGION');
			console.log(data);
			var region = map.getRegionById(data.region);
			console.log(region);
			events.guess(region, 'foreign');
		});

		//LISTEN FOR SERVER RESPONSE ON START
		clientServer.socket.on('start_back', function (data) {
			ui.setPointers(game.players, 'pointers', game.session.username);
			console.log('DATA FROM START BACK')
			console.log(data)
			game.propertiesSet(data);
			console.log('First Move: ' + game.currentPlayer);
			router.send('events-start', null);
			clientServer.canvasEvents();
		});

		//LISTEN FOR NEW CREATED GAMES (REFRESH THE LIST)
		clientServer.socket.on('refreshGames', function(data){
			mainMenu.showGames(data);
		});

		//LISTEN FOR NEW PLAYERS TO JOIN
		clientServer.socket.on('join_back', function (data) {
			console.log("NEW PLAYER ADDED TO THE GAME");
			game.propertiesSet(data);
			mainMenu.showJoined(data.players);
			clientServer.setGameId(data.id);
		});

		clientServer.socket.on('move_back', function(data){
			clientServer.buffer('pointers', 30, data ,function(el){
				ui.pointers[el.id].setStyles({
					left: el.x,
					top: el.y
				});
			});
		});

		clientServer.socket.on('zoom_back', function(data){
			clientServer.buffer('zoom', 30, data ,function(el){
				clientServer.setMatrix(el);
			});

		});

		clientServer.socket.on('pan_back', function(data){
			clientServer.buffer('pan', 30, data ,function(el){
				clientServer.setMatrix(el);
			});
		});

		clientServer.socket.on('chat_back', function(data){
			console.log(data);
			chat.write(data.text, data.user);
		});

		clientServer.socket.on('disconnect_back', function(data){
			alert('The Game creator is disconnected!');
		});
	}
});