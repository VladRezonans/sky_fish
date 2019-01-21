//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tShatl, tShape);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tShatl() {
	this.type = 'shatl';
	this.group = 'physical';
	this.status = 'norm';
	this.oldX = 600;
	this.oldY = 300;
	this.x = this.oldX;
	this.y = this.oldY; 
	this.r = 10.0;
	this.m = Math.pow(this.r/2.0, 3);
	this.oldV = 0.0;
	this.v = 0.0;
	this.a = Math.PI/2.0;
	this.da = 0.0;		
	this.dx = 0.0;
	this.dy = 0.0;

	this.rocketPower = false;
	this.leftPower = false;
	this.rightPower = false;
	this.dragPower = false;

	this.leftPowerValue = 0.0;
	this.rightPowerValue = 0.0;
	this.dragPowerValue = 0.0;
	this.oldLeftPowerValue = 0.0;
	this.oldRightPowerValue = 0.0;
	this.oldDragPowerValue = 0.0;

	this.cooldownGun = 0;
	this.maxSpeed = 14.0;
	this.maxPower = 0.02;
	this.maxDragPower = 0.005;
	this.maxHelmPower = 0.0005;
	this.maxCooldownGun = 4.0;
	this.shieldValue = 0;
	this.maxShieldValue = 100;

	this.rokcetPoint = 1;
	this.missileKind = '';
	this.missileCounts = {};	

	this.setTools();	
	
	this.score = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.setTools = function() {	
	this.cruiseControl = false;
	this.helmStabilization = true;
	this.targetsShow = true;
	this.shieldPower = false;
		
	this.tools = { cooldown: true, stability: true, targets: true };	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.turnOn = function() {
	this.rocketPower = true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.turnOff = function() {
	this.rocketPower = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.leftOn = function() {
	this.leftPower = true;
	this.rightPower = false;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.leftOff = function() {
	this.leftPower = false;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.rightOn = function() {
	this.rightPower = true;
	this.leftPower = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.rightOff = function() {
	this.rightPower = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.dragOn = function() {
	if (this.tools.drag) {
		this.dragPower = true;
		this.rocketPower = false;
		this.cruiseControl = false;
	}	
} 
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.dragOff = function() {
	if (this.tools.drag) {
		this.dragPower = false;
	}	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.cruiseControlSwitch = function() {
	if (this.tools.cruise) {
		if(this.v > 0) this.cruiseControl = !this.cruiseControl;	
	}	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.helmStabilizationSwitch = function() {
	if (this.tools.stability) {
		this.helmStabilization = !this.helmStabilization;
	}		
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.targetsSwitch = function() {
	if (this.tools.targets) {
		this.targetsShow = !this.targetsShow;
	}	
} 
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shieldOn = function() {
	if (this.tools.shield && this.shieldValue > this.maxShieldValue/3.0) {
		this.shieldPower = true;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shieldOff = function() {
	if (this.tools.shield) {
		this.shieldPower = false;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.switchMissile = function(kind) {
	if (this.missileCounts[kind] > 0) {
		this.missileKind = kind;
	}
	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.engineShield = function() {
	if (!this.tools.shield) return;
	
	if (this.shieldPower) this.shieldValue -= 0.6;
	else this.shieldValue += 0.3;

	if (this.shieldValue > this.maxShieldValue) this.shieldValue = this.maxShieldValue;
	if (this.shieldValue < 0) {
		this.shieldValue = 0;
		this.shieldPower = false;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.engineRocket = function() {
	if (!this.cruiseControl) {
		if (this.rocketPower) this.v += 0.0005;
		else this.v -= 0.02;
	}

	if (this.dragPower) this.dragPowerValue += 0.0005;
	else this.dragPowerValue -=  0.0005;
	if (this.dragPowerValue < 0) this.dragPowerValue = 0;

	if (this.dragPowerValue > this.maxDragPower) this.dragPowerValue = this.maxDragPower;	

	if (this.v > this.maxPower) this.v = this.maxPower;
        if (this.v < 0) this.v = 0;		
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.engineHelm = function() {
	var leftPower = false, rightPower = false;

	if (this.a > 2.0 * Math.PI) this.a = this.a - 2.0 * Math.PI;
	if (this.a < 0) this.a = this.a + 2.0 * Math.PI;

        if (this.leftPower || this.rightPower) {
		leftPower = this.leftPower;
		rightPower = this.rightPower;
	} else if (this.tools.stability && this.helmStabilization) {
		if (this.da > 0) leftPower = true;
		if (this.da < 0) rightPower = true;
	}        

	if (leftPower) this.leftPowerValue += 0.00002;
	else this.leftPowerValue -= 0.001;
	
	if (rightPower) this.rightPowerValue += 0.00002;
	else this.rightPowerValue -= 0.001;        

	if(this.leftPowerValue > this.maxHelmPower) this.leftPowerValue = this.maxHelmPower;
	if(this.rightPowerValue > this.maxHelmPower) this.rightPowerValue = this.maxHelmPower;

	if(this.leftPowerValue < 0) this.leftPowerValue = 0;
	if(this.rightPowerValue < 0) this.rightPowerValue = 0;

	this.da = this.da + this.rightPowerValue - this.leftPowerValue;

	this.da -= this.da * 0.001;
	this.a += this.da;      	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.engine = function() {
	this.engineHelm();
        this.engineRocket();
	this.engineShield();

	if( (this.dx * this.dx + this.dy * this.dy) < this.maxSpeed * this.maxSpeed ) {
		this.dx = this.dx + (this.v - this.dragPowerValue) * Math.sin(this.a);
		this.dy = this.dy + (this.v - this.dragPowerValue) * Math.cos(this.a);
	}		
	
	this.dx -= this.dx * 0.001;	
	this.dy -= this.dy * 0.001;	
	
	this.x += this.dx;
	this.y += this.dy;

	this.cooldownGun -= 0.1;
	if (this.cooldownGun < 0) this.cooldownGun = 0;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shadowTail = function(x, y, a,  v, color) {
	var x1, y1;

	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	ctx.beginPath();	

	x1 = x - this.r * Math.sin(a);
	y1 = y - this.r * Math.cos(a);
	ctx.moveTo(x1, y1);

	x1 = x - (this.r + 2000 * v + 2) * Math.sin(a);
	y1 = y - (this.r + 2000 * v + 2) * Math.cos(a);
	ctx.lineTo(x1, y1);

	ctx.stroke();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shadowHelm = function(x, y, a, color, leftPowerValue, rightPowerValue) {
	var x1, y1;

	ctx.lineWidth = 3;
	ctx.strokeStyle = color;

	// left
	ctx.beginPath();
	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

	x1 = x + (this.r + 20000 * leftPowerValue + 1.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y + (this.r + 20000 * leftPowerValue + 1.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();

	// right
	ctx.beginPath();
	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

	x1 = x - (this.r + 20000.0 * rightPowerValue + 1.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y - (this.r + 20000.0 * rightPowerValue + 1.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shadowDrag = function(x, y, a, color, dragPowerValue) {
	var x1, y1;

	ctx.lineWidth = 3;
	ctx.strokeStyle = color;

	// left
	ctx.beginPath();
	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a) + (2000 * dragPowerValue + 1.0) * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a) + (2000 * dragPowerValue + 1.0) * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();

	// right
	ctx.beginPath();
	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a);
	ctx.moveTo(x1, y1);        

	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a) + (2000 * dragPowerValue + 1.0) * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a) + (2000 * dragPowerValue + 1.0) * Math.cos(a);;
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shadow = function(x, y, a, v, color, leftPowerValue, rightPowerValue, dragPowerValue) {
	var x1, y1;
	
	ctx.beginPath();
	ctx.arc(x, y, 1.5 * this.r + 2.0, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	
	this.shadowTail(x, y, a, v, color);
	this.shadowHelm(x, y, a, color, leftPowerValue, rightPowerValue);
	this.shadowDrag(x, y, a, color, dragPowerValue);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shablonShield = function(x, y) {
	if (!this.tools.shield || !this.shieldPower) return;

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.arc(x, y, 1.5 * this.r - 1, 0, 2 * Math.PI);
	ctx.strokeStyle = "#6666DD";
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shablonTail = function(x, y, a) {
	var x1, y1, dv;
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#FFBBBB";
	ctx.beginPath();	

	x1 = x - this.r * Math.sin(a);
	y1 = y - this.r * Math.cos(a);
	ctx.moveTo(x1, y1);

        dv = 5 * Math.random();
	x1 = x - (this.r + 2000 * this.v - dv) * Math.sin(a);
	y1 = y - (this.r + 2000 * this.v - dv) * Math.cos(a);
	ctx.lineTo(x1, y1);

	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shablonHelm = function(x, y, a, leftPowerValue, rightPowerValue) {
	var x1, y1, dv;

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFBBBB";

	// left
	ctx.beginPath();
	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

	if (leftPowerValue > 0) dv = 4.0 * Math.random();
	else dv = 0;

	x1 = x + (this.r - 3.0 + dv + 20000 * leftPowerValue) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y + (this.r - 3.0 + dv + 20000 * leftPowerValue) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();

	// right
	ctx.beginPath();
	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

        if (rightPowerValue > 0) dv = 4.0 * Math.random();
        else dv = 0;

	x1 = x - (this.r - 3.0 + dv + 20000.0 * rightPowerValue) * Math.sin(a + Math.PI/2.0) + 6.0 * Math.sin(a);
	y1 = y - (this.r - 3.0 + dv + 20000.0 * rightPowerValue) * Math.cos(a + Math.PI/2.0) + 6.0 * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shablonDrag = function(x, y, a, dragPowerValue) {
	var x1, y1, dv;

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFBBBB";

	if (dragPowerValue > 0) dv = 4.0 * Math.random();
	else dv = 0;

	// left
	ctx.beginPath();
	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a);
	ctx.moveTo(x1, y1);

	x1 = x + (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a) + 2000 * dragPowerValue * Math.sin(a);
	y1 = y + (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a) + 2000 * dragPowerValue * Math.cos(a);
	ctx.lineTo(x1, y1);
	ctx.stroke();

	// right
	ctx.beginPath();
	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a);
	ctx.moveTo(x1, y1);        

	x1 = x - (this.r - 3.0) * Math.sin(a + Math.PI/2.0) + 12.0 * Math.sin(a) + 2000 * dragPowerValue * Math.sin(a);
	y1 = y - (this.r - 3.0) * Math.cos(a + Math.PI/2.0) + 12.0 * Math.cos(a) + 2000 * dragPowerValue * Math.cos(a);;
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.shablon = function(x, y, a, width, color, leftPowerValue, rightPowerValue, dragPowerValue) {
	var x1, y1;
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
       
	// body	
	ctx.beginPath();

	x1 = x + 1.5 * this.r * Math.sin(a);
	y1 = y + 1.5 * this.r * Math.cos(a);
	ctx.moveTo(x1, y1);		

	x1 = x + this.r * Math.sin(a + 2.0*Math.PI/3.0);
	y1 = y + this.r * Math.cos(a + 2.0*Math.PI/3.0);	
	ctx.lineTo(x1, y1);

	x1 = x + this.r * Math.sin(a + 4.0*Math.PI/3.0);
	y1 = y + this.r * Math.cos(a + 4.0*Math.PI/3.0);	
	ctx.lineTo(x1, y1);

	x1 = x + 1.5 * this.r * Math.sin(a);
	y1 = y + 1.5 * this.r * Math.cos(a);
	ctx.lineTo(x1, y1);

	ctx.stroke();

	this.shablonTail(x, y, a);
	this.shablonHelm(x, y, a, leftPowerValue, rightPowerValue);
	this.shablonDrag(x, y, a, dragPowerValue);
	this.shablonShield(x, y);
}	
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.show = function() {	
	var x = this.x - sceneX;
	var y =  this.y - sceneY;	
	
	this.shadow(this.oldX, this.oldY, this.oldA, this.oldV, '#000000', this.oldLeftPowerValue, this.oldRightPowerValue, this.oldDragPowerValue);
	this.shablon(x, y, this.a, 1, '#8888FF', this.leftPowerValue, this.rightPowerValue, this.dragPowerValue);
	this.oldX = x; this.oldY = y; this.oldA = this.a; this.oldV = this.v;
	this.oldLeftPowerValue = this.leftPowerValue; this.oldRightPowerValue = this.rightPowerValue; this.oldDragPowerValue = this.dragPowerValue;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.bang = function() {
	var dx, dy;	
	
        if (this.cooldownGun > 0) return;

	dx = this.dx + 15 * Math.sin(this.a);
	dy = this.dy + 15 * Math.cos(this.a);

	var plazma = new tPlazma();
	plazma.setParam({ x: this.x, 
			  y: this.y, 
                          dx: dx, 
                          dy: dy,
			  m: 10.0 });
	this.cooldownGun = this.maxCooldownGun;

	scene.add(plazma);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.startRocket = function() {
	var missile, x, y;

	if (this.cooldownGun > 0) return;

	x = this.x + 20 * Math.sin(this.a) + this.rokcetPoint * 8.0 * Math.sin(this.a + Math.PI/2.0);
	y = this.y + 20 * Math.cos(this.a) + this.rokcetPoint * 8.0 * Math.cos(this.a + Math.PI/2.0);
	params = { x: x, y: y, a: this.a, dx: this.dx, dy: this.dy };

	if (this.missileCounts[this.missileKind] > 0) {
		if (this.missileKind == 'heavyMissile')  missile = new tHeavyMissile(params);
		if (this.missileKind == 'smartMissile')  missile = new tSmartMissile(params);
		if (this.missileKind == 'plazmaMissile') missile = new tPlazmaMissile(params);
		if (this.missileKind == 'megaMissile')   missile = new tMegaMissile(params);	

		this.missileCounts[this.missileKind] -= 1;
	} else return;	

	this.cooldownGun = this.maxCooldownGun;
	this.rokcetPoint = -1 * this.rokcetPoint;

	scene.add(missile);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.hit = function(plazmaDx, plazmaDy) {
	var i, dx, dy;

	if (this.tools.shield && this.shieldPower) {
		this.hitShield(plazmaDx, plazmaDy);			
		return;
	}
	
	this.dx += 10.0 * plazmaDx/this.m;
	this.dy += 10.0 * plazmaDy/this.m;
		
	for (i = 0; i < this.r; i++) {
		if (this.score >= 5) {
			this.score -= 5;
		
			dx = Math.random() * 5.0 - 1.5 + plazmaDx / 5.0;
			dy = Math.random() * 5.0 - 1.5 + plazmaDy / 5.0;

			scene.add(new tMineral({ x: this.x, y: this.y, 
						dx: dx, dy: dy,
						t: 2.0,	
						lockT: 0.5,					
						score: 1, 
						color: "'#444488'" }));
		}		
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tShatl.prototype.hitShield  = function(plazmaDx, plazmaDy) {
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
