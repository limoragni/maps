module.exports = function(app){
	var $users = require('../controllers/users');

	app.get('/check', function(req, res){
		$users.check(req, res);
	})


	app.post('/register', function(req,res){
		$users.register(req, res);
	})
}
