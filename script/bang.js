//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tBang, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tBang(params) {
	this.type = 'bang';
	this.status = 'normal';	
	this.color = "#FFD700";

	this.oldX = 600.0;
	this.oldY = 600.0;
	this.x = this.oldX;
	this.y = this.oldY;

	this.r = 0;
	this.oldR = 0;
	this.maxR = 10;
	this.negativeR = - 2.0 * this.maxR;
	this.dr = this.maxR/2.0;
	this.might = 1;
			
	this.setParam(params);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.engine = function() {
	this.r += this.dr;
	if (this.r > this.maxR) this.r = this.maxR;
	
	this.negativeR += this.dr;	
	if (this.negativeR > this.maxR) this.destroy();	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.shadow = function(x, y, r) {
	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.arc(x, y, r + 3, 0, 2 * Math.PI);	
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.shablon = function(x, y, r) {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(x, y, r, 0, 2 * Math.PI);	
	ctx.fill();

	if (this.negativeR > 0) {
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.arc(x, y, this.negativeR, 0, 2 * Math.PI);	
		ctx.fill();
	}	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;	
	
	this.shadow(this.oldX, this.oldY, this.oldR);
	this.shablon(x, y, this.r);
	this.oldX = x; this.oldY = y; this.oldR = this.r;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY, this.oldR);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.destroy = function() {
	var goals = ['shatl', 'meteorite', 'angel', 'arhAngel', 'principat', 'potestat', 'reward']; 
	var dx, dy, r, target;	

	for (var i = 0; i < scene.elements.length; i++) {
		target = scene.elements[i];			

		if (target.status == 'norm' && goals.includes(target.type)) {
			r = radius(this, target);			

			if (r < this.maxR + target.r) {
				dx = target.x - this.x;
				dy = target.y - this.y;

				for (var j = 0; j < this.might; j++) {
					target.hit(16.0 * dx/r, 16.0 * dy/r);
					if (target.status == 'delete') break;
				}	
			}	
		}
        }

	this.status = 'delete'; 
}
//---------------------------------------------------------------------------------------------------------------------------------------------------

