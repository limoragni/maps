var ClientServer = new Class({

	data: {},
	socket: {},
	state: 0,
	
	initialize: function(){
		
	},

	connect: function(host){
		this.socket = io.connect(host);
		this.setEvents();
		this.setMatrix();
	},

	setEvents: function(){
		if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0){
			window.addEventListener('mousewheel', this.sendMatrix, false); // Chrome/Safari
		}else{
			window.addEventListener('DOMMouseScroll', this.sendMatrix, false); // Others
		}

		map.element.addEventListener('mousedown', function(){
			clientServer.state = 1;
		})

		var lastEmit = (new Date).getTime();
		map.element.addEventListener('mousemove', function(){
			if((clientServer.state == 1) && ((new Date).getTime() - lastEmit > 30)){
				var view = document.getElementById('viewport')
				var matrix = view.getAttribute('transform');
				clientServer.socket.emit('pan', matrix);
				lastEmit = (new Date).getTime();
			}
		})

		map.element.addEventListener('mouseup', function(){
			clientServer.state = 0;
		})

		clientServer.socket.on('pan_back', function(data){
			var view = document.getElementById('viewport')
			view.setAttribute('transform', data);
		})
	},
	
	sendMatrix: function(){
		var view = document.getElementById('viewport')
		var matrix = view.getAttribute('transform');
		clientServer.socket.emit('matrix', matrix);
	},

	setMatrix: function(){
		clientServer.socket.on('matrix_back', function(data){
			var view = document.getElementById('viewport')
			view.setAttribute('transform', data);
		});
	}
});