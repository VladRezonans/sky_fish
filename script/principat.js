//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPrincipat, tArhAngel);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tPrincipat(params) {
	this.type =   'principat';
	this.group =  'physical';
	this.status = 'norm';

	this.color = '#8888FF'

	this.r = 8;
	this.x = 600;
	this.y = 300;
	this.dx = 0;	
	this.dy = 0;
	this.a = 1.5;
	this.da = 0;	

	this.m = Math.pow(this.r/2.0, 3);

	this.maxSpeed = 4.0;
	this.maxPower = 0.02;

	this.leftPower = false;
	this.rightPower = false;
	this.leftPowerValue = 0;
	this.rightPowerValue = 0;
	this.oldLeftPowerValue = 0; 
	this.oldRightPowerValue = 0;

	this.maxCooldownGun = 20.0;
	this.cooldownGun = 0.0;
	this.radiusGun = 1000;

	this.shield = true;
	this.cooldownShield = 0.0;
	this.maxCooldownShield = 5.0;
	
	this.score = 40;
	
	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPrincipat.prototype.behaviorExtended = function() {	
	var a = angle(this, shatl) - Math.PI;	
	
        if (shatl.a > a - 0.02 && shatl.a < a + 0.02) {
		if (this.da >=  0) {
			this.leftPower = false;
			this.rightPower = true;			
		
		} else {
			this.leftPower = true;
			this.rightPower = false;
			
		}	
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
