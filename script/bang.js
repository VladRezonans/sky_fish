//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tBang, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tBang(params) {
	this.type = 'bang';
	this.status = 'normal';	
	this.color = "#FFD700";

	this.x = 600;
	this.y = 600;

	this.r = 0;
	this.maxR = 10;
	this.negativeR = - 2.0 * this.maxR;
	this.dr = this.maxR/2.0;
	this.might = 1;
	this.goals = ['shatl'].concat(GOALS);

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
	
	this.shablon(x, y, this.r);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tBang.prototype.destroy = function() {
	var dx, dy, r, target;	

	for (var i = 0; i < scene.elements.length; i++) {
		target = scene.elements[i];			

		if (target.status == 'norm' && this.goals.includes(target.type)) {
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

