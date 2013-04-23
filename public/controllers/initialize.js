var getClasses = {

	init: function(){
		/////// Build Map ///////
		map = new Svg(db.options, db.regions);
		////// Build game context //////
		game = new Game(db.regions.info, map);
		/////// In and Out Events //////
		ioEvents = new IoEvents();
		/////// Events   ///////
		events = new GameEvents();
		////// Class for client-server comunication //////
		clientServer = new ClientServer();
		/////// User Interface //////
		ui = new Ui();
		/////// Main Menu ///////
		mainMenu = new MainMenu('main-menu');
		/////// Auth ///////
		auth = new Auth('main-menu');
		
	}
}

window.addEvent('domready', function(){
	
	getClasses.init();
	
	/*var check = new Request({
		url: '/check',
		method: 'get',
		onSuccess: function(r){
			var session = JSON.parse(r);
			if(session.username){
				console.log('A session exist with the name: ' + session.username);
				events.onLogin(session);
			}else{
				events.noLogin();
			}
		}
	})*/
	
	check.send();

	
	

	

});

