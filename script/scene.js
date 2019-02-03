//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene = function() {	
	this.X1 = 0;
	this.Y1 = 0;
	
	this.maxStar = isMobile ? 5 : 10;
	this.maxAsteroid = 12;
	this.currentCellX = 0;
	this.currentCellY = 0;

	this.mineralShowCount = 0;
	this.oldMineralShowCount = 0;
	this.elements = { stars: [], physical: [], minerals: [], missiles: [], plazma: [], bangs: [] };
	this.add(shatl);

	this.delayScreen = [];
	this.pause = false;

	this.mobileShiftX = 200;
	this.mobileShiftY = 200;

	this.accTestInit();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.accTestInit = function() {
    this.acceleration = 1;
    this.fps = 0;
    this.testAcc = true;
    this.time = new Date().getTime();
    this.accCount = 0;
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

	if (this.testAcc) this.accelerationTest();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.accelerationTest = function() {
    var time = new Date().getTime();
    this.fps++;
    if (time > this.time + 1000) {
        this.acceleration = Math.floor(100/this.fps);
        if (this.acceleration < 1) this.acceleration = 1;
        this.fps = 0;
        this.time = time;
        this.accCount++;
    }

    if (this.accCount == 3) this.testAcc = false;

    this.showHelpInfo(this.acceleration);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.showHelpInfo = function(info) {
    ctx.fillStyle = "#555599";
    ctx.font = "14px Arial";
    ctx.fillText(info, this.X2 - 15, 15);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.engine = function() {
	this.removeGarbage();

	for (var i = 0; i < this.acceleration; i++) {
		this.engineElements();
		this.shift();
	}

	this.physical();
	this.move();
	this.checkSpaceCell();
	this.checkAsteroids();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.show = function() {
	ctx.clearRect(0, 0, this.X2, this.Y2);
	if (this.pause) this.showPause();

	this.mineralShowCount = 0;
	for (var key in this.elements) {
		var  group = this.elements[key];
		for (var i = 0; i < group.length; i++) {
			if (key == 'stars') group[i].show();
			else if (this.isPresentScene(group[i])) group[i].show();
		}
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
	var physicals = [], ob;

	for (var i = 0; i < this.elements.physical.length; i++) {
		ob = this.elements.physical[i];
		if (ob.status == 'norm' && this.isPresentScene(ob)) physicals.push(ob);
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
	var stars = [];

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
				stars.push(star);
					
			}
		}
	}
	this.elements.stars = stars;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.shift = function() {
	if (shatl.tools.shift && shatl.shiftFlag) {
		if (shatl.shiftUp)    sceneY -= 12.0;
		if (shatl.shiftDown)  sceneY += 12.0;
		if (shatl.shiftRight) sceneX -= 12.0;
		if (shatl.shiftLeft)  sceneX += 12.0;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.move = function() {	
	isMobile ? this.mobileMove() : this.pcMove();
	this.setViewSpace();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.pcMove = function() {
	var mDx = shatl.dx/shatl.maxSpeed * 0.6;
	var mDy = shatl.dy/shatl.maxSpeed * 0.6;

	this.delayScreen.push({ mDx: mDx, mDy: mDy });
	var h = (this.delayScreen.length < 100) ? this.delayScreen[0] : this.delayScreen.shift();

	for(var i = 0; i < this.delayScreen.length; i++) { h.mDx += this.delayScreen[i].mDx; h.mDy += this.delayScreen[i].mDy };
	h.mDx = h.mDx/(this.delayScreen.length + 1);
	h.mDy = h.mDy/(this.delayScreen.length + 1);

	this.moveFrame(h.mDx * this.dX, h.mDy * this.dY);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.moveFrame = function(dx, dy) {
	if (shatl.x < sceneX + 0.2 * this.dX - dx) sceneX = shatl.x - 0.2 * this.dX + dx;
	if (shatl.y < sceneY + 0.2 * this.dY - dy) sceneY = shatl.y - 0.2 * this.dY + dy;
	if (shatl.x > sceneX + 0.8 * this.dX - dx) sceneX = shatl.x - 0.8 * this.dX + dx;
	if (shatl.y > sceneY + 0.8 * this.dY - dy) sceneY = shatl.y - 0.8 * this.dY + dy;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.mobileMove = function() {
	sceneX = shatl.x - this.mobileShiftX;
	sceneY = shatl.y - this.mobileShiftY;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.shiftFrame = function() {
	if (this.mobileShiftX < 0.2 * this.dX) this.mobileShiftX = 0.2 * this.dX;
	if (this.mobileShiftY < 0.2 * this.dY) this.mobileShiftY = 0.2 * this.dY;
	if (this.mobileShiftX > 0.8 * this.dX) this.mobileShiftX = 0.8 * this.dX;
	if (this.mobileShiftY > 0.8 * this.dY) this.mobileShiftY = 0.8 * this.dY;
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
	var ob, x, y, dx, dy, count = 0;
	var space = 100000.0;

	for (var i = 0; i < this.elements.physical.length; i++) {
		ob = this.elements.physical[i];

		if (ob.status == 'norm' && ob.type == 'asteroid') {
			dx = ob.x - shatl.x;
			dy = ob.y - shatl.y;

			if ( dx * dx + dy * dy > 1.5 * space * space) ob.status = 'delete';
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

	for (var i = 0; i < this.elements.physical.length; i++) {
		ob = this.elements.physical[i];
		if (ob == 'norm') {
			dx = ob.x - shatl.x;
			dy = ob.y - shatl.y;

			if ( dx * dx + dy * dy > 5.0 * space * space) ob.status = 'delete';
		}
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.createEnemy = function(streamX, streamY, size) {
	var x, y, i, count;

	if (shatl.score > 100) {
		for (i = 0; i < size/4; i++) {
			this.add(new tAngel(this.placeInStream(streamX, streamY)));
		}
	}
	
	count = shatl.score/2000;
	if (count > 70) count = 70;
	for (i = 1; i < count; i++) {
		this.add(new tAngel(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/4000;
	if (count > 60) count = 60;
	for (i = 1; i < count; i++) {
		this.add(new tArhAngel(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/6000;
	if (count > 40) count = 40;
	for (i = 1; i < count; i++) {
		this.add(new tPrincipates(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/8000;
	if (count > 30) count = 30;
	for (i = 1; i < count; i++) {
		this.add(new tPotestates(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/25000;
	if (count > 20) count = 20;
	for (i = 1; i < count; i++) {
		this.add(new tVirtutes(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/50000;
	if (count > 12) count = 12;
	for (i = 1; i < count; i++) {
		this.add(new tDominationes(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/100000;
	if (count > 10) count = 10;
	for (i = 1; i < count; i++) {
		this.add(new tThronos(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/200000;
	if (count > 8) count = 8;
	for (i = 1; i < count; i++) {
		this.add(new tCherubim(this.placeInStream(streamX, streamY)));
	}

	count = shatl.score/400000;
	if (count > 6) count = 6;
	for (i = 1; i < count; i++) {
		this.add(new tSeraphim(this.placeInStream(streamX, streamY)));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.placeInStream = function(streamX, streamY) {
	return { x: streamX + this.dX * Math.random(), y: streamY + this.dY * Math.random() };
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.add = function(element) {
	this.elements[element.group].push(element);
}	
//---------------------------------------------------------------------------------------------------------------------------------------------------	
tScene.prototype.removeGarbage = function() {
	var result = { stars: [], physical: [], minerals: [], missiles: [], plazma: [], bangs: [] };

	for (var key in this.elements) {
		var  group = this.elements[key];
		for (var i = 0; i < group.length; i++)
			if (group[i].status != 'delete') result[key].push(group[i]);
	}

	this.elements = result;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.engineElements = function() {
	for (var key in this.elements) {
		var  group = this.elements[key];
		for (var i = 0; i < group.length; i++) group[i].engine();
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.switchPause = function() {
	this.pause = !this.pause;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tScene.prototype.showPause = function() {
	var x = this.dX/2.0 - 32, y = 100;
	x = isMobile ? x : x - panel.dX/2.0;

	ctx.fillStyle = "#555599";
	ctx.font = "22px Arial";
	ctx.fillText("Pause", x, y);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
