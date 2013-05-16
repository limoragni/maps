var ClientServer = new Class({

	data: {},
	socket: {},
	state: 0,
	store: {},
	lasEmit:0,
	svg: {},
	gameId: 0,
	userId:0,
	
	initialize: function(svg){
		this.svg = svg;
		this.lastEmit = {
			pointer:(new Date).getTime(),
			move: (new Date).getTime()
		}
	},

	connect: function(host){
		this.socket = io.connect(host);
	},

	setGameId: function(id){
		this.gameId = id;
	},

	setPlayerId: function(id){
		this.userId = id;
	},

	canvasEvents: function(){
		var self = this;
		if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0){
			window.addEventListener('mousewheel', function(){self.sendMatrix('zoom')}, false); // Chrome/Safari
		}else{
			window.addEventListener('DOMMouseScroll', function(){self.sendMatrix('zoom')}, false); // Others
			window.addEventListener('onmousewheel', function(){self.sendMatrix('zoom')}, false);
		}
		
		this.svg.element.addEventListener('mousemove', function(){
			if((self.svg.state.click == 1) && ((new Date).getTime() - self.lastEmit.move > 30)){
				self.sendMatrix('pan');
				self.lastEmit.move = (new Date).getTime();
			}
		})

		document.addEvent('mousemove', function(e){
			if( (new Date).getTime() - self.lastEmit.pointer > 30){
				clientServer.socket.emit('move',{
					x: e.page.x,
					y: e.page.y,
					id: self.userId,
					gameId: self.gameId

				});
				self.lastEmit.pointer = (new Date).getTime();
			}
		})
	},
	
	sendMatrix: function(e){
		var matrix = this.svg.paper.canvas.getAttribute('transform');
		if(game.currentPlayer == game.session.username)
			this.socket.emit(e, {matrix:matrix, gameId: this.gameId});
	},

	setMatrix: function(data){
		this.svg.paper.canvas.setAttribute('transform', data);
	},

	buffer: function( id, t, d, fn){
		if(!this.store[id]) this.store[id] = [];
		var self = this
		if(!self.store[id][0]){
			self.store[id].push(d);
			var inter = setInterval(function(){
				if(self.store[id][0]){
					fn(self.store[id][0]);
					self.store[id].erase(self.store[id][0]);
				}else{
					clearInterval(inter);
				}
			}, t);
		}
		this.store[id].push(d);
	}
});

var Chat = new Class({
	
	toggle: true,
	
	initialize: function(user, game, cs){
		this.setInterface();
		this.cs = cs;
	},

	setInterface: function(){
		var self = this;
		$('chat-input').addEvent('keydown', function(event){
			if(event.key == 'enter'){
				event.stop();
				var v = $('chat-input').value
				self.cs.socket.emit('chat',{
					text: v,
					user: self.cs.userId,
					game: self.cs.gameId
				})
				self.write(v, 'me');
				$('chat-input').value = '';
			}
		});
		$('chat-toggle').addEvent('click', function(){
			if(self.toggle){
				self.toggle = false;
				$('chat-read').setStyle('display', 'none');
				$('chat-write').setStyle('display', 'none');
				$('chat').setStyle('height', '39px');
			}else{
				self.toggle = true;
				$('chat-read').setStyle('display', 'block');
				$('chat-write').setStyle('display', 'block');
				$('chat').setStyle('height', '370px');
			}
		})
	},

	write: function(text, id){
		var html = '<div class="chat-entry"> <li class="chat-id">'+ id +': </li> <li class="chat-message">'+ text+'</li> <div>';
		var s = new Element('div', {
			html: html
		})
		s.inject($('chat-read'));
		var h = $('chat-read').scrollHeight;
		$('chat-read').scrollTop = 	$('chat-read').scrollHeight;
	}
});