//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel = function() {
	this.X1 = 0;
	this.Y1 = 0;
	this.X2 = 0;
	this.Y2 = 0;
	this.dX = 0;
	this.dY = 0;

	this.textColor = "#555599";
	this.barColor = "#005500";
	this.lineColor = "#000066";

	this.tools = {};
	this.maxGunKind = 0;
	this.fullScreen = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.build = function() {
	this.X1 = canvas.width - 200;
	this.Y1 = 0;
	this.X2 = canvas.width;
	this.Y2 = canvas.height;
	this.dX = this.X2 - this.X1;
	this.dY = this.Y2 - this.Y1;
	this.icons = { heavyMissile: new tHeavyMissileIcon(), smartMissile: new tSmartMissileIcon(), plazmaMissile: new tPlazmaMissileIcon(),  megaMissile: new tMegaMissileIcon() };

	// this.cruiseButton =  new tButton({ x: 54,  y: scene.Y2 - 250, r: 44, hint: 'Cruise', dx: - 19, dy: 5 });
	this.shieldButton =  new tButton({ x: 54,  y: scene.Y2 - 152, r: 44, hint: 'Shield', dx: - 19, dy: 5 });
	this.gunButton =     new tButton({ x: 54,  y: scene.Y2 - 54,  r: 44, hint: 'Gun', dx: - 13, dy: 5 });
	this.missileButton = new tButton({ x: 152, y: scene.Y2 - 54,  r: 44, hint: 'Missile', dx: - 20, dy: 5 });
	this.touchPad =      new tTouchPad({ x: scene.X2 - 86, y: scene.Y2 - 86, r: 76});
	this.inverseButton = new tButton({ x: scene.X2 - 195, y: 26,  r: 16, hint: 'i', dx: -1, dy: 5 });
	this.fullScreenButton = new tButton({ x: scene.X2 - 260, y: 26,  r: 16, hint: 'f', dx: -2, dy: 5 });

	this.touchIcons = {};
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.show = function() {
	(this.dY < 670) ? this.small() : this.classic();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.small = function() {
	var x, y;

	if (isMobile) {
		this.showTouchButtons();
		this.touchPad.show();
	}

	x = scene.dX/2.0 - 32; y = 30;
	this.score(x, y);

	ctx.font = "16px Arial";

	x = 20; y =- 20;
	if (shatl.tools.cooldown) { y += 50; this.cooldown(x, y); }
	if (shatl.tools.shield)   { y += 50; this.shield(x, y);   }
	if (shatl.maxGunKind > 0) { y += 50; this.gunPanel(x, y); }

	x = scene.X2 - 162; y = 10;
	this.radar(x, y, 76);

	if (shatl.targetsShow) this.targetsShow();

	y = scene.Y2 - 82;
	x = isMobile ? scene.X2/2.0 - 224 : scene.X2/2.0 - 246;
	if (shatl.missileCounts.heavyMissile  >= 0)  { x += 82; this.rocketPanel(x, y, 'heavyMissile',  '1', 72); }
	if (shatl.missileCounts.smartMissile  >= 0)  { x += 82; this.rocketPanel(x, y, 'smartMissile',  '2', 72); }
	if (shatl.missileCounts.plazmaMissile >= 0)  { x += 82; this.rocketPanel(x, y, 'plazmaMissile', '3', 72); }
	if (shatl.missileCounts.megaMissile   >= 0)  { x += 82; this.rocketPanel(x, y, 'megaMissile',   '4', 72); }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.classic = function() {
	var x = this.X1 + 20, y = this.Y1 + 40;
	if (this.dY < 670) y -= 10;

	this.body();		
	this.score(x, y); 
	y -= 20;

	ctx.font = "16px Arial";

	if (this.dY >= 720) { y += 50; this.speed(x, y); }

	if (this.dY >= 870) {
		y += 50; this.power(x, y);
		y += 50; this.helm(x, y);
		if (shatl.tools.drag)     { y += 50; this.drag(x, y); }
	}

	if (shatl.tools.cooldown) { y += 50; this.cooldown(x, y); } 
	if (shatl.tools.shield)   { y += 50; this.shield(x, y); } 

	y += 40; this.radar(x, y, 80);
	y += 160;

	if (shatl.tools.cruise)    { y += 30; this.cruiseControl(x, y); }
	if (shatl.tools.stability) { y += 30; this.helmStabilization(x, y); }
	if (shatl.tools.targets)   { y += 30; this.targets(x, y); }
	if (shatl.tools.shift)     { y += 30; this.shift(x, y); }
	if (shatl.targetsShow) this.targetsShow();

	if (shatl.maxGunKind > 0)  { y += 40; this.gunPanel(x, y); y += 20; }

	y += 20;
	var i = -1, shift = [ {dx: - 5, dy: 0}, {dx: 85, dy: 0}, {dx: - 5, dy: 90}, {dx: 85, dy: 90} ];
	if (shatl.missileCounts.heavyMissile  >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'heavyMissile',  '1', 80); }
	if (shatl.missileCounts.smartMissile  >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'smartMissile',  '2', 80); }
	if (shatl.missileCounts.plazmaMissile >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'plazmaMissile', '3', 80); }
	if (shatl.missileCounts.megaMissile   >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'megaMissile',   '4', 80); }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.body = function() {
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.lineColor;
	ctx.rect(this.X1, this.Y1, this.dX, this.dY);	
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.score = function(x, y) {	
	ctx.fillStyle = this.textColor;
	ctx.font = isMobile ? "18px Arial" : "16px Arial";
	ctx.fillText("Score", x, y);

	ctx.font = isMobile ? "20px Arial" : "18px Arial";
	ctx.fillStyle = "#6666BB";		
	ctx.fillText(shatl.score, x + 60, y);		
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.speed = function(x, y) {
	var dx = 100 * Math.sqrt(shatl.dx * shatl.dx + shatl.dy * shatl.dy)/shatl.maxSpeed;
	if (dx > 100) dx = 100;

	ctx.fillStyle = this.textColor;
	ctx.fillText("Speed", x, y);
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x - 1, y + 10, 161, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.power = function(x, y) {
	var dx = 100.0 * shatl.v / shatl.maxPower;

	ctx.fillStyle = this.textColor;
	ctx.fillText("Power", x, y);
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 160, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.helm = function(x, y) {
	var dx = 100.0 * shatl.leftPowerValue / shatl.maxHelmPower;

	ctx.lineWidth = 2;

	// Left
	ctx.fillStyle = this.textColor;
	ctx.fillText("L power", x, y);

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.rect(x, y + 10, 0.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 60, 10);
	ctx.stroke();

	// Right
	dx = 100.0 * shatl.rightPowerValue / shatl.maxHelmPower;
	x = x + 100;

	ctx.fillStyle = this.textColor;
	ctx.fillText("R power", x, y);

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.rect(x, y + 10, 0.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 60, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.drag = function(x, y) {
	var dx = 100.0 * shatl.dragPowerValue / shatl.maxDragPower;

	ctx.fillStyle = this.textColor;
	ctx.fillText("Drag power", x, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 160, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.cooldown = function(x, y) {
	var dx = 100.0 * shatl.cooldownGun / shatl.maxCooldownGun;

	ctx.fillStyle = this.textColor;
	ctx.fillText("Gun (c) cooldown", x, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.fillStyle = "#666600";
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 160, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.shield = function(x, y) {
	var dx = 100.0 * shatl.shieldValue / shatl.maxShieldValue;

	ctx.fillStyle = this.textColor;
	ctx.fillText("Shield (x)", x, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.fillStyle = shatl.shieldPower ? "#5555cc" : this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.rect(x, y + 10, 160, 10);
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.cruiseControl = function(x, y) {
	ctx.fillStyle = this.textColor;
	ctx.fillText(" - Cruise control (z)", x + 18, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.stroke();

	if (shatl.cruiseControl) {
		ctx.beginPath();
		ctx.fillStyle = "#005500";
		ctx.arc(x + 8, y - 4, 5, 0, 2 * Math.PI);
		ctx.fill();
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.helmStabilization = function(x, y) {
	ctx.fillStyle = this.textColor;
	ctx.fillText(" - Stabilization (s)", x + 18, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.stroke();

	if (shatl.helmStabilization) {
		ctx.beginPath();
		ctx.fillStyle = "#005500";
		ctx.arc(x + 8, y - 4, 5, 0, 2 * Math.PI);
		ctx.fill();
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.targets = function(x, y) {
	ctx.fillStyle = this.textColor;
	ctx.fillText(" - Show targets (a)", x + 18, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.stroke();

	if (shatl.targetsShow) {
		ctx.beginPath();
		ctx.fillStyle = "#005500";
		ctx.arc(x + 8, y - 4, 5, 0, 2 * Math.PI);
		ctx.fill();
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.shift = function(x, y) {
	ctx.fillStyle = this.textColor;
	ctx.fillText(" - Shift (+ arrows)", x + 18, y);

	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.stroke();

	if (shatl.shiftFlag) {
		ctx.beginPath();
		ctx.fillStyle = "#005500";
		ctx.arc(x + 8, y - 4, 5, 0, 2 * Math.PI);
		ctx.fill();
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.targetsShow = function() {
	var goals = ['asteroid', 'reward'];
	var ob, target, r, color;

	for (var i = 0; i < scene.elements.physical.length; i++) {
		ob = scene.elements.physical[i];

		if (ob.status == 'norm' && isArrayIncludes(goals, ob.type)) {
			r = radius(ob, shatl);

			if (r < 20000 && ( ob.x < sceneX || ob.x > sceneX + scene.dX || ob.y < sceneY || ob.y > sceneY + scene.dY )) {
				target = new tTarget({ goal: ob });
				target.show();
			}
		}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.radar = function(x, y, r) {
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.strokeStyle = this.lineColor;
	ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = "#8888FF";
	ctx.arc(x + r, y + r, 1, 0, 2 * Math.PI);
	ctx.stroke();

	// Asteroids
	this.showAsteroids(x + r,  y + r, r);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.showAsteroids = function(x, y, r) {
	var centerX = sceneX + scene.dX/2.0;
	var centerY = sceneY + scene.dY/2.0;
	var ob, dx, dy;

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#88FF88";

	for (var i = 0; i < scene.elements.physical.length; i++) {
		ob = scene.elements.physical[i];

		if (ob.status == 'norm' && ob.type == 'asteroid') {
			dx = r * (ob.x - centerX)/100000.0;
			dy = r * (ob.y - centerY)/100000.0;

			if (Math.sqrt(dx * dx + dy * dy) < r - 4) {
				ctx.beginPath();
				ctx.arc(x + dx, y + dy, 1, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.gunPanel = function(x, y) {
	ctx.fillStyle = this.textColor;
	ctx.fillText("Gun power (g)", x, y);

	ctx.lineWidth = 2;
	ctx.fillStyle = this.barColor;

	for(var i = 0; i < 4; i++) {
		ctx.beginPath();
		ctx.strokeStyle = (i < shatl.maxGunKind) ? this.barColor : this.lineColor;
		ctx.rect(x, y + 10, 30, 10);
		ctx.stroke();

		if (i < shatl.gunKind) ctx.fill();
		x += 40;
	}

    if (isMobile) this.touchGunBar = new tTouchBar({ x: x - 160, y: y - 10, dx: 160, dy: 35 });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.rocketPanel = function(x, y, key, hint, size) {
	var count = shatl.missileCounts[key];
	var color, r = size/8.0;

	ctx.font = "14px Arial";
	ctx.fillStyle = "#007700";
	ctx.fillText(hint, x + size * 0.8, y + size * 0.2 + 1.0);
	ctx.fillStyle = this.textColor;
	ctx.fillText(count, x + size * 0.1, y + size * 0.875);
	ctx.fillText("(v)", x + size * 0.7, y + size * 0.875);

	color = (shatl.missileKind == key && count > 0) ? "#004400" : "#000066";

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;

	ctx.moveTo(x + r, y);
	ctx.lineTo(x + size - r, y);         // 1

	ctx.moveTo(x + size, y + r);
	ctx.lineTo(x + size, y + size - r);    // 2

	ctx.moveTo(x + size - r, y + size);
	ctx.lineTo(x + r, y + size);         // 3

	ctx.moveTo(x, y + size - r);
	ctx.lineTo(x, y + r);              // 4

	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + size - r, y + r, r, 3.0 * Math.PI/2.0, 2.0 * Math.PI); // 1 - 2
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + size - r, y + size - r, r, 0, Math.PI/2.0);  // 2 - 3
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + r, y + size - r, r, Math.PI/2.0, Math.PI); // 3 - 4
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + r, y + r, r, Math.PI, 3.0 * Math.PI/2.0); // 4 - 1
	ctx.stroke();

	// Missile Icon
	this.icons[key].setParam({ x: x + size/2.0, y: y + size/2.0 - 4 });
	this.icons[key].engine();
	this.icons[key].show();

	if (isMobile) this.touchIcons[key] = new tTouchIcon({ x: x, y: y, size: size });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.touchStart = function(x, y) {
	var touch = false;
	if (!isMobile) return;

	x = x - 10; y = y - 10;

	// buttons
	// if (this.cruiseButton.isTouch(x, y))  { shatl.cruiseControlSwitch(); touch = true; }
	if (this.shieldButton.isTouch(x, y))  { shatl.shieldOn();    	     touch = true; }
	if (this.gunButton.isTouch(x, y))     { shatl.bang();        	     touch = true; }
	if (this.missileButton.isTouch(x, y)) { shatl.startRocket(); 	     touch = true; }
	if (this.inverseButton.isTouch(x, y)) { touchShift.inverse = !touchShift.inverse;  touch = true; }
	if (this.fullScreenButton.isTouch(x, y)) { this.toggleFullScreen();  touch = true; }

	// touch pad
	var code = this.touchPad.isTouch(x, y);
	switch(code) {
		case 1: shatl.rightOn();  touch = true; break;
		case 2: shatl.dragOn();   touch = true; break;
		case 3: shatl.leftOn();   touch = true; break;
		case 4: shatl.turnOn();   touch = true; break;
	}

	// icons
	if (this.touchIcons['heavyMissile']  && this.touchIcons['heavyMissile'].isTouch(x, y))  { shatl.switchMissile('heavyMissile');  touch = true; }
	if (this.touchIcons['smartMissile']  && this.touchIcons['smartMissile'].isTouch(x, y))  { shatl.switchMissile('smartMissile');  touch = true; }
	if (this.touchIcons['plazmaMissile'] && this.touchIcons['plazmaMissile'].isTouch(x, y)) { shatl.switchMissile('plazmaMissile'); touch = true; }
	if (this.touchIcons['megaMissile']   && this.touchIcons['megaMissile'].isTouch(x, y))   { shatl.switchMissile('megaMissile');   touch = true; }

	// gun bar
    if (this.touchGunBar && this.touchGunBar.isTouch(x, y)) {
		shatl.switchGun();
        touch = true;
    }

	return touch;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.touchEnd = function(x, y) {
	var touch = false;
	if (!isMobile) return;

	x = x - 10; y = y - 10;

	// buttons
	// if (this.cruiseButton.isTouch(x, y))  { touch = true; }
	if (this.shieldButton.isTouch(x, y))  { shatl.shieldOff(); touch = true; }
	if (this.gunButton.isTouch(x, y))     { touch = true; }
	if (this.missileButton.isTouch(x, y)) { touch = true; }

	// icons
	if (this.touchIcons['heavyMissile']  && this.touchIcons['heavyMissile'].isTouch(x, y))  { touch = true; }
	if (this.touchIcons['smartMissile']  && this.touchIcons['smartMissile'].isTouch(x, y))  { touch = true; }
	if (this.touchIcons['plazmaMissile'] && this.touchIcons['plazmaMissile'].isTouch(x, y)) { touch = true; }
	if (this.touchIcons['megaMissile']   && this.touchIcons['megaMissile'].isTouch(x, y))   { touch = true; }

	// gun bar
	if (this.touchGunBar && this.touchGunBar.isTouch(x, y)) { touch = true; }

	// touch pad
	var code = this.touchPad.isTouch(x, y);
	switch(code) {
		case 1: shatl.rightOff(); touch = true; break;
		case 2: shatl.dragOff();  touch = true; break;
		case 3: shatl.leftOff();  touch = true; break;
		case 4: shatl.turnOff();  touch = true; break;
	}

	/* if (!touch) {
	        shatl.rightOff();
	        shatl.dragOff();
	        shatl.leftOff();
	        shatl.turnOff();
	} */
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.showTouchButtons = function(x, y) {
	// cruise
	// if (shatl.tools.cruise) this.cruiseButton.show(shatl.cruiseControl);

	// shield
	if (shatl.tools.shield) this.shieldButton.show(shatl.shieldPower);

	// gun button
	this.gunButton.show();

	// missile button
	if (Object.keys(shatl.missileCounts).length > 0) this.missileButton.show();

	// space shift inverse button
	this.inverseButton.show(touchShift.inverse);

	// full screen button
	this.fullScreenButton.show(this.fullScreen);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.toggleFullScreen = function() {
	if (!this.fullScreen) {
	var el = document.documentElement;

	if (el.requestFullscreen)		{ el.requestFullscreen(); }
        else if (el.mozRequestFullScreen) 	{ el.mozRequestFullScreen(); }
        else if (el.webkitRequestFullscreen) 	{ el.webkitRequestFullscreen(); }
	else if (el.msRequestFullscreen)	{ el.msRequestFullscreen(); }

        this.fullScreen = true;
	} else {
		var doc = window.document;
		var cancel = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if (cancel) cancel.call(doc);

		initCanvas();
		this.fullScreen = false;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
