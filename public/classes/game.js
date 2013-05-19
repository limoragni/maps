var Game = new Class({
	
	session:{}, //@TODO MOVE TO AUTH
	name:'',
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

	//TAKES THE REGIONS LIST, SHUFFLE IT, AND SER THE FIRST REGION TO PLAY.
	setQueue: function(){
		var i = 0;
		for(v in this.regions){
			this.queue[i] = v;
			i++;
		}
		this.queue.shuffle();
		this.currentRegion = {name: this.regions[this.queue[0]].name, id: this.queue[0]};
	},

	//IF THERE ARE REGIONS LEFT, DELETES CURRENT ONE FROM THE LIST AND SET NEXT ONE TO PLAY
	//IF THER ARE NO REGIONS LEFT, TRIGGER THE ENDING FUNCTION.
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

	//SET GIVEN PROPERTIES TO THE GAME OBJECT
	propertiesSet: function(data){
		for (v in data){
			this[v] = data[v];
		}
	},

	//GET GAME PROPERTIES
	propertiesGet: function(){
		var r = {
			queue: this.queue,
			currentRegion: this.currentRegion,
			players: this.players,
			options: this.options,
			chance: this.chance,
			id: this.id,
			name: this.name
		}
		return r;
	},

	//CHANGE PLAYER TURN. IF IS THE TURN OF THE PLAYER IN SESSION, ALLOW HIM TO CLICK ON THE REGIONS. 
	nextPlayer: function(){
		var c = this.currentPlayer,
			n = this.players[c].number,
			add = n + 1;
		
		if(add > this.playersLength){
			var set = 1;
		}else{
			var set = add;
		}
		
		var player = this.getPlayerByNumber(set);
		this.currentPlayer = player.id;
		if(this.myTurn()){
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
	},

	myTurn: function(){
		if(this.currentPlayer == this.session.username){
			return true;
		}else{
			return false;
		}
			
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
