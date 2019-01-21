//---------------------------------------------------------------------------------------------------------------------------------------------------
extend(tMegaMissile, tSmartMissile);
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tMegaMissile(params) {
	this.type = 'megaMissile';
	this.status = 'norm';
	this.r = 12;
	this.color = '#226622';
	
	this.oldX = 600.0;
	this.oldY = 600.0;
	this.x = this.oldX;
	this.y = this.oldY;
	this.dx = 0.0;
	this.dy = 0.0;

	this.oldA = 0.0;
	this.a = Math.PI;
	this.da = 0.008;

	this.v = 0.0;
	this.dv = 0.01;
	this.maxSpeed = 16.0;
	this.maxPower = 0.08;

	this.t = 5;
	this.lockT = 0.3;
	this.damageR = 240.0;
	this.sensitiveR = 60;
	this.targetR = 2000;
	this.might = 10;

	this.goals = ['meteorite', 'angel', 'arhAngel', 'principat', 'potestat', 'reward']; 
	
	this.setParam(params);	
}
//----------------------------------------------------------------------------------------------------------------------------------------------------
tMegaMissile.prototype.shablon = function(x, y, a) {
	var x1, y1, x2, y2, xs, ys, xb, yb;
	var dr = this.r/4.0;
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.color;
       
	ctx.beginPath();	
	
	x1 = x + (this.r - dr) * Math.sin(a);
	y1 = y + (this.r - dr) * Math.cos(a);	

	// head
	ctx.arc(x1, y1, dr, -a, -a + Math.PI);

	// top				
	xs = x1 + dr * Math.sin(a + Math.PI/2.0);
	ys = y1 + dr * Math.cos(a + Math.PI/2.0);	

	x2 = x1 + dr * Math.sin(a - Math.PI/2.0);
	y2 = y1 + dr * Math.cos(a - Math.PI/2.0);
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

        // body
	xb = x - 0.4 * dr * Math.sin(a);
	yb = y - 0.4 * dr * Math.cos(a);
	
	ctx.beginPath();
	ctx.fillStyle = '#000000';
        ctx.arc(xb, yb, this.r/2, 0, 2.0* Math.PI);	
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#000000';	
        ctx.arc(xb, yb, this.r/2, -a - 0.62 * Math.PI, -a - 0.38 * Math.PI);	
	//ctx.fill();
	ctx.stroke();	
	
	ctx.beginPath();
	ctx.arc(xb, yb, this.r/2, -a + 0.38 * Math.PI, -a + 0.62 * Math.PI);
	//ctx.fill();
	ctx.stroke();
		
	
	// tail
	this.shablonTail(x, y, a)
}
//----------------------------------------------------------------------------------------------------------------------------------------------------