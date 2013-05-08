var getClasses = {

	init: function(){
		/////// Build Map ///////
		map = new Svg(db.options, db.regions);
		////// Build game context //////
		game = new Game(db.regions.info, map);
		////// Class for client-server comunication //////
		clientServer = new ClientServer(map);
		/////// In and Out Events //////
		ioEvents = new IoEvents(map);
		/////// Events   ///////
		events = new GameEvents();
		/////// Events   ///////
		uiEvents = new UiEvents();
		/////// User Interface //////
		ui = new Ui();
		/////// Main Menu ///////
		mainMenu = new MainMenu('main-menu');
		/////// Auth ///////
		users = new Users();
		
		router = new Router({
			ioEvents: ioEvents,
			events: events,
			users: users,
			uiEvents: uiEvents
		})
	}
}

window.addEvent('domready', function(){
	
	getClasses.init();
	
	var check = new Request({
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
	})
	
	check.send();


	
	

	

});

