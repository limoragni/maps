var UiEvents = new Class({
	
	initialize: function(){

	},

	singlePlayer: function(){
		mainMenu.nextScreen('singlePlayer-parent', 'mod-parent');
		game.options.mod = 'sp';
		game.setPlayer({
			id: game.session.username,
			color: "004444",
			number: 1,
		})
		game.playersLength = 1;
	},

	setLevel: function(data){
		var radio = mainMenu.getRadio('radio-level');
		var lvl = radio;
		if(game.options.mod == 'sp'){
			game.options.level = lvl;
		}
		game.setQueue();
		events.start();
	}
});