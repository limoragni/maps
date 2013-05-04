var Svg = new Class({

	//Implements: [Options],

	regions:{},
	prevent: 0,

	initialize: function(options, regions){
		this.setCanvas(options.svg);
		this.drawPaths(regions, options.region);
		this.scale();
	},

	setCanvas: function(op){
		R = Raphael(op.container, op.width, op.height);
		R.ZPD({ zoom: true, pan: true, drag: false });
		var cont = $(op.container);
		cont.addEvent('mousedown', function(){
			this.setStyle('cursor', 'move');
		})
		cont.addEvent('mouseup', function(){
			this.setStyle('cursor', 'default');
		})
	},

	drawPaths: function(regions, op){
		for(i in regions.paths){
			var shape = R.path(regions.paths[i]);
			shape.id = i;
			shape.attr(op)
			var region = new Region(shape, regions.info[i], i);
			this.regions[i] = region;
		}
	},

	setRegions: function(){

	},

	scale: function(){
		var viewport = $('viewport');
		var bbox = viewport.getBBox();
		
		var wdif = screen.width - bbox.width;
		var hdif = screen.height - bbox.height;
		if (wdif < hdif){
			var scale = (screen.width - 50) / bbox.width;
			var ty = 50//(screen.height - (bbox.height * scale)) / 2
			var tx = 20;
		}else{
			var scale = (screen.height - 50) / bbox.height;
			var tx = (screen.width - (bbox.width * scale)) / 2
			var ty = 20;
		}
		viewport.setAttribute("transform", "scale("+scale+") translate("+tx+","+ty+")");
	},

	getRegionById: function(id){
		var r = null;
		console.log('Get by id');	
		Object.each(this.regions, function(item){
			if(item.id == id){
				r = item;
			}
		})
		return r;
	},

	preventClick: function(){
		this.prevent = 1;
	},

	allowClick: function(){
		this.prevent = 0;
	}
});

var  Region = new Class({
	
	node: {},
	info: {},
	id: 0,
	move: 0,
	
	initialize: function(node, info, id){
		this.node = node;
		this.info = info;
		this.id = id;
		this.setHover();
		this.setClick();		
	},

	setHover: function(){
		
		this.node.hover(function(){
			this.animate({'fill-opacity': 1}, 300);
		},function(){
			this.animate({'fill-opacity': 0.7 }, 300);
		});

		this.node.mousedown(function(){
			this.attr({cursor: 'move'})
		});
		this.node.mouseup(function(){
			this.attr({cursor:'pointer'})
		});
	},

	//Handle the click event of each region, bind a function to the event (guess). 
	//Prevents of triggering the function when moving the svg.
	setClick: function(fn){
		var self = this;
		this.node.mousemove(function(){
			this.move = 1;
		});
		this.node.mousedown(function(){
			this.move = 0;
		});
		this.node.mouseup(function(){
			console.log(map.prevent);
			if(self.move == 0 && map.prevent == 0){
				router.send('events-guess', self, 'local');
				//events.guess(self); 
			}
		})
	},
});

