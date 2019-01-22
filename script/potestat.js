//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPotestat, tAngel);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tPotestat(params) {
	this.type =   'potestat';
	this.group =  'physical';
	this.status = 'norm';

	this.color = '#8888FF'

	this.r = 18;
	this.x = 600;
	this.y = 600;
	this.dx = 0;	
	this.dy = 0;
	this.a = 2.0;
	this.da = 0;	

	this.m = 180;

	this.maxSpeed = 2.0;
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
	this.hitCount = 10;
	
	this.setParam(params);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPotestat.prototype.bang = function() {
	var dx, dy, plazma;	
	
        if (this.cooldownGun > 0) return;

	dx = this.dx + 10 * Math.sin(this.a);
	dy = this.dy + 10 * Math.cos(this.a);
	
	for (var i = 0; i < 8; i++) {
		plazma = new tPlazma({ x: this.x + (2.0 - Math.random() * 4.0) + (this.r + 10) * Math.sin(this.a), 
			  	       y: this.y + (2.0 - Math.random() * 4.0) + (this.r + 10) * Math.cos(this.a), 
                          	       dx: dx, 
                                       dy: dy,
			               m: 10.0 });
		scene.add(plazma);		
	}

	this.cooldownGun = this.maxCooldownGun;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPotestat.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;	

	for (i = 0; i < 8; i++) {
		dx = Math.random() * 3.0 - 1.5 + plazmaDx / 3.0;
		dy = Math.random() * 3.0 - 1.5 + plazmaDy / 3.0;
		scene.add(new tMineral({ x: this.x, y: this.y, dx: dx, dy: dy, score: this.score, color: "'#CC8844'" }));
	}
	
	this.hitCount -= 1; 
	if (this.hitCount == 0) this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
