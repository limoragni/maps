
var GameEvents = new Class({
	
	initialize: function(){

	},

	onLogin: function(session){
		game.session = session;
		console.log(session);
		mainMenu.show();
		mainMenu.mod(function(mod){
			if(mod == 'multiplayer') ioEvents.showGames();
		});
	},

	noLogin: function(){
		mainMenu.show();
	},

	

	start: function(){
		game.players.current = game.getPlayerByNumber(1).id;
		game.setQueue();
		
		map.allowClick();
		clientServer.socket.emit('start', game.propertiesGet());
		clientServer.socket.on('start_back', function (data) {
			console.log('Reciving start_back data: ');
			console.log(data);
			game.propertiesSet(data);
			console.log('First Move: ' + game.players.current);
			mainMenu.hide();
		});
		
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
		if(game.chance >= game.players.lenght){
			this.outOfChance(region, from);
		}else{
			console.log(game.players.current + ' FAIL, NEXT PLAYER');
			game.nextPlayer();
			if(from != "foreign") clientServer.socket.emit('click', region.id);
		}
	},

	outOfChance: function(region, from){
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


