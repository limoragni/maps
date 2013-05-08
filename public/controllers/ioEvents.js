var IoEvents = new Class({
	
	initialize: function(){
		//STABLISH SOCKET CONNECTION
		clientServer.connect();
		
	},

	//CREATES A NEW MULTIPLAYER GAME
	createGame: function(){
		mainMenu.nextScreen('join-parent', 'multiplayer-parent');
		//ASK SERVER FOR GAME CREATTON. RECIVES BACK THE GAME OBJECT
		clientServer.socket.emit('createGame', game.session.username);
		clientServer.socket.on('createGame_back', function(data){
			console.log('THE GAME: ' + data.id + ' WAS CREATED');
			mainMenu.showJoined(data.players);
			game.propertiesSet(data); 
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

	initPointers: function(){
		console.log('WTF')
		var lastEmit = (new Date).getTime();
		document.addEvent('mousemove', function(e){
			if( (new Date).getTime() - lastEmit > 30){
				clientServer.socket.emit('move',{
					'x': e.page.x,
					'y': e.page.y,
					'id': game.session.username
				});
				lastEmit = (new Date).getTime();
			}
		})
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
			self.initPointers();
			console.log('DATA FROM START BACK')
			console.log(data)
			game.propertiesSet(data);
			console.log('First Move: ' + game.currentPlayer);
			router.send('events-start', null);
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
		});

		var buffer=[];
		var last = (new Date).getTime();
		clientServer.socket.on('move_back', function(data){
			console.log(buffer[0])
			if(!buffer[0]){
				var inter = setInterval(function(){
					console.log((new Date).getTime() - last);
					last = (new Date).getTime();
					if(buffer[0]){
						ui.pointers[buffer[0].id].setStyles({
							left: buffer[0].x,
							top: buffer[0].y
						});
						buffer.erase(buffer[0]);
					}else{
						 console.log('CLEAR');
						 clearInterval(inter);
					}
					
				}, 30);
			}
			buffer.push(data);
			
			
		});

		
	}
});