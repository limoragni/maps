
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
		console.log('STARTING GAME...');
		console.log(game);
		game.currentPlayer = game.getPlayerByNumber(1).id;
		mainMenu.hide();
		if(game.myTurn()){
			map.allowClick();
		}
		
		this.ask();
	},

	ask: function(){
		console.log('PLAYER:' + game.currentPlayer);
		console.log('COUNTRY:' + game.currentRegion.name);
		interface.printRegion(game.currentRegion.name);
		interface.printPlayer(game.currentPlayer);
	},

	guess: function(region, from){
		map.preventClick();
		console.log('Clicked By: ' + game.currentPlayer);
		console.log('CLicked on: ' + region.info.name);
		game.chance += 1;
		(region.id == game.currentRegion.id) ? this.success(region, from) : this.fail(region, from);
	},

	success: function(region, from){
		console.log('SUCCESS');
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
		console.log('CHANCE NUMBER: ' + game.chance + 'PLAYERS LENGHT: ' + game.playersLength);
		if(game.chance >= game.playersLength){
			this.outOfChance(region, from);
		}else{
			console.log(game.currentPlayer + ' FAIL, NEXT PLAYER');
			game.nextPlayer();
			if(from != "foreign") clientServer.socket.emit('click', {region: region.id, gameId: game.id});
			events.ask();
		}
	},

	outOfChance: function(region, from){
		game.chance = 0;
		console.log('NO CHANCE');
		map.regions[game.currentRegion.id].node.attr('fill', '#FF0000');
		game.nextPlayer();
		game.nextItem();
		this.ask();
		if(from != "foreign") clientServer.socket.emit('click', {region: region.id, gameId: game.id});
	},

	end: function(){

	}
})


