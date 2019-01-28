//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tHeavyMissile, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tHeavyMissile(params) {
	this.type = 'heavyMissile';
	this.status = 'norm';
	this.r = 8;
	this.color = '#226622';

	this.x = 0;
	this.y = 0;
	this.dx = 0.0;
	this.dy = 0.0;

	this.a = Math.PI;
	this.da = 0.00;

	this.v = 0.0;
	this.dv = 0.02;
	this.maxSpeed = 30.0;
	this.maxPower = 0.1;

	this.t = 5;
	this.lockT = 0.5;
	this.damageR = 60.0;
	this.sensitiveR = 40;
	this.might = 5;

	this.goals = GOALS;
	
	this.setParam(params);	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.checkTargets = function() {	
	var r, target;	

	for (var i = 0; i < scene.elements.length; i++) {
		target = scene.elements[i];			

		if (target.status == 'norm' && this.goals.includes(target.type)) {
			r = radius(this, target);			
			if (r < this.sensitiveR + target.r) {
				this.bang();
				break;	
			}
		}
        }

}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.engine = function() {
	this.v += this.dv;
	if (this.v > this.maxPower) this.v = this.maxPower;
        if (this.v < 0) this.v = 0;

	
	if( (this.dx * this.dx + this.dy * this.dy) < this.maxSpeed * this.maxSpeed ) {				
		this.dx = this.dx + this.v * Math.sin(this.a);
		this.dy = this.dy + this.v * Math.cos(this.a);
	}
	
	this.dx -= this.dx * 0.001;	
	this.dy -= this.dy * 0.001;	
	
	this.x += this.dx;
	this.y += this.dy;
	
	if (this.lockT < 0) this.checkTargets();

	this.lockT -= 0.01;
	this.t -= 0.01;
	if (this.t < 0) this.bang();	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.shablonTail = function(x, y, a) {
	var x1, y1, dv;
	var r = this.r + 3;

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFBBBB";
	ctx.beginPath();	

	x1 = x - r * Math.sin(a);
	y1 = y - r * Math.cos(a);
	ctx.moveTo(x1, y1);

        dv = 5 * Math.random();
	x1 = x - (r + 100 * this.v + dv) * Math.sin(a);
	y1 = y - (r + 100 * this.v + dv) * Math.cos(a);
	ctx.lineTo(x1, y1);

	ctx.stroke();
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.shablon = function(x, y, a) {
	var x1, y1, x2, y2, xs, ys;
	var dr = this.r/4.0;
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.color;
       
	ctx.beginPath();	
	
	x1 = x + (this.r - dr) * Math.sin(a);
	y1 = y + (this.r - dr) * Math.cos(a);	

	// head
	ctx.arc(x1, y1, dr, -a, -a + Math.PI);		

	// top				
	xs = x1 + dr * Math.sin(a + Math.PI/2.0);
	ys = y1 + dr * Math.cos(a + Math.PI/2.0);	

	x2 = x1 + dr * Math.sin(a - Math.PI/2.0);
	y2 = y1 + dr * Math.cos(a - Math.PI/2.0);
	ctx.moveTo(x2, y2);

        // bottom
	x1 = x - this.r * Math.sin(a);
	y1 = y - this.r * Math.cos(a);
			
	x2 = x1 - dr * Math.sin(a + Math.PI/2.0);
	y2 = y1 - dr * Math.cos(a + Math.PI/2.0);
	ctx.lineTo(x2, y2);

	x2 = x1 + dr * Math.sin(a + Math.PI/2.0);
	y2 = y1 + dr * Math.cos(a + Math.PI/2.0);
	ctx.lineTo(x2, y2);

	ctx.lineTo(xs, ys);

	ctx.stroke();

	// tail
	this.shablonTail(x, y, a)
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;

	this.shablon(x, y, this.a);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tHeavyMissile.prototype.bang = function() {
	scene.add(new tBang({ x: this.x, y: this.y, maxR: this.damageR, might: this.might }));
	this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
