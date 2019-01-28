//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tAsteroid, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tAsteroid(params) {
	this.color = '#666666';
	this.type  = 'asteroid';
	this.group = 'physical';
	this.status = 'norm';
	this.setParam(params);
	this.r = 8.0 + Math.floor(Math.random() * 4.0);
	this.m = Math.pow(this.r, 3);
	this.dx = 0.0;
	this.dy = 0.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.engine = function() {
	this.dx -= this.dx * 0.001;
	this.dy -= this.dy * 0.001;

	this.x += this.dx;
	this.y += this.dy;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.shablon = function(x, y) {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(x, y, this.r, 0, 2 * Math.PI);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;

	this.shablon(x, y);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	for (i = 0; i < this.r; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy }));
	}

	this.surprise();
	this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.surprise = function(plazmaDx, plazmaDy) {
	if (Math.random() * 50 > 49 && shatl.score > 500) {
		for(var i = 0; i < 40; i++) {
			scene.add(new tAngel({ x: this.x + (2.0 - Math.random() * 4.0), y: this.y + (2.0 - Math.random() * 4.0) }));
		}
	}

	if (Math.random() * 50 > 49 && shatl.score > 100000) {
		for(var i = 0; i < 5; i++) {
			scene.add(new tPotestates({ x: this.x + (2.0 - Math.random() * 4.0), y: this.y + (2.0 - Math.random() * 4.0) }));
		}
	}

	if (Math.random() * 50 > 49 && shatl.score > 150000) scene.add(new tThronos({ x: this.x, y: this.y }));
	if (Math.random() * 50 > 49 && shatl.score > 250000) scene.add(new tCherubim({ x: this.x, y: this.y }));
	if (Math.random() * 50 > 49 && shatl.score > 350000) scene.add(new tSeraphim({ x: this.x, y: this.y }));
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAsteroid.prototype.destroy = function() {
	if (Math.random() * 15 > 14) scene.add(new tReward({ x: this.x, y: this.y }));
	this.status = 'delete';
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
