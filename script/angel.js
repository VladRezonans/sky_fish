//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tAngel, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tAngel(params) {
	this.type =   'angel';
	this.group =  'physical';
	this.status = 'norm';

	this.color = '#8888FF'

	this.r = 10;
	this.x = 600;
	this.y = 600;
	this.dx = 0;	
	this.dy = 0;
	this.a = 2.0;
	this.da = 0;
	this.lockT = 0.1;

	this.m = Math.pow(this.r/2.0, 3);

	this.maxSpeed = 4.0;
	this.maxPower = 0.01;

	this.leftPower = false;
	this.rightPower = false;
	this.leftPowerValue = 0;
	this.rightPowerValue = 0;
	this.oldLeftPowerValue = 0; 
	this.oldRightPowerValue = 0;

	this.maxCooldownGun = 30.0;
	this.cooldownGun = 0.0;	
	this.radiusGun = 500.0;
	this.score = 20;
	
	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engineRocket = function() {
	if (this.leftPower) this.leftPowerValue += 0.0005;
	else this.leftPowerValue -= 0.02;

	if (this.rightPower) this.rightPowerValue += 0.0005;
	else this.rightPowerValue -= 0.02;

	if (this.leftPowerValue > this.maxPower) this.leftPowerValue = this.maxPower;
	if (this.rightPowerValue > this.maxPower) this.rightPowerValue = this.maxPower;	
	
	if (this.leftPowerValue < 0) this.leftPowerValue = 0;
	if (this.rightPowerValue < 0) this.rightPowerValue = 0;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engineHelm = function() {
	if (this.a > 2.0 * Math.PI) this.a = this.a - 2.0 * Math.PI;
	if (this.a < 0) this.a = this.a + 2.0 * Math.PI;        

	this.da = this.da + 0.01 * this.rightPowerValue - 0.01 * this.leftPowerValue;

	this.da -= this.da * 0.001;
	this.a += this.da;      	
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engineMove = function() {
	if( (this.dx * this.dx + this.dy * this.dy) < this.maxSpeed * this.maxSpeed ) {
		this.dx = this.dx + (this.leftPowerValue + this.rightPowerValue) * Math.sin(this.a);
		this.dy = this.dy + (this.leftPowerValue + this.rightPowerValue) * Math.cos(this.a);
	}
	
	this.dx -= this.dx * 0.005;	
	this.dy -= this.dy * 0.005;	
	
	this.x += this.dx;
	this.y += this.dy;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engineExtended = function() {
	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engine = function() {
	this.behavior();
	this.engineRocket();
	this.engineHelm();
	this.engineMove();
	this.engineExtended();
	this.engineLock();
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.engineLock = function() {
	this.lockT -= 0.01;
	if (this.lockT < 0) this.lockT = 0;
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.behavior = function() {	
	var r = radius(this, shatl);
	var a = angle(this, shatl);
	
	this.leftPower = true;
	this.rightPower = true;

	if (this.a > a) this.rightPower = false;
	if (this.a < a) this.leftPower = false;

	if (this.da >  0.01) this.leftPower = true;
	if (this.da < -0.01) this.rightPower = true;

	if (this.a > a - 0.01  &&  this.a < a + 0.01) {
		this.leftPower = true;
		this.rightPower = true;
	}

	if (r < this.radiusGun && this.a > a - 0.01  &&  this.a < a + 0.01) this.bang();	

	this.behaviorExtended();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.behaviorExtended = function() {
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.shablonTail = function(x, y, a, leftValue, rightValue) {
	var x1, y1;	
	var r = this.r + 3;
	var dv = 0.004 * Math.random();	

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFBBBB";

	// left
	ctx.beginPath();
	x1 = x + r * Math.sin(a + Math.PI/2.0);
	y1 = y + r * Math.cos(a + Math.PI/2.0);
	ctx.moveTo(x1, y1);

	x1 = x1 - 1000 * (leftValue + dv) * Math.sin(a);
	y1 = y1 - 1000 * (leftValue + dv) * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();

	// right
	ctx.beginPath();
	x1 = x - r * Math.sin(a + Math.PI/2.0);
	y1 = y - r * Math.cos(a + Math.PI/2.0);
	ctx.moveTo(x1, y1);

	x1 = x1 - 1000 * (rightValue + dv) * Math.sin(a);
	y1 = y1 - 1000 * (rightValue + dv) * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.shablonShield = function(x, y) {
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.shablon = function(x, y, a, leftValue, rightValue) {
	var x1, y1;	

	ctx.lineWidth = 1;
	ctx.strokeStyle = this.color;
       
	// body	
	ctx.beginPath();	
	ctx.arc(x, y, this.r, 0, 2 * Math.PI);	
	ctx.stroke();

	// shield
	this.shablonShield(x, y);

	// tail
	this.shablonTail(x, y, a, leftValue, rightValue);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.show = function() {	
	var x = this.x - sceneX;
	var y =  this.y - sceneY;	
	
	this.shablon(x, y, this.a, this.leftPowerValue, this.rightPowerValue, true);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.bang = function() {
	var dx, dy;		
	
        if (this.cooldownGun > 0) return;

	dx = this.dx + 15 * Math.sin(this.a);
	dy = this.dy + 15 * Math.cos(this.a);

	var plazma = new tPlazma();
	plazma.setParam({ x: this.x, 
			  y: this.y, 
                          dx: dx, 
                          dy: dy,
			  m: 10.0 });
	this.cooldownGun = this.maxCooldownGun;
	scene.add(plazma);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;	

	for (i = 0; i < this.r; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy, score: this.score, color: "'#CC8844'" }));
	}
	
	this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.destroy = function() {
	if (Math.random() * 15 > 14) scene.add(new tReward({ x: this.x, y: this.y }));
	this.status = 'delete';	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.touch = function(ob) {
	if (this.lockT > 0 || shatl.score < 500000) return;

	if (ob.status == 'norm' && this.status == 'norm' && ob.type =='angel' && this.type =='angel') {
		this.status = 'delete';
		ob.status = 'delete';

		newOb = new tArhAngel({ x: this.x + (this.x - ob.x)/2.0, y: this.y + (this.y - ob.y)/2.0 });
		scene.add(newOb);
		this.salute(newOb);
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tAngel.prototype.salute = function(newOb) {
	var i, dx, dy;

	for (i = 0; i < 30; i++) {
		dx = Math.random() * 5.0 - 2.5;
		dy = Math.random() * 5.0 - 2.5;

		scene.add(new tMineral({ x: newOb.x, y: newOb.y,
					 dx: dx, dy: dy,
					 t: 2.0,
					 lockT: 0.5,
					 score: 1,
					 color: "'#444488'" }));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
