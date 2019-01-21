//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tSmartMissile, tHeavyMissile);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tSmartMissile(params) {
	this.type = 'smartMissile';
	this.status = 'norm';
	this.r = 4;
	this.color = '#226622';
	
	this.oldX = 600.0;
	this.oldY = 600.0;
	this.x = this.oldX;
	this.y = this.oldY;
	this.dx = 0.0;
	this.dy = 0.0;

	this.oldA = 0.0;
	this.a = Math.PI;
	this.da = 0.04;

	this.v = 0.0;
	this.dv = 0.01;
	this.maxSpeed = 18.0;
	this.maxPower = 0.1;

	this.t = 5.0;
	this.lockT = 0.1;
	this.damageR = 20.0;
	this.sensitiveR = 10;
	this.targetR = 2000;
	this.might = 2;	
	
	this.goals = ['meteorite', 'angel', 'arhAngel', 'principat', 'potestat', 'reward']; 
	
	this.setParam(params);	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tSmartMissile.prototype.checkTargets = function() {
	var r, target, enemy;
	var dx, dy, a1, a2, da, minDa = 2.0 * Math.PI;

	for (var i = 0; i < scene.elements.length; i++) {
		target = scene.elements[i];			

		if (target.status == 'norm' && this.goals.includes(target.type)) {
			r = radius(this, target);

			if (r < this.sensitiveR + target.r) {
				this.bang();
				break;
			}

			if (r < this.targetR) {
				dx = target.x - this.x;
				dy = target.y - this.y;					

				if (this.dx != 0 && this.dx != 0) {
					a1 = Math.atan2(dy, dx);
					a2 = Math.atan2(this.dy, this.dx);

					da = Math.abs(a1 - a2);
					da = da > Math.PI ? 2.0 * Math.PI - da : da;
	 
					 if (da < minDa) {
						minDa = da;
						enemy = target;
					 }												
				}				
			}
		}
        }

	if (enemy) this.targeting(enemy);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tSmartMissile.prototype.targeting = function(ob) {
	var dx = ob.x - this.x;
	var dy = ob.y - this.y;

	if (dx == 0 || this.dx == 0) return;	

	if (dx/this.dx > 0) {
		if ( dy/dx > this.dy/this.dx ) this.a -= this.da;
		if ( dy/dx < this.dy/this.dx ) this.a += this.da;
	}
	if (dx/this.dx < 0) {
		if ( dy/dx > this.dy/this.dx ) this.a += this.da;
		if ( dy/dx < this.dy/this.dx ) this.a -= this.da;
	}
	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tSmartMissile.prototype.engine = function() {
	if (this.a > 2.0 * Math.PI) this.a = this.a - 2.0 * Math.PI;
	if (this.a < 0) this.a = this.a + 2.0 * Math.PI;
	
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