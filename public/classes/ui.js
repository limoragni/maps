var Ui = new Class({
	
	pointers:{},
	buttons:{},

	initialize: function(){
		this.setEvents();
	},

	setEvents: function(){
		var self = this;
		this.buttons = $$('.event');
		this.buttons.each(function(item){
			item.addEvent('click', function(){
				console.log('The button with ID: ' + item.id + ' has been clicked');
				router.send(item.id, item);
			});
		});
	},

	formatInputs: function(b){
		var f = b.id,
			i = $(b).getAllPrevious('input'),
			data = {data:{}};
		
		$$(i).each(function(i){
			data.data[i.id] = {
				value: i.value,
				id: i.id,
				name: i.name,
			}
		});
		return data;
	},

	
	grayOut: function(state){
		
		if(!state && !$('ui-grayout')){
			var div = document.createElement('div');
			$$('body')[0].appendChild(div);
			div.style.position = 'absolute';
			div.style.width = '100%';
			div.style.height = '100%';
			div.style.opacity= '0.5';
			div.style.backgroundColor = '#000';
			div.style.zIndex = '1000';
			div.style.left = '0px';
			div.style.top = '0px';
			div.id = 'ui-grayout';
		}else if(state == 'off'){
			if($('ui-grayout')){
				$('ui-grayout').setStyle('display', 'none')
			}
		}
	},

	nextScreen: function(isin, out){
		console.log(isin);
		console.log(out);
		$(isin).setStyle('display', 'block');
		$(out).setStyle('display', 'none');
	},

	getRadio: function(cl){
		var r = null;
		$$('.' + cl).each(function(el){
			if(el.checked){
				console.log(el.value)
				r = el.value;
			}
			
		});
		return r;
	},

	getInputs: function(cl){
		var r ={};
		$$('.' + cl).each(function(el){
			r[el.id] = el.value;
		});
		return r;
	},

	setPointers: function(players, container, session){
		for (i in players){
			if (i != session){
				this.pointers[i] = new Element('div', {class: 'pointer'});
				this.pointers[i].inject($(container));
				var sq = new Element('div', {
					styles:{
						backgroundColor: players[i].color,
					},
					class: 'square'
				});
				sq.inject(this.pointers[i])
			}
		}
	},
});

var MainMenu = new Class({
	
	Extends: Ui,
	node: {},
	triggers:{},

	initialize: function(node){
		this.node = $(node);
		
	},

	show: function(){
		this.grayOut();
		this.node.style.display = 'block';
		this.node.style.zIndex = '1200';
	},

	hide: function(){
		this.grayOut('off');
		this.node.style.display = 'none';
	},

	mod: function(){
		$('register-parent').setStyle('display', 'none');
		$('mod-parent').setStyle('display', 'block');
	},

	showGames: function(data){
		$('game-list').innerHTML = '';
		var e = true;
		for (v in data){
			e = false;
			var t = new Element('li')
			var c = new Element('input', {
				id:data[v].id, 
				value:data[v].id, 
				name: 'game', 
				type:"radio", 
				class:"radio-game"
			});
			t.innerHTML = 'Host: '+ data[v].creator.id + ' // Game: ' + data[v].name + " // Status: " + data[v].status;
			c.inject($('game-list'));
			t.inject($('game-list'));
			
		}
		if(e)
			$('game-list').innerHTML = "There are no created games";

	},

	showJoined: function(players){
		$('join-list').innerHTML = '';
		for (v in players){
			if(players[v].id){
				var t = new Element('li', {class: 'joined-player'});
				t.innerHTML = 'Player ' + players[v].number + ': ' + players[v].id;
				t.inject($('join-list'));
			}
			
		}
	}
});

var Interface = new Class({

	Extends: Ui,

	svg: {},
	game:{},

	initialize: function(svg, game){
		this.svg = svg;
		this.game = game;
	},

	printRegion: function(r){
		var c = $('i-region');
		c.innerHTML = 'Country:  ' +r;
	},

	printPlayer: function(r){
		var c = $('i-player');
		c.innerHTML = 'Player:  ' + r;
	},

	printScore: function(){
		console.log(game.players);
		$('scores').innerHTML = '';
		for (i in game.players){
			var p = new Element('li', {
				html: 'Player: ' + game.players[i].id + ' Score: ' + game.players[i].score
			})
			p.inject($('scores'));  
		}
	}

});
