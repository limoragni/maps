
///// SERVER OBJECT /////
function Server(){
	this.games = {};
	this.list = {};
};

Server.prototype = {
	createGame: function(creator, colors){
		var g =	new Game(creator, colors);
		this.games[g.id] = g; 
		this.list[g.id] = {
			id: g.id,
			status: g.status
		}
		return g;
	},

	closeGame: function(id){
		delete this.list[id];
		delete this.games[id]; //TODO save the game after delete.
	}
}

////// GAME OBJECT /////
function Game(creator, colors){
	this.setId(creator);
	this.players = {};
	this.playersLength = 0;
	this.colors = colors;
	this.status = 0; // 1 playing - 0 available
};

Game.prototype = {
	getPublics: function(){
		return {
			id: this.id,
			players: this.players,
			status: this.status
		}
	},

	setPublics: function(ob){
		for (i in ob){
			if (this[i]){
				this[i] = ob[i];
			}else{
				throw 'The index ' + i + 'is not a valid entry of the object game';
			}
		}
	},

	setId: function(creator){
		this.date = new Date();
		this.id = creator + '_' + this.date.valueOf().toString();
	},

	setPlayer: function(id, socket){
		this.playersLength += 1;
		var color = this.colors[this.playersLength]
		var player = new Player(id, color, socket, this.playersLength);
		this.players[player.id] = player;
		return player;
	},
}

///// PLAYER OBJECT /////
function Player(id, color, socket, number){
	this.id = id;
	this.color = color;
	this.socket = socket;
	this.number = number
};

module.exports = new Server();
