var Ui = new Class({
	
	Implements: [Auth],
	
	initialize: function(){
		this.setEvents();
	},

	setEvents: function(){
		var self = this;
		this.buttons = $$('.ui-event');
		this.buttons.each(function(item){
			item.addEvent('click', function(){
				var f = item.id;
				var i = item.getAllPrevious('input');
				var s = self.formatInputs(i);
				self[f](s);
			});
		});
	},

	formatInputs: function(inputs){
		var data = {data:{}};
		$$(inputs).each(function(i){
			data.data[i.id] = {
				value: i.value,
				id: i.id,
				name: i.name,
			}
		});
		return data;
	},

	
	grayOut: function(state){
		
		if(!state){
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
		console.log('OK')
		console.log(this.node)
		this.grayOut('off');
		this.node.style.display = 'none';
	},

	mod: function(fn){
		$('register-parent').setStyle('display', 'none');
		$('mod-parent').setStyle('display', 'block');
		$('multiplayer').addEvent('click', function(data){
			fn('multiplayer');
		})
		$('singleplayer').addEvent('click', function(data){
			fn('singleplayer');
		})
	},

	multiplayer: function(){
		$('mod-parent').setStyle('display', 'none');
		$('multiplayer-parent').setStyle('display', 'block');
		
		$('create-game').addEvent('click', function(){
			$('multiplayer-parent').setStyle('display', 'none');
			ioEvents.createGame();
		})
		
		$('join-game').addEvent('click', function(){
			
			var inputs = document.getElementsByTagName('input');
			for (i in inputs){
				console.log(inputs[i]);
				if(inputs[i].type == "radio" && inputs[i].checked){
					var selected = inputs[i].value
				}
			}
			$('join-parent').setStyle('display', 'block');
			$('multiplayer-parent').setStyle('display', 'none');
			console.log('SELECTED GAME: ' + selected);
			ioEvents.joinGame(selected);
		})


	},

	showGames: function(data){
		$('game-list').innerHTML = '';
		for (v in data){
			var t = new Element('li')
			var c = new Element('input', {id:data[v], value:data[v], name: 'game', type:"radio"});
			t.innerHTML = data[v]
			c.inject($('game-list'));
			t.inject($('game-list'));
			
		}
	},

	showJoined: function(players){
		$('start-game').addEvent('click', function(){
			events.start();
		})

		for (v in players){
			if(players[v].id){
				var t = new Element('li');
				t.innerHTML = players[v].id;
				t.inject($('join-list'));
			}
			
		}
	}
});

