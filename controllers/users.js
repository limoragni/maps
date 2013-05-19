var usersController = {
	
	check: function(req, res){
		res.json({username:req.session.username});
	},

	register: function(req, res){
		
		var User = require('../models/Users'),
			config = require('../config')
			mongoose = require('mongoose');
		
		mongoose.connect(config.db, function(err){
			if (err) throw err;
			console.log('Successfully connected to MongoDB');
		});
		
		var username = req.body.username.value,
			password = req.body.password.value;

		User.findOne({username: username}, function(err, user){
			if (err) throw err;
			
			if(!user){
				var newUser = new User({
					username: username,
					password: password
				});
				newUser.save(function(err){
					if (err) throw err;
					req.session.username = username;
					mongoose.connection.close();
					res.json({username:req.session.username});
				});
			
			}else{
				user.comparePassword(password, function(err, isMatch) {
		    		if (err) throw err;
		    		if(isMatch){
		    			req.session.username = username;
		    			console.log('login');
		    		}else{
		    			console.log('logout');
		    		}
		    		
		    		
				mongoose.connection.close();
				res.json({username:req.session.username});
		    	});
			}
			
		});
	}
}

module.exports = usersController;