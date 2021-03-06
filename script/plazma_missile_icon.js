//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPlazmaMissileIcon, tPlazmaMissile);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tPlazmaMissileIcon(params) {
	this.type = 'plazmaMissileIcon';
	this.status = 'norm';
	this.r = 10;
	this.color = '#226622';
	
	this.x = 300;
	this.y = 300;
	
	this.a = Math.PI;
	this.da = -0.003;

	this.v = 0.08;	
	
	this.setParam(params);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissileIcon.prototype.checkTargets = function() {	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissileIcon.prototype.engine = function() {
	this.a += this.da;	

	if (this.a > 2.0 * Math.PI) this.a = this.a - 2.0 * Math.PI;
	if (this.a < 0) this.a = this.a + 2.0 * Math.PI;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissileIcon.prototype.show = function() {		
	this.shablon(this.x, this.y, this.a);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissileIcon.prototype.bang = function() {
}
//---------------------------------------------------------------------------------------------------------------------------------------------------