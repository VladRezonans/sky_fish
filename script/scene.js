//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene = function() {	
	this.X1 = 0;
	this.Y1 = 0;
	
	this.maxStar = 10;
	this.maxAsteroid = 12;
	this.currentCellX = 0;
	this.currentCellY = 0;

	this.mineralShowCount = 0;
	this.oldMineralShowCount = 0;
	this.elements = [];
	this.add(shatl);

	this.delayScreen = [];
	this.pause = false;
}	
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.build = function() {
	this.X2 = canvas.width;
	this.Y2 = canvas.height;
	this.dX = this.X2 - this.X1;
	this.dY = this.Y2 - this.Y1;

	sceneX = this.currentCellX * this.dX;
	sceneY = this.currentCellY * this.dY;

	this.setViewSpace();
	this.initStars();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.setViewSpace = function() {
	this.viewX1 = sceneX - 400;
	this.viewY1 = sceneY - 400;
	this.viewX2 = sceneX + this.dX + 400;
	this.viewY2 = sceneY + this.dY + 400;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.render = function() {	
	if (!this.pause) this.engine();
	this.show();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.engine = function() {	
	this.removeGarbage();
	this.engineElements();	
	this.move();
	this.checkSpaceCell();
	this.checkAsteroids();
	this.physical();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.show = function() {
	ctx.clearRect(0, 0, this.X2, this.Y2);
	if (this.pause) this.showPause();

	this.mineralShowCount = 0;
	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].type == 'star') this.elements[i].show(); 
		else if (this.isPresentScene(this.elements[i])) this.elements[i].show();				 
	}
	this.oldMineralShowCount = this.mineralShowCount;
	panel.show();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.isPresentScene = function(ob) {
	if (ob.x > this.viewX1 && ob.x < this.viewX2 && ob.y > this.viewY1 && ob.y < this.viewY2) return true;
	return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.physical = function() {
	var physicals = [];

	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].status == 'norm' && this.elements[i].group == 'physical') {			
			if (this.isPresentScene(this.elements[i])) {								
				physicals.push(this.elements[i]);
			}
		}
        }
			
	this.physicalCellsContact(physicals);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.physicalContact = function (physicals) {
	var dx, dy, dr;
	var first, second;

	for (var i = 0; i < physicals.length; i++) {
		first = physicals[i];
		
		for (var k = i + 1; k < physicals.length; k++) {
			second = physicals[k];	
				
			dx = first.x - second.x;
			dy = first.y - second.y;
			dr = first.r + second.r;
	
			if (dx * dx + dy * dy < dr * dr) {
				first.touch(second);
				second.touch(first);

				this.solid(first, second);
				this.impulse(first, second);
			}
		}		
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.solid = function(first, second) {
	var a = angle(first, second);	

	var dx = second.x - first.x;
	var dy = second.y - first.y;

	dx = dx - (first.r + second.r) * Math.sin(a);
	dy = dy - (first.r + second.r) * Math.cos(a);

	first.x += dx * (second.m/first.m); second.x -= dx * (first.m/second.m);
	first.y += dy * (second.m/first.m); second.y -= dy * (first.m/second.m);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.impulse = function(first, second) {
	var dx1, dy1, dx2, dy2;

	dx2 = (first.m  * first.dx)/second.m;
	dy2 = (first.m  * first.dy)/second.m;
	dx1 = (second.m * second.dx)/first.m;
	dy1 = (second.m * second.dy)/first.m;

	first.dx = dx1;  first.dy = dy1;
	second.dx = dx2; second.dy = dy2;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.physicalCellsContact = function(physicals) {
	var row = 100;
	var dx = (this.viewX2 - this.viewX1) / row;
	var dy = (this.viewY2 - this.viewY1) / row;
	var x, y;
	var a = [], around = [];
	
	for (y = 0; y < row; y++) {
		a[y] = []
		for (x = 0; x < row; x++) {
			a[y][x] = [];
		}
	} 	

	for (i = 0; i < physicals.length; i++) {
		y = Math.floor((physicals[i].y - this.viewY1) / dy);
		x = Math.floor((physicals[i].x - this.viewX1) / dx);		
						
		a[y][x].push(physicals[i]);
	}

	for (y = 1; y < row - 1; y++) {
		for (x = 1; x < row - 1; x++) {
			var a1 = around.concat(a[y - 1][x - 1], a[y - 1][x], a[y - 1][x + 1], a[y][x - 1], a[y][x], a[y][x + 1], a[y + 1][x - 1], a[y + 1][x], a[y + 1][x + 1]);			
			this.physicalContact(a1);
		}
	} 
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.initStars = function() {
	var x, y, dx, dy;	

	for(var k = 1; k < this.elements.length; k++) {
		if(this.elements[k].type == 'star') this.elements[k].status = 'delete';
	}	
	this.removeGarbage();	

	for (dx = -3; dx < 4; dx++) {
		x = this.currentCellX + dx;
		for (dy = -3; dy < 4; dy++) { 
                        y = this.currentCellY + dy;						
			
			Math.seedrandom("x: " + x + ", y: " + y);
			
			for(var i = 0; i < this.maxStar; i++) {
				var star = new tStar()									
				star.setParam({ x: x * this.dX + Math.floor(Math.random() * this.dX), 
		                                y: y * this.dY + Math.floor(Math.random() * this.dY), 
		                                z: 1.0 + Math.random() * 2.0 });
				this.elements.push(star);
					
			}
		}
	}	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.move = function() {	
	var mDx = shatl.dx/shatl.maxSpeed * 0.7;
	var mDy = shatl.dy/shatl.maxSpeed * 0.7;

	this.delayScreen.push({ mDx: mDx, mDy: mDy });
	var h = (this.delayScreen.length < 100) ? this.delayScreen[0] : this.delayScreen.shift();

	for(var i = 0; i < this.delayScreen.length; i++) { h.mDx += this.delayScreen[i].mDx; h.mDy += this.delayScreen[i].mDy };
	h.mDx = h.mDx/(this.delayScreen.length + 1);
	h.mDy = h.mDy/(this.delayScreen.length + 1);
	
	if (shatl.x < sceneX + 0.15 * this.dX - h.mDx * this.dX) sceneX = shatl.x - 0.15 * this.dX + h.mDx * this.dX;
	if (shatl.y < sceneY + 0.15 * this.dY - h.mDy * this.dY) sceneY = shatl.y - 0.15 * this.dY + h.mDy * this.dY;
	if (shatl.x > sceneX + 0.85 * this.dX - h.mDx * this.dX) sceneX = shatl.x - 0.85 * this.dX + h.mDx * this.dX;
	if (shatl.y > sceneY + 0.85 * this.dY - h.mDy * this.dY) sceneY = shatl.y - 0.85 * this.dY + h.mDy * this.dY;
	
	this.setViewSpace();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.checkSpaceCell = function() {
	var check = false;
	
        if ( shatl.x < this.currentCellX * this.dX) { this.currentCellX--; check = true }	
	if ( shatl.y < this.currentCellY * this.dY) { this.currentCellY--; check = true }
	if ( shatl.x > this.currentCellX * this.dX + this.dX) { this.currentCellX++; check = true }
	if ( shatl.y > this.currentCellY * this.dY + this.dY) { this.currentCellY++; check = true }

	if (check) this.initStars();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.checkAsteroids = function() {
	var x, y, dx, dy, count = 0;
	var space = 100000.0;

	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].status == 'norm' && this.elements[i].type == 'asteroid') {
			dx = this.elements[i].x - shatl.x;
			dy = this.elements[i].y - shatl.y; 

			if ( dx * dx + dy * dy > 1.5 * space * space) this.elements[i].status = 'delete';
			else count++;			
		}
        }	
	
	Math.seedrandom();

	if (count == 0)  {	
		x = shatl.x - space/2.0 + space * Math.random();
		y = shatl.y - space/2.0 + space * Math.random();
		this.createAsteroidStream(x, y);
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.createAsteroidStream = function(streamX, streamY) {
	var x, y, i;
	var size = this.maxAsteroid * Math.random();

	for (i = 0; i < size; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tAsteroid({ x: x, y: y }));
	}

	this.removeDistantObjects();
	this.createEnemy(x, y, size);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.removeDistantObjects = function() {
	var space = 100000.0;

	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].status == 'norm') {
			dx = this.elements[i].x - shatl.x;
			dy = this.elements[i].y - shatl.y;

			if ( dx * dx + dy * dy > 5.0 * space * space) this.elements[i].status = 'delete';
		}
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.createEnemy = function(streamX, streamY, size) {
	var x, y, i, count;

	if (shatl.score > 100) {
		for (i = 0; i < size/4; i++) {
			x = streamX + this.dX * Math.random();
			y = streamY + this.dY * Math.random();		
			this.add(new tAngel({ x: x, y: y }));
		}
	}
	
	count = shatl.score/2000;
	if (count > 80) count = 80;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();		
		this.add(new tAngel({ x: x, y: y }));
	}

	count = shatl.score/4000;
	if (count > 60) count = 60;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();		
		this.add(new tArhAngel({ x: x, y: y }));
	}

	count = shatl.score/6000;
	if (count > 40) count = 40;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();		
		this.add(new tPrincipates({ x: x, y: y }));
	}

	count = shatl.score/8000;
	if (count > 30) count = 30;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();		
		this.add(new tPotestates({ x: x, y: y }));
	}

	count = shatl.score/25000;
	if (count > 20) count = 20;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tVirtutes({ x: x, y: y }));
	}

	count = shatl.score/50000;
	if (count > 10) count = 10;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tDominationes({ x: x, y: y }));
	}

	count = shatl.score/100000;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tThronos({ x: x, y: y }));
	}

	count = shatl.score/200000;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tCherubim({ x: x, y: y }));
	}

	count = shatl.score/400000;
	for (i = 1; i < count; i++) {
		x = streamX + this.dX * Math.random();
		y = streamY + this.dY * Math.random();
		this.add(new tSeraphim({ x: x, y: y }));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.add = function(element) {
	this.elements.push(element)
}	
//---------------------------------------------------------------------------------------------------------------------------------------------------	
tScene.prototype.removeGarbage = function() {
	var result = [];
	for(var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].status != 'delete') result.push(this.elements[i]);
	}
	this.elements = result;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.engineElements = function() {
	for (var i = 0; i < this.elements.length; i++) this.elements[i].engine();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.switchPause = function() {
	this.pause = !this.pause;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.showPause = function() {
	var x = (this.dX - panel.dX)/2.0 - 32, y = 100;

	ctx.fillStyle = "#555599";
	ctx.font = "22px Arial";
	ctx.fillText("Pause", x, y);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
