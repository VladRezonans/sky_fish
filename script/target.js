//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tTarget, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTarget(params) {
	this.type = 'mineral';
	this.status = 'norm';		
	
	this.x = 0;
	this.y = 0;
	this.oldX = 0;
	this.oldY = 0;
	this.a = 3;
	this.oldA = 0;
	this.r = 4;
	
	if('goal'  in params) this.goal = params['goal'];
	this.color = this.goal.type == 'reward' ? '#FFD700' : '#44AA44';
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tTarget.prototype.engine = function() {
	var dx1, dy1, dx2, dy2, centerX, centerY;

	centerX = sceneX + scene.dX/2.0;
	centerY = sceneY + scene.dY/2.0;

	var dx = this.goal.x - centerX;
	var dy = this.goal.y - centerY;	

	if (Math.abs(dx) > Math.abs(dy) * scene.dX / scene.dY) {
		if (dx > 0) dx2 = scene.dX/2.0 - 10;
		else dx2 = 10 - scene.dX/2.0;			
		dy1 = (dx - dx2)/dx * dy;	
	} else {	
		if (dy > 0) dy2 = scene.dY/2.0 - 10;
		else dy2 = 10 - scene.dY/2.0;	
		dy1 = dy - dy2;
		dx2 = dx - (dy1/dy) *dx;		
	}

	this.x = centerX + dx2;
	this.y = centerY + dy - dy1;

	this.x -= sceneX;
	this.y -= sceneY;

	if ( dx > 0) {
		this.a = Math.asin(-dy/Math.sqrt(dx * dx + dy * dy));
		this.a += Math.PI/2.0;
	}		 
	if ( dx < 0) {
		this.a = Math.asin(dy/Math.sqrt(dx * dx + dy * dy));
		this.a -= Math.PI/2.0;
	}	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTarget.prototype.shadow = function(x, y, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, 2.0* this.r + 1.0, 0, 2 * Math.PI);	
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTarget.prototype.shablon = function(x, y, a) {
	var x1, y1;
	ctx.lineWidth = 1;
	ctx.strokeStyle = this.color;
	
	ctx.beginPath();

	x1 = x + 2.0 * this.r * Math.sin(a);
	y1 = y + 2.0 * this.r * Math.cos(a);
	ctx.moveTo(x1, y1);		

	x1 = x + this.r * Math.sin(a + 2.0*Math.PI/3.0);
	y1 = y + this.r * Math.cos(a + 2.0*Math.PI/3.0);	
	ctx.lineTo(x1, y1);

	x1 = x + this.r * Math.sin(a + 4.0*Math.PI/3.0);
	y1 = y + this.r * Math.cos(a + 4.0*Math.PI/3.0);	
	ctx.lineTo(x1, y1);

	x1 = x + 2.0 * this.r * Math.sin(a);
	y1 = y + 2.0 * this.r * Math.cos(a);
	ctx.lineTo(x1, y1);

	ctx.stroke();	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTarget.prototype.show = function() {
	this.engine();

	this.shadow(this.oldX, this.oldY, '#000000');
	this.shablon(this.x, this.y, this.a);

	this.oldX = this.x; this.oldY = this.y; this.oldA = this.a;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTarget.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY, '#000000');
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
