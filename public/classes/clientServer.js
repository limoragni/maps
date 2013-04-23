var ClientServer = new Class({

	data: {},
	socket: {},
	
	initialization: function(){

	},

	connect: function(host){
		this.socket = io.connect(host);
		this.setEvents();
	},

	setEvents: function(){

		this.socket.on('introResponse', function(data){
			ioEvents.introResponse(data);
		})

		this.socket.on('newPlayer', function(data){
			ioEvents.newPlayer(data);
		})
	
	}

});