var Users = new Class({
	 
	 initialize: function(){

	 },

	 register: function(data){
	 	var s = ui.formatInputs(data);
		
		var ajax = new Request({
			url: '/register',
			method: 'post',
			onSuccess: function(r){
				var session = JSON.parse(r);
				
				if(session.username){
					router.send('events-onLogin', session)
				}else{
					
				}
			}
		})
		
		ajax.send(s);
	 }
});