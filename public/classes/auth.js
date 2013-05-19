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
		var f = data.id,
			i = data.getAllPrevious('input'),
			inputs = this.formatInputs(i),
			data = {data:{}};
		
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

