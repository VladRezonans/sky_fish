//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTouchIcon(params) {
	this.x = params['x'];
	this.y = params['y'];
	this.size = params['size'];
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchIcon.prototype.isTouch = function(x, y) {
	if ( x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size) return true;
	return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTouchBar(params) {
	this.x = params['x'];
	this.y = params['y'];
	this.dx = params['dx'];
	this.dy = params['dy'];
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchBar.prototype.isTouch = function(x, y) {
	if ( x >= this.x && x <= this.x + this.dx && y >= this.y && y <= this.y + this.dy) return true;
	return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tButton(params) {
	this.x = params['x'];
	this.y = params['y'];
	this.r = params['r'];
	this.hint = params['hint'];
	this.dx = params['dx'];
	this.dy = params['dy'];
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tButton.prototype.show = function(on) {
	ctx.strokeStyle = on ? "#005500" : "#000066";
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2.0 * Math.PI);
	ctx.stroke();

	if (this.hint) {
		ctx.font = "14px Arial";
		ctx.fillStyle = "#555599";
		ctx.fillText(this.hint, this.x + this.dx, this.y + this.dy);
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tButton.prototype.isTouch = function(x, y) {
	var dx = this.x - x;
	var dy = this.y - y;

	return dx * dx + dy * dy <= (this.r + 4) * (this.r + 4);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTouchPad(params) {
	this.x = params['x'];
	this.y = params['y'];
	this.r = params['r'];
	this.minR = 16;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchPad.prototype.show = function() {
	ctx.strokeStyle = "#000066";
	ctx.lineWidth = 2;

	var a = Math.PI/4.0;
	for (var i = 0; i < 4; i++) {
		ctx.beginPath();
		ctx.lineTo(this.x, this.y);
		ctx.arc(this.x, this.y, this.r, a, a + Math.PI/2.0);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();

		a += Math.PI/2.0;
	}

	var sectors = [shatl.rightPower , shatl.dragPower, shatl.leftPower, shatl.rocketPower];
	var press = false;

	for (var i = 0; i < 4; i++) {
		if (sectors[i]) {
		    a = Math.PI/4.0 - (i + 3) * Math.PI/2.0;
		    ctx.strokeStyle = "#005500";
		    ctx.beginPath();
		    ctx.lineTo(this.x, this.y);
		    ctx.arc(this.x, this.y, this.r, a, a + Math.PI/2.0);
		    ctx.lineTo(this.x, this.y);
		    ctx.stroke();
		    press = true;
		}
	}

	ctx.beginPath();
	ctx.strokeStyle = (press) ? "#005500" : "#000066";
	ctx.arc(this.x, this.y, this.minR - 1, 0, 2 * Math.PI);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.stroke();

	if (shatl.tools.drag) {
		ctx.fillStyle = "#555599";
		ctx.font = "14px Arial";
		ctx.fillText("D", this.x - 5, this.y + this.r/1.4);
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchPad.prototype.isTouch = function(x, y) {
	var dx = this.x - x;
	var dy = this.y - y;
	var ob = { x: x, y: y };
	var sector = 0;

	if (dx * dx + dy * dy > (this.r + 8) * (this.r + 8)) return 0;
	if (dx * dx + dy * dy < this.minR * this.minR) return 0;

	var angleTouch = angle(ob, this);
	var a = Math.PI / 4.0;
	for (var i = 0; i < 4; i++) {
		if (angleTouch >= a && angleTouch <= a + Math.PI/2.0) {
			sector = i + 1;
			break;
		}
		a += Math.PI/2.0;
	}

	if (sector == 0) sector = 4;
	return sector;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTouchTimer(params) {
	this.delay = params['delay'];
    this.time = 0;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchTimer.prototype.isDelay = function() {
	var time =  new Date().getTime();

	if (time > this.time + this.delay) {
        this.time = time;
		return false;
	}
	return true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function tTouchShift() {
	this.xStart = 0;
	this.yStart = 0;
	this.flag = false;
	this.inverse = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchShift.prototype.start = function(x, y) {
	if (!this.flag) {
		this.flag = true;
		this.xStart = x;
		this.yStart = y;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchShift.prototype.move = function(x, y) {
	var k = this.inverse ? -1 : 1;

	if (this.flag) {
		scene.mobileShiftX += k * (x - this.xStart);
		scene.mobileShiftY += k * (y - this.yStart);

		this.xStart = x;
		this.yStart = y;

		scene.shiftFrame();
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tTouchShift.prototype.end = function() {
	this.flag = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
