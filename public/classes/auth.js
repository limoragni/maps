var Auth = new Class({
	
	initialize: function(){
	
	},

	login: function(data){
		

		
	},

	register: function(data){
		var self = this;
		var ajax = new Request({
			url: '/register',
			method: 'post',
			onSuccess: function(r){
				var session = JSON.parse(r);
				
				if(session.username){
					events.onLogin(session);
				}else{
					
				}
			}
		})
		
		ajax.send(data);
	},

	check: function(){

	}
	
});

