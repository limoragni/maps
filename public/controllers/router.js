var Router = new Class({

	initialize: function(events){
		this.events = events;
	},

	send: function(url, data){
		var split = url.split('-');
		var e = split[0];
		var a = split[1];
		console.log('Routing to: [' + e + '], Method: ' + a);
		this.events[e][a](data);
		//this.events[e][a].call(arguments)
	}

})