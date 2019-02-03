//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tCherubim, tThronos);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tCherubim(params) {
	this.type =   'cherubim';
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

	this.maxCooldownRocket = 40.0;
	this.cooldownRocket = 0;
	this.radiusRocket = 1500.0;

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tCherubim.prototype.engineExtended = function() {
	if (this.shield) this.cooldownShield -= 0.1;
	else this.cooldownShield += 0.2;

	if (this.cooldownShield < 0) { this.shield = false; this.cooldownShield = 0; }
	if (this.cooldownShield > this.maxCooldownShield) this.cooldownShield = this.maxCooldownShield;

	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;

	this.cooldownRocket -= 0.1;
	if (this.cooldownRocket	< 0) this.cooldownRocket = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tCherubim.prototype.behaviorExtended = function() {
	var r = radius(this, shatl);
	var a = angle(this, shatl);

	if (r < this.radiusRocket && this.a > a - 0.01  &&  this.a < a + 0.01) this.startMissile();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tCherubim.prototype.startMissile = function() {
	var params, x, y;

	if (this.cooldownRocket > 0 || scene.elements.missiles.length > 16) return;

	x = this.x + 20 * Math.sin(this.a) + Math.sin(this.a + Math.PI/2.0);
	y = this.y + 20 * Math.cos(this.a) + Math.cos(this.a + Math.PI/2.0);
	params = { x: x, y: y, a: this.a, dx: this.dx, dy: this.dy, goals: ["'shatl'"] };

	scene.add(new tPlazmaMissile(params));
	this.cooldownRocket = this.maxCooldownRocket;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
