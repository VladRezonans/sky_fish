//---------------------------------------------------------------------------------------------------------------------------------------------------
function tMultiGun() {
	this.type = 'multiGun';
	this.maxCooldownGun = 10.0
	this.startDa = -0.04;
	this.stepDa = 0.02;
	this.maxCharge = 5;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tMultiGun.prototype.shot = function(shooter) {
	var i, da, dx, dy;

	for (i = 0, da = this.startDa; i < this.maxCharge; i++, da += this.stepDa) {
		dx = shooter.dx + 15 * Math.sin(shooter.a + da);
		dy = shooter.dy + 15 * Math.cos(shooter.a + da);

		plazma = new tPlazma();
		plazma.setParam({ x: shooter.x, 
				  y: shooter.y, 
		                  dx: dx, 
		                  dy: dy,
				  m: 10.0 });

		scene.add(plazma);		 
	}	
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
extend(tSingleGun, tMultiGun);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tSingleGun() {
	this.type = 'singleGun';
	this.maxCooldownGun = 4.0
	this.startDa = 0;
	this.stepDa = 0;
	this.maxCharge = 1;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
extend(tTripleGun, tMultiGun);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTripleGun() {
	this.type = 'tripleGun';
	this.maxCooldownGun = 8.0
	this.startDa = -0.02;
	this.stepDa = 0.02;
	this.maxCharge = 3
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tDoubleGun() {
	this.type = 'doubleGun';
	this.maxCooldownGun = 6.0
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tDoubleGun.prototype.shot = function(shooter) {
	var dx = shooter.dx + 15 * Math.sin(shooter.a);
	var dy = shooter.dy + 15 * Math.cos(shooter.a);
	var plazma, x, y, point = 1;
	var x, y, i;
	
	for (i = 0, point = -1; i < 2; i++, point = 1) {
		x = shooter.x + 10 * Math.sin(shooter.a) + point * 6.0 * Math.sin(shooter.a + Math.PI/2.0);
		y = shooter.y + 10 * Math.cos(shooter.a) + point * 6.0 * Math.cos(shooter.a + Math.PI/2.0);

		plazma = new tPlazma();
		plazma.setParam({ x: x, 
				  y: y, 
		                  dx: dx, 
		                  dy: dy,
				  m: 10.0 });

		scene.add(plazma);		 
	}	
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function tPowerGun() {
	this.type = 'powerGun';
	this.maxCooldownGun = 12.0	
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
tPowerGun.prototype.shot = function(shooter) {
	var dx = shooter.dx + 10 * Math.sin(shooter.a);
	var dy = shooter.dy + 10 * Math.cos(shooter.a);
	var plazma;	
	        
	for (var i = 0; i < 8; i++) {
		plazma = new tPlazma({ x: shooter.x + (2.0 - Math.random() * 4.0) + (shooter.r + 10) * Math.sin(shooter.a), 
			  	       y: shooter.y + (2.0 - Math.random() * 4.0) + (shooter.r + 10) * Math.cos(shooter.a), 
                          	       dx: dx, 
                                       dy: dy,
			               m: 14.0 });
		scene.add(plazma);		
	}	
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
