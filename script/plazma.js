//--------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPlazma, tShape);
//--------------------------------------------------------------------------------------------------------------------------------------------------
function tPlazma(params) {
	this.type = 'plazma';
	this.status = 'norm';
	this.group = 'plazma';
	this.x = 0.0;
	this.y = 0.0;
	this.dx = 0.0;
	this.dy = 0.0;
	this.drawR = 0.0;
	this.m = 0.0;
	this.r = 3.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazma.prototype.checkTargets = function() {
	var ob, r, dr;

	for (var i = 0; i < scene.elements.physical.length; i++) {
		ob = scene.elements.physical[i];

		if (ob.status == 'norm') {
			r = radius(this, ob);
			dr = this.r + ob.r;

			if (r < dr) {
				ob.hit(this.dx, this.dy);
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
	this.drawR = Math.random() * 3.0;
	if (this.m > 0) this.m -= 0.1;
	if (this.m < 0) this.status = 'delete';

	if (this.status != 'delete') this.checkTargets();
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
	
	this.shablon(x, y, this.drawR, '#88FF88');
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
