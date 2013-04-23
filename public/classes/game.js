var Game = new Class({
	
	session:{},
	regions:{},
	queue:[],
	currentRegion:{},
	players:{},
	options:{},
	svg:{},

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
		this.players = data;
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
			options: this.options
		}
		return r;
	},

	nextPlayer: function(){
		var c = this.players.current;
		var n = this.players[c].number;
		var add = n + 1;
		if(add > this.players.lenght){
			var set = 1;
		}else{
			var set = add;
		}
		var player = this.getPlayerByNumber(set);
		this.players.current = player.id;
		if(this.players.current == this.session.username){
			this.svg.allowClick();
		}
	},

	getPlayerByNumber: function(n){
		var r= null;
		for (v in this.players){
			if(parseInt(this.players[v].number) == n){
				var r = this.players[v]
			}
		}
		r = (!r) ? null : r;
		return r
	},

	addScore: function(){
		this.players[this.players.current].score += 1;
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

	initialize: function(id, color, number){
		this.color = color;
		this.id = id;
		this.number = number
	},

	

});
