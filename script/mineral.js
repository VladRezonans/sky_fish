//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tMineral, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tMineral(params) {
	this.type = 'mineral';
	this.status = 'norm';
	this.group = 'minerals';
	this.r = 2;
	this.color = "#CCCC44";
	this.dx = 0.0;
	this.dy = 0.0;
	this.t = 100;
	this.lockT = 0.1;
	this.f = 10.0;
	this.score = 10;
		
	this.setParam(params);
	this.t = this.t + 0.2 * this.t * Math.random();
	this.maxT = this.t;

	MINERAL_COUNT++;	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.engine = function() {
	var dx = shatl.x - this.x;
	var dy = shatl.y - this.y;

	if (this.lockT < 0) {
		this.dx += this.f * dx/(dx * dx + dy* dy);
		this.dy += this.f * dy/(dx * dx + dy* dy);	

		if (dx * dx + dy * dy < shatl.r * shatl.r + 900.0) {
			if (this.status != 'delete') {
				this.destroy();
				shatl.score += this.score;				
					
			}		
		}
	}

	this.dx -= this.dx * 0.005;	
	this.dy -= this.dy * 0.005;	
	
	this.x += this.dx;
	this.y += this.dy;

	this.lockT -= 0.01;
	this.t     -= 0.01;
	if (this.t < 0) this.destroy();

	if (MINERAL_COUNT > MINERAL_MAX - 200 && this.t > 0.8 * this.maxT) this.destroy();
	if (MINERAL_COUNT > MINERAL_MAX && this.t > 0.5) this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.shablon = function(x, y) {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(x, y, this.r, 0, 2 * Math.PI);	
	ctx.fill();	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;

	if (this.isShadow(x, y)) return;
	this.shablon(x, y);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.isShadow = function(x, y) {
	if (++scene.mineralShowCount > scene.oldMineralShowCount - 500) return false;
	if (Math.random() > (scene.oldMineralShowCount - scene.mineralShowCount + 1.0)/(scene.oldMineralShowCount + 1.0)) return false;
	return true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMineral.prototype.destroy = function() {
	MINERAL_COUNT--;	
	this.status = 'delete'; 
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
