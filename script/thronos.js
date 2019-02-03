//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tThronos, tPotestates);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tThronos(params) {
	this.type =   'thronos';
	this.group =  'physical';
	this.status = 'norm';

	this.color = '#8888FF'

	this.r = 22;
	this.x = 600;
	this.y = 600;
	this.dx = 0;
	this.dy = 0;
	this.a = 2.0;
	this.da = 0;
	this.lockT = 0.1;

	this.m = 340;

	this.maxSpeed = 2.0;
	this.maxPower = 0.012;

	this.leftPower = false;
	this.rightPower = false;
	this.leftPowerValue = 0;
	this.rightPowerValue = 0;

	this.maxCooldownGun = 20.0;
	this.cooldownGun = 0.0;
	this.radiusGun = 800.0;

	this.score = 20;
	this.hitCount = 20;
	this.gun = new tDiffuseGun();

	this.shield = false;
	this.cooldownShield = 0.0;
	this.maxCooldownShield = 20.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tThronos.prototype.engineExtended = function() {
	if (this.shield) this.cooldownShield -= 0.1;
	else this.cooldownShield += 0.2;

	if (this.cooldownShield < 0) { this.shield = false; this.cooldownShield = 0; }
	if (this.cooldownShield > this.maxCooldownShield) this.cooldownShield = this.maxCooldownShield;

	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;

	this.createCooldown -= 0.01;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tThronos.prototype.behaviorExtended = function() {
	if (Math.random() * 5000 > 4999) {
		scene.add(new tAngel({ x: this.x, y: this.y }));
		scene.add(new tAngel({ x: this.x, y: this.y }));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tThronos.prototype.shablonShield = function(x, y) {
	if (this.shield) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#6666DD";

		ctx.beginPath();
		ctx.arc(x, y, this.r + 6, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tThronos.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	if (this.shield) {
		this.hitShield(plazmaDx, plazmaDy);
		return;
	}

	for (i = 0; i < 8; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy, score: this.score, color: "'#CC8844'" }));
	}

	this.hitCount -= 1;
	if (this.hitCount == 0) this.destroy();

	if (this.cooldownShield == this.maxCooldownShield) this.shield = true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tThronos.prototype.hitShield  = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

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
