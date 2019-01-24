//--------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPlazma, tShape);
//--------------------------------------------------------------------------------------------------------------------------------------------------
function tPlazma(params) {
	this.type = 'plazma';
	this.status = 'norm';
	this.oldX = 0.0;
	this.oldY = 0.0;
	this.x = 0.0;
	this.y = 0.0;
	this.dx = 0.0;
	this.dy = 0.0;
	this.oldR = 1.0;
	this.r = 0.0;	
	this.m = 0.0;
	this.damageR = 3.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.checkTargets = function() {
	var r, dr;
	var goals = ['shatl', 'meteorite', 'angel', 'arhAngel', 'principat', 'potestat', 'reward']; 

	for (var i = 0; i < scene.elements.length; i++) {
		if (scene.elements[i].status == 'norm' && goals.includes(scene.elements[i].type)) {
			r = radius(this, scene.elements[i]);			
			dr = this.damageR + scene.elements[i].r;

			if (r < dr) {
				scene.elements[i].hit(this.dx, this.dy);
				this.destroy();
				return;
			}
		}
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.engine = function() {
	this.x = this.x + this.dx;
	this.y = this.y + this.dy;
	this.r = Math.random() * 3.0;
	if (this.m > 0) this.m -= 0.1;
	if (this.m < 0) this.status = 'delete';
	
	if (this.status != 'delete') this.checkTargets();	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.shadow = function(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r + 2.0, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.shablon = function(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.show = function() {
	var x = this.x - sceneX;
	var y =  this.y - sceneY;	
	
	this.shadow(this.oldX, this.oldY, this.oldR, '#000000');
	this.shablon(x, y, this.r, '#88FF88');
	this.oldX = x; this.oldY = y; this.oldR = this.r;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY, this.oldR, '#000000');	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
