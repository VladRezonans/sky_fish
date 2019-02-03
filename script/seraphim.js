//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tSeraphim, tCherubim);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tSeraphim(params) {
	this.type =   'seraphim';
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
	this.hitCount = 21;
	this.gun = new tDiffuseGun();

	this.shieldI = true;
	this.cooldownShieldI = 0.0;
	this.maxCooldownShieldI = 5.0;

	this.shieldII = false;
	this.cooldownShieldII = 0.0;
	this.maxCooldownShieldII = 20.0;

	this.maxCooldownRocket = 60.0;
	this.cooldownRocket = 0;
	this.radiusRocket = 1500.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tSeraphim.prototype.engineExtended = function() {
	if (!this.shieldI) {
		this.cooldownShieldI -= 0.1;
		if (this.cooldownShieldI < 0) this.shieldI = true;
        }

	if (this.shieldII) this.cooldownShieldII -= 0.1;
	else this.cooldownShieldII += 0.2;

	if (this.cooldownShieldII < 0) { this.shieldII = false; this.cooldownShieldII = 0; }
	if (this.cooldownShieldII > this.maxCooldownShieldII) this.cooldownShieldII = this.maxCooldownShieldII;

	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;

	this.cooldownRocket -= 0.1;
	if (this.cooldownRocket	< 0) this.cooldownRocket = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tSeraphim.prototype.behaviorExtended = function() {
	var r = radius(this, shatl);
	var a = angle(this, shatl);

	if (r < this.radiusRocket && this.a > a - 0.01  &&  this.a < a + 0.01) this.startMissile();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tSeraphim.prototype.startMissile = function() {
	var params, x, y;

	if (this.cooldownRocket > 0 || scene.elements.missiles.length > 16) return;

	x = this.x + 20 * Math.sin(this.a) + Math.sin(this.a + Math.PI/2.0);
	y = this.y + 20 * Math.cos(this.a) + Math.cos(this.a + Math.PI/2.0);
	params = { x: x, y: y, a: this.a, dx: this.dx, dy: this.dy, goals: ["'shatl'"] };

	scene.add(new tMegaMissile(params));
	this.cooldownRocket = this.maxCooldownRocket;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tSeraphim.prototype.shablonShield = function(x, y) {
	if (this.shieldI) {
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#444466";

		ctx.beginPath();
		ctx.arc(x, y, this.r + 6, 0, 2 * Math.PI);
		ctx.stroke();
	}

	if (this.shieldII) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#6666DD";

		ctx.beginPath();
		ctx.arc(x, y, this.r + 6, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tSeraphim.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	if (this.cooldownShieldII == this.maxCooldownShieldII) this.shieldII = true;

	if (this.shieldI) {
		this.shieldI = false;
		this.hitShield(plazmaDx, plazmaDy);
		this.cooldownShieldI = this.maxCooldownShieldI;
		return;
	}

	if (this.shieldII) {
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
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
