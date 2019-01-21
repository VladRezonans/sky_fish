//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tMeteorite, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tMeteorite(params) {
	this.color = '#666666';
	this.type  = 'meteorite';
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
tMeteorite.prototype.engine = function() {
	this.dx -= this.dx * 0.001;	
	this.dy -= this.dy * 0.001;	
	
	this.x += this.dx;
	this.y += this.dy;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.shadow = function(x, y, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, this.r + 1.0, 0, 2 * Math.PI);	
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.shablon = function(x, y) {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(x, y, this.r, 0, 2 * Math.PI);	
	ctx.fill();	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;
	
	this.shadow(this.oldX, this.oldY, '#000000');
	this.shablon(x, y);
	this.oldX = x; this.oldY = y;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY, '#000000');
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;	
	
	for (i = 0; i < this.r; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy }));
	}

	if (Math.random() * 50 > 49 && shatl.score > 500) this.surprise();
	this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.surprise = function(plazmaDx, plazmaDy) {
	for(var i = 0; i < 40; i++) {
		scene.add(new tAngel({ x: this.x + (2.0 - Math.random() * 4.0), y: this.y + (2.0 - Math.random() * 4.0) }));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMeteorite.prototype.destroy = function() {
	if (Math.random() * 15 > 14) scene.add(new tReward({ x: this.x, y: this.y }));
	this.status = 'delete';	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
