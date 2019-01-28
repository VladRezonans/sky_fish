//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tDominationes, tVirtutes);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tDominationes(params) {
	this.type =   'dominationes';
	this.group =  'physical';
	this.status = 'norm';

	this.color = '#8888FF'

	this.r = 14;
	this.x = 600;
	this.y = 600;
	this.dx = 0;
	this.dy = 0;
	this.a = 2.0;
	this.da = 0;
	this.lockT = 0.1;

	this.m = 140;

	this.maxSpeed = 2.0;
	this.maxPower = 0.02;

	this.leftPower = false;
	this.rightPower = false;
	this.leftPowerValue = 0;
	this.rightPowerValue = 0;
	this.oldLeftPowerValue = 0;
	this.oldRightPowerValue = 0;

	this.maxCooldownGun = 20.0;
	this.cooldownGun = 0.0;
	this.radiusGun = 800.0;

	this.maxCooldownRocket = 40.0;
	this.cooldownRocket = 0;
	this.radiusRocket = 1500.0;

	this.score = 20;
	this.hitCount = 10;
	this.gun = new tDoubleGun();

	this.shield = true;
	this.cooldownShield = 0.0;
	this.maxCooldownShield = 5.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDominationes.prototype.engineExtended = function() {
	if (!this.shield) {
		this.cooldownShield -= 0.1;
		if (this.cooldownShield < 0) this.shield = true;
       }

	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;

	this.cooldownRocket -= 0.1;
	if (this.cooldownRocket	< 0) this.cooldownRocket = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDominationes.prototype.shablonShield = function(x, y) {
	if (this.shield) {
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#444466";

		ctx.beginPath();
		ctx.arc(x, y, this.r + 6, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDominationes.prototype.startMissile = function() {
	var params, x, y, rokcetPoint;

	if (this.cooldownRocket > 0) return;

	for (rokcetPoint = -1; rokcetPoint <= 1; rokcetPoint += 2) {
		x = this.x + 20 * Math.sin(this.a) + rokcetPoint * 8.0 * Math.sin(this.a + Math.PI/2.0);
		y = this.y + 20 * Math.cos(this.a) + rokcetPoint * 8.0 * Math.cos(this.a + Math.PI/2.0);

		params = { x: x, y: y, a: this.a, dx: this.dx, dy: this.dy, goals: ["'shatl'"] };
		scene.add(new tSmartMissile(params));
	}

	this.cooldownRocket = this.maxCooldownRocket;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDominationes.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	if (this.shield) {
		this.hitShield(plazmaDx, plazmaDy);
		this.cooldownShield = this.maxCooldownShield;
		return;
	}

	for (i = 0; i < 8; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy, score: this.score, color: "'#CC8844'" }));
	}

	this.hitCount -= 1;
	if (this.hitCount == 0) this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDominationes.prototype.hitShield  = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	this.shield = false;

	for (i = 0; i < 5; i++) {
		dx = Math.random() * 5.0 - 1.5 + plazmaDx / 5.0;
		dy = Math.random() * 5.0 - 1.5 + plazmaDy / 5.0;

		scene.add(new tMineral({ x: this.x, y: this.y,
					 dx: -dx,   dy: -dy,
					 r: 1.0,
					 t: 2.0,
					 lockT: 0.5,
					 score: 1,
					 color: "'#88FF88'" }));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
