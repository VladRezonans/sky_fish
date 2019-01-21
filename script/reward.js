//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tReward, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tReward(params) {
	this.type = 'reward';
	this.group = 'physical';
	this.status = 'norm';

	this.color = "#448844";
	this.textColor = "#FFD700"

	this.r = 16;
	this.m = Math.pow(this.r/3.0, 3);	
	this.oldX = 600;
	this.oldY = 600;
	this.x = this.oldX;
	this.y = this.oldY;
	this.dx = 0;	
	this.dy = 0;
	this.a1 = 0;
	this.a2 = 0;

	this.lockT = 0.3;
	this.t = 200;
	
	this.globalScore = 200;	
	this.score = 20;
	
	this.kinds = ['cooldown', 'drag', 'cruise', 'stability', 'targets', 'shield', 'heavyMissile', 'smartMissile', 'plazmaMissile', 'megaMissile'];
	this.rockets = { heavyMissile: 18, smartMissile: 16, plazmaMissile: 6, megaMissile: 4 };

	this.kind = this.getKind();	
	this.setParam(params);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.getKind = function() {	
	var choice = diffArray(this.kinds, Object.keys(shatl.tools));
	return choice[Math.floor(Math.random() * choice.length)];
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.title = function() {
	return this.kind.toUpperCase()[0];
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.engine = function() {
	var r = radius(this, shatl);
	if (r < 30) this.rewarding(0, 0);

	this.dx -= this.dx * 0.005;	
	this.dy -= this.dy * 0.005;	
	
	this.x += this.dx;
	this.y += this.dy;

	this.lockT -= 0.01;
	if (this.lockT < 0) this.lockT = 0;

	this.t -= 0.01;
	if (this.t < 0) this.status = 'delete';

	this.a1 += 0.05;
	this.a2 -= 0.05;

	if (this.a1 > 2.0 * Math.PI) this.a1 = this.a1 - 2.0 * Math.PI;
	if (this.a2 < 0) this.a2 = this.a2 + 2.0 * Math.PI;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.rewarding = function(x, y) {
	var dx, dy;
	
	shatl.score += this.globalScore;
	this.giveToShatl();

	for (i = 0; i < this.r - 1; i++) {
		dx = Math.random() * 8.0 - 4.0 + x /10.0;
		dy = Math.random() * 8.0 - 4.0 + y /10.0;
		scene.add(new tMineral({ x: this.x, 
					 y: this.y, 
                                         dx: dx, 
					 dy: dy,
					 color: "'#44AA44'",	 
					 score: this.score }));
	}	

	this.status = 'delete';
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.giveToShatl = function() {
	if (this.rockets[this.kind]) {
		if (shatl.missileKind == '') shatl.missileKind = this.kind;
		if ( !shatl.missileCounts[this.kind] ) shatl.missileCounts[this.kind] = 0;
		shatl.missileCounts[this.kind] += this.rockets[this.kind];		
		
	} else {
		shatl.tools[this.kind] = true;
	}	
}	
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.hit = function(x, y) {
	if (this.lockT == 0) this.rewarding(x, y);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.shadow = function(x, y, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, this.r + 4, 0, 2 * Math.PI);	
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.shablon = function(x, y) {
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.color;
	ctx.arc(x, y, this.r, this.a1, this.a1 + 2 * Math.PI - Math.PI/4);	
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.color;
	ctx.arc(x, y, this.r - 5, this.a2, this.a2 + 2 * Math.PI - Math.PI/4);	
	ctx.stroke();

	ctx.fillStyle = this.textColor;
	ctx.font = "14px Arial";
	ctx.fillText(this.title(), x - 5, y + 5);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.show = function() {
	var x = this.x - sceneX;
	var y = this.y - sceneY;
	
	this.shadow(this.oldX, this.oldY, '#000000');
	this.shablon(x, y);
	this.oldX = x; this.oldY = y;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tReward.prototype.hide = function() {
	this.shadow(this.oldX, this.oldY, '#000000');
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
