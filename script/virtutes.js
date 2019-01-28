//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tVirtutes, tPotestates);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tVirtutes(params) {
	this.type =   'virtutes';
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
	this.hitCount = 9;
	this.gun = new tDoubleGun();

	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tVirtutes.prototype.engineExtended = function() {
	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;

	this.cooldownRocket -= 0.1;
	if (this.cooldownRocket	< 0) this.cooldownRocket = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tVirtutes.prototype.behaviorExtended = function() {
	var r = radius(this, shatl);
	var a = angle(this, shatl);

	if (r < this.radiusRocket && this.a > a - 0.01  &&  this.a < a + 0.01) this.startMissile();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tVirtutes.prototype.startMissile = function() {
	var params, x, y;

	if (this.cooldownRocket > 0) return;

	x = this.x + 20 * Math.sin(this.a) + Math.sin(this.a + Math.PI/2.0);
	y = this.y + 20 * Math.cos(this.a) + Math.cos(this.a + Math.PI/2.0);
	params = { x: x, y: y, a: this.a, dx: this.dx, dy: this.dy, goals: ["'shatl'"], sensitiveR: 20 };

	scene.add(new tHeavyMissile(params));
	this.cooldownRocket = this.maxCooldownRocket;
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
