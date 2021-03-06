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
		this.state['prevent'] = 1;
		this.state['click'] = 0;
	},

	setCanvas: function(op){
		this.paper = Raphael(op.container, op.width, op.height);
		this.element = this.paper.canvas;
		this.paper.ZPD({ zoom: true, pan: true, drag: false });
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
			var region = new Region(shape, regions.info[i], i, this);
			this.regions[i] = region;
		}
	},

	setRegions: function(){

	},

	scale: function(){
		var w = window.getSize(),
			v = this.paper.canvas.getBBox(),
			scale = (w.x * 0.9) / v.width,
		 	tx = ((w.x / scale) * 0.1) / 2,
		 	ty = ((w.y / 2) / scale) - v.height / 2;
		
		this.paper.canvas.setAttribute("transform", "scale("+scale+") translate("+tx+","+ty+") ");
	},

	getRegionById: function(id){
		var r = null;
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
	},

	goto: function(coordinates, fn){
		console.log(coordinates);
		var s     =  coordinates.scale,
			x     =  coordinates.x,
			y     =  coordinates.y
			vb    =  this.paper.canvas,
			ctm   =  vb.getCTM(),
			speed =  10,
			si    =  (s - ctm.a) /speed,
			sf    =  ctm.a,
			xi    =  (x*s - ctm.e)/speed,
			xf    =  ctm.e,
			yi    =  (y*s - ctm.f) /speed,
			yf    =  ctm.f,
			i     =  0;
			
		function run(){
			console.log(1984);
			if(i<speed){
				sf += si;
				xf += xi; 
				yf += yi;
				vb.setAttribute("transform", "matrix("+sf+",0,0,"+sf+","+xf+","+yf+")");
				setTimeout(run, 24);
				i++;
			}else{
				setTimeout(fn(), 300);
			}
		}
		
		run();
	}, 

	highlight: function(region){
		if(region){
			region.node.attr({stroke: "#FF0000"});
			region.node.toFront();
			this.failed = region;
		}else{
			if(this.failed)
				this.failed.node.attr({stroke: "#000"});
		}
			
	}

});

var  Region = new Class({
	
	node: {},
	info: {},
	id: 0,
	state: {},
	viewport:{},
	paper: {},
	
	initialize: function(node, info, id, svg){
		this.node = node;
		this.info = info;
		this.id = id;
		this.state = svg.state;
		this.setHover();
		this.setClick();
		this.viewport = svg.paper.canvas;	
		this.paper = svg.paper;	
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
			if(self.state.move == 0 && self.state.prevent == 0){
				router.send('events-guess', self, 'local');
				//events.guess(self); 
			}
		})
	},

	cameraPosition: function(){
		var w = window.getSize(),
		//Get the viewport that contains the map
			vb = $('viewport'),
		//Get the bounding box of the country to show
			pB = this.node.getBBox(true),
		//Get the bounding box of the viewport
			vB = vb.getBBox(true);
		
		
		//Set the value of the scale in relation with the size of the country
		if (pB.width > 250 || pB.height > 250){
			var scale = 1.5;
		}
		else if (pB.width > 100 || pB.height > 100){
			var scale = 2.5;
		}
		else if (pB.width > 50 || pB.height > 50){
			var scale = 3;
		}
		else if (pB.width > 10|| pB.height > 10){
			var scale = 4;
		}
		else if (pB.width > 0 || pB.height > 0){
			var scale = 7;
		}
		
		var tX = -(pB.x + pB.width / 2),
		 	tY = -(pB.y + pB.height / 2);
		
		var rtX = tX + (w.x / 2) / scale,
			rtY = tY + ((w.y) / 2) / scale;
		
 		var destination = {
			scale: scale,
			x:rtX,
			y:rtY
		}
		
		return destination;
	},
/*
	failed: function(){
		console.log('THIS PAPER CANVAS')
		var svg = document.getElementsByTagName('svg')[0];
		var p = svg.createSVGPoint();
		p.x = event.x;
		p.y = event.y;
		
		var pt = p.matrixTransform(this.paper.canvas.getScreenCTM().inverse());
		this.node.attr({stroke: "#FF0000"});
		this.node.toFront();
		
		var x = this.node.getBBox().x,
			y = this.node.getBBox().y,
			h = this.node.getBBox().height,
			w = this.node.getBBox().width,
			px = x + w / 2,
			py = y + h / 2;
 		if(h > x){
 			var r = x * 0.1;
 		}else{
 			var r = h * 0.1;
 		}
 		
 		this.paper.text(pt.x, pt.y, 'X').attr({'font-size': '5', fill:'#FF0000', 'stroke-width': 0.5});
	}*/
});

