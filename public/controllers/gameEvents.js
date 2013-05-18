
var GameEvents = new Class({
	
	initialize: function(){

	},

	onLogin: function(session){
		game.session = session;
		clientServer.setPlayerId(session.username);
		mainMenu.show();
		mainMenu.mod();
	},

	noLogin: function(){
		mainMenu.show();
	},
	
	start: function(){
		//SET GAME OBJECT
		game.currentPlayer = game.getPlayerByNumber(1).id;
		mainMenu.hide();
		if(game.myTurn()){
			map.allowClick();
		}
		
		this.ask();
	},

	ask: function(){
		interface.printRegion(game.currentRegion.name);
		interface.printPlayer(game.currentPlayer);
	},

	guess: function(region, from){
		map.preventClick();
		console.log('CLicked on: ' + region.info.name);
		game.chance += 1;
		(region.id == game.currentRegion.id) ? this.success(region, from) : this.fail(region, from);
	},

	success: function(region, from){
		$('audio-coin').play();
		game.nextItem();
		game.addScore();
		interface.printScore();
		game.nextPlayer();
		game.chance = 0;
		region.node.attr('fill', game.players[game.currentPlayer].color);
		if(from != "foreign") clientServer.socket.emit('click', {region: region.id, gameId: game.id});
		this.ask();
	},

	fail: function(region, from){
		$('audio-error').play();
		map.highlight();
		map.highlight(region);	
			
		if(game.chance >= game.playersLength){
			this.outOfChance(region, from);
		}else{
			game.nextPlayer();
			if(from != "foreign") clientServer.socket.emit('click', {region: region.id, gameId: game.id});
			events.ask();
		}
	},

	outOfChance: function(region, from){
		$('audio-error').play();
		game.chance = 0;
		var c = map.regions[game.currentRegion.id]
		
		var cam = c.cameraPosition();
		map.goto(cam, function(){
			c.node.animate({fill:'#FF0000'}, 1000, 'linear', function(){

			});
		});
		game.nextPlayer();
		game.nextItem();
		this.ask();
		if(from != "foreign") clientServer.socket.emit('click', {region: region.id, gameId: game.id});
	},

	end: function(){

	}
})


