var Svg = new Class({

	//Implements: [Options],

	regions:{},
	paper:{},
	element:{},
	state:{},

	initialize: function(options, regions){
		this.setCanvas(options.svg);
		this.drawPaths(regions, options.region);
		this.scale();
		this.state['move'] = 0;
		this.state['prevent'] = 0;
		this.state['click'] = 0;
	},

	setCanvas: function(op){
		this.paper = Raphael(op.container, op.width, op.height);
		this.element = this.paper.canvas;
		console.log(this.element);
		this.paper.ZPD({ zoom: true, pan: true, drag: false });
		console.log(this.element);
		var cont = $(op.container);
		cont.addEvent('mousedown', function(){
			this.setStyle('cursor', 'move');
		})
		cont.addEvent('mouseup', function(){
			this.setStyle('cursor', 'default');
		})

		var self = this;

		this.element.addEventListener('mousemove', function(){
			self.state['move'] = 1;
			console.log(self.state.move);
		})
		
		this.element.addEventListener('mousedown', function(){
			self.state['move'] = 0;
			self.state['click'] = 1;
		});

		this.element.addEventListener('mouseup', function(){
			self.state['click'] = 0;
		});
	},

	drawPaths: function(regions, op){
		for(i in regions.paths){
			var shape = this.paper.path(regions.paths[i]);
			shape.id = i;
			shape.attr(op)
			var region = new Region(shape, regions.info[i], i, this.state);
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
		this.state['prevent'] = 1;
	},

	allowClick: function(){
		this.state['prevent'] = 0;
	}
});

var  Region = new Class({
	
	node: {},
	info: {},
	id: 0,
	state: {},
	
	initialize: function(node, info, id, state){
		this.node = node;
		this.info = info;
		this.id = id;
		this.state = state;
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
		this.node.mouseup(function(){
			console.log(map.prevent);
			if(self.state.move == 0 && self.state.prevent == 0){
				router.send('events-guess', self, 'local');
				//events.guess(self); 
			}
		})
	},
});

