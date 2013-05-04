var $config = {
	db:{
		prod: {
			url: 'mongodb://nodejitsu_limoragni:rmvu66uk7rjj263topikd6kjf5@ds059887.mongolab.com:59887/nodejitsu_limoragni_nodejitsudb2595313817'
		},
		local:{
			url: 'mongodb://localhost/maps'
		}
	},

	game:{
		colors:{
			0:'#004444',
			1:'#004400',
			2:'#000044',
			3:'#440044'
		}
	}
	
};


if(process.env.SUBDOMAIN){
	$config.db = $config.db.prod.url;
}else{
	$config.db = $config.db.local.url;
}

module.exports = $config;