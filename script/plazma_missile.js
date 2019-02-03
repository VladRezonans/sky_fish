//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tPlazmaMissile, tHeavyMissile);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tPlazmaMissile(params) {
	this.type = 'plazmaMissile';
	this.status = 'norm';
	this.group = 'missiles';
	this.r = 10;
	this.color = '#226622';

	this.x = 600;
	this.y = 600;
	this.dx = 0.0;
	this.dy = 0.0;

	this.a = Math.PI;	

	this.v = 0.0;
	this.dv = 0.01;
	this.maxSpeed = 18.0;
	this.maxPower = 0.08;

	this.t = 5;
	this.lockT = 0.5;
	this.damageR = 80.0;
	this.sensitiveR = 60;
	this.might = 5;

	this.goals = GOALS;
	
	this.setParam(params);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissile.prototype.shablon = function(x, y, a) {
	var x1, y1, x2, y2, xs, ys;
	var dr = this.r/4.0, hr = 1.6 *dr;
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.color;
       
	ctx.beginPath();		

	// head
	x1 = x + (this.r - hr) * Math.sin(a);
	y1 = y + (this.r - hr) * Math.cos(a);
	ctx.arc(x1, y1, hr, -a - 0.3 * Math.PI, -a + 1.3 * Math.PI);		

	// top						
	xs = x1 + dr * Math.sin(a + Math.PI/2.0) - 0.8 * hr * Math.sin(a);
	ys = y1 + dr * Math.cos(a + Math.PI/2.0) - 0.8 * hr * Math.cos(a);	

	x2 = x1 + dr * Math.sin(a - Math.PI/2.0) - 0.8 * hr * Math.sin(a);
	y2 = y1 + dr * Math.cos(a - Math.PI/2.0) - 0.8 * hr * Math.cos(a);
	ctx.moveTo(x2, y2);

        // bottom
	x1 = x - this.r * Math.sin(a);
	y1 = y - this.r * Math.cos(a);
			
	x2 = x1 - dr * Math.sin(a + Math.PI/2.0);
	y2 = y1 - dr * Math.cos(a + Math.PI/2.0);
	ctx.lineTo(x2, y2);

	x2 = x1 + dr * Math.sin(a + Math.PI/2.0);
	y2 = y1 + dr * Math.cos(a + Math.PI/2.0);

	ctx.lineTo(x2, y2);
	ctx.lineTo(xs, ys);

	ctx.stroke();

	// tail
	this.shablonTail(x, y, a)
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tPlazmaMissile.prototype.bang = function() {
	var dx, dy;

	for(var i = 0; i < 80; i++) {
		dx = Math.random() * 16.0 - 8.0 + this.dx;
		dy = Math.random() * 16.0 - 8.0 + this.dy;

		scene.add(new tPlazma({ x: this.x, y: this.y, dx: dx, dy: dy, m: 5.0 }));
	}

	scene.add(new tBang({ x: this.x, y: this.y, maxR: this.damageR, might: this.might }));
	this.destroy();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------