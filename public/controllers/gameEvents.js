
var GameEvents = new Class({
	
	initialize: function(){

	},

	onLogin: function(session){
		game.session = session;
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
		game.players.current = game.getPlayerByNumber(1).id;
		map.allowClick();
		mainMenu.hide();
		this.ask();
	},

	ask: function(){
		console.log('PLAYER:' + game.players.current);
		console.log('COUNTRY:' + game.currentRegion.name);
	},

	guess: function(region, from){
		map.preventClick();
		console.log('Clicked By: ' + game.players.current);
		console.log('CLicked on: ' + region.info.name);
		game.chance += 1;
		(region.id == game.currentRegion.id) ? this.success(region, from) : this.fail(region, from);
	},

	success: function(region, from){
		console.log('SUCCESS');
		game.nextItem();
		game.addScore();
		game.nextPlayer();
		game.chance = 0;

		region.node.attr('fill', game.players[game.players.current].color);
		if(from != "foreign") clientServer.socket.emit('click', region.id);
		this.ask();
	},

	fail: function(region, from){
		console.log('CHANCE NUMBER: ' + game.chance + 'PLAYERS LENGHT: ' + game.players.lenght);
		if(game.chance >= game.players.lenght){
			this.outOfChance(region, from);
		}else{
			console.log(game.players.current + ' FAIL, NEXT PLAYER');
			game.nextPlayer();
			if(from != "foreign") clientServer.socket.emit('click', region.id);
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
		if(from != "foreign") clientServer.socket.emit('click', region.id);
	},

	end: function(){

	}
})


