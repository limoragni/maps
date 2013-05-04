var Game = new Class({
	
	session:{},
	regions:{},
	queue:[],
	currentRegion:{},
	players:{},
	playersLength: 0,
	currentPlayer:'',
	options:{
		level: '',
		mod: ''
	},
	svg:{},
	chance: 0,
	id: '',
	date: 0,

	initialize: function(regions, svg){
		this.regions = regions;
		this.svg = svg;
	},

	setQueue: function(){
		var i = 0;
		for(v in this.regions){
			this.queue[i] = v;
			i++;
		}
		this.queue.shuffle();
		this.currentRegion = {name: this.regions[this.queue[0]].name, id: this.queue[0]};
	},

	nextItem: function(){
		if(this.queue[1]){
			this.currentRegion = {name: this.regions[this.queue[1]].name, id: this.queue[1]}
			this.queue.erase(this.queue[0]);
		}else{
			events.end();
		}
		
	},

	setPlayer: function(data){
		this.players[data.id] = new Player(data);
	},

	propertiesSet: function(data){
		for (v in data){
			this[v] = data[v];
		}
	},

	propertiesGet: function(){
		var r = {
			queue: this.queue,
			currentRegion: this.currentRegion,
			players: this.players,
			options: this.options,
			chance: this.chance,
			id: this.id
		}
		return r;
	},

	nextPlayer: function(){
		var c = this.currentPlayer;
		var n = this.players[c].number;
		var add = n + 1;
		if(add > this.playersLength){
			var set = 1;
		}else{
			var set = add;
		}
		var player = this.getPlayerByNumber(set);
		this.currentPlayer = player.id;
		if(this.currentPlayer == this.session.username){
			this.svg.allowClick();
		}
	},

	getPlayerByNumber: function(n){
		
		for (v in this.players){
			console.log(this.players[v].number + '  ' + n);
			if(parseInt(this.players[v].number) == n){
				var r = this.players[v]
			}
		}
		r = (!r) ? null : r;
		return r
	},

	addScore: function(){
		this.players[this.currentPlayer].score += 1;
	}

});

var Player = new Class({

	id: '',
	number: 0,
	color: '',
	score: 0,
	regions:{
		guess:{},
		error:{}
	},

	initialize: function(op){
		for (i in op){
			this[i] = op[i];
		}
	},

	

});
