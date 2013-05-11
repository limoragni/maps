
///// SERVER OBJECT /////
function Server(){
	this.games = {};
	this.list = {};
};

Server.prototype = {
	createGame: function(creator, colors, socket){
		var g =	new Game(creator, colors, socket);
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
	},

	isCreator: function(socket){
		for(i in this.games){
			console.log(this.games[i].creator.socket)
			if(this.games[i].creator.socket == socket)
				return this.games[i].id;
		}
	}
}

////// GAME OBJECT /////
function Game(creator, colors, socket){
	this.setId(creator);
	this.players = {};
	this.playersLength = 0;
	this.currentPlayer = '';
	this.colors = colors;
	this.status = 0; // 1 playing - 0 available
	this.queue = [];
	this.currentRegion = {};
	this.options = {};
	this.chance = 0;
	this.creator = {
		id: creator,
		socket: socket
	};
};

Game.prototype = {
	getPublics: function(){
		var r = {}
		for (i in this){
			if (typeof this[i] != 'function'){
				r[i] = this[i];
			}
		}
		return r;
	},

	setPublics: function(ob){
		for (i in ob){
			if ( typeof this[i] != 'undefined'){
				this[i] = ob[i];
			}else{
				throw 'The index ' + i + ' is not a valid entry of the object game';
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
		var player = new Player(id, color, socket, this.playersLength, this.id);
		this.players[player.id] = player;
		return player;
	},
}

///// PLAYER OBJECT /////
function Player(id, color, socket, number, gameId){
	this.id = id;
	this.color = color;
	this.socket = socket;
	this.number = number;
	this.gameId = gameId;
	this.score = 0;
};

module.exports = new Server();
