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