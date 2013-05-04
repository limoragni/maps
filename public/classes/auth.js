var Auth = new Class({
	
	initialize: function(){
	
	},

	login: function(data){
		

		
	},

	register: function(data){
		
	
		
	},

	check: function(){

	},

	formatInputs: function(data){
		var f = data.id;
		var i = data.getAllPrevious('input');
		var inputs = this.formatInputs(i);

		var data = {data:{}};
		$$(inputs).each(function(i){
			data.data[i.id] = {
				value: i.value,
				id: i.id,
				name: i.name,
			}
		});
		return data;
	},
	
	
});

