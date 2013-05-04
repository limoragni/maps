var Ui = new Class({
	
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
		var f = b.id;
		var i = $(b).getAllPrevious('input');
		

		var data = {data:{}};
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
		$(isin).setStyle('display', 'block');
		$(out).setStyle('display', 'none');
	}
	
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
		for (v in data){
			var t = new Element('li')
			var c = new Element('input', {id:data[v].id, value:data[v].id, name: 'game', type:"radio"});
			t.innerHTML = data[v].id + " " + data[v].status;
			c.inject($('game-list'));
			t.inject($('game-list'));
			
		}
	},

	showJoined: function(players){
		$('join-list').innerHTML = '';
		for (v in players){
			if(players[v].id){
				var t = new Element('li');
				t.innerHTML = players[v].id;
				t.inject($('join-list'));
			}
			
		}
	}
});

