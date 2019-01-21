//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel = function() {
	this.X1 = 0;
	this.Y1 = 0;
	this.X2 = 0;
	this.Y2 = 0;
	this.dX = 0;
	this.dY = 0;
	this.oldScore = 0;

	this.textColor = "#444488";
	this.barColor = "#005500";

	this.oldTargets = [];
	this.tools = {};	
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
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.show = function() {
	if (!isEqualHash(this.tools, shatl.tools)) {		
		this.copyTools();
		this.hide();
		return;
	}

	this.body();	

	var x = this.X1 + 20, y = this.Y1 + 40;
	this.score(x, y); 
	y -= 20;

	ctx.font = "16px Arial";

	y += 50; this.speed(x, y);   
	y += 50; this.power(x, y);   
	y += 50; this.helm(x, y);
    
	if (shatl.tools.drag)     { y += 50; this.drag(x, y); }
	if (shatl.tools.cooldown) { y += 50; this.cooldown(x, y); } 
	if (shatl.tools.shield)   { y += 50; this.shield(x, y); } 

	y += 40; this.radar(x, y);
	y += 160;

	if (shatl.tools.cruise)    { y += 30; this.cruiseControl(x, y); }
	if (shatl.tools.stability) { y += 30; this.helmStabilization(x, y); }
	if (shatl.tools.targets)   { y += 30; this.targets(x, y); }

	y += 20;
	var i = -1, shift = [ {dx: - 5, dy: 0}, {dx: 85, dy: 0}, {dx: - 5, dy: 90}, {dx: 85, dy: 90} ];
	if (shatl.missileCounts.heavyMissile  >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'heavyMissile',  '1'); }
	if (shatl.missileCounts.smartMissile  >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'smartMissile',  '2'); }
	if (shatl.missileCounts.plazmaMissile >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'plazmaMissile', '3'); }
	if (shatl.missileCounts.megaMissile   >= 0)  { i++; this.rocketPanel(x + shift[i].dx, y + shift[i].dy, 'megaMissile',   '4'); }	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.hide = function() {	
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000000";
	ctx.rect(this.X1, this.Y1, this.dX, this.dY);	
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.body = function() {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(this.X1, this.Y1, this.dX, this.dY);	
	ctx.stroke();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.copyTools = function() {	
	for (var key in shatl.tools ) this.tools[key] = shatl.tools[key];	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.score = function(x, y) {
	var score = shatl.score;

	ctx.fillStyle = this.textColor;
	ctx.font = "16px Arial";
	ctx.fillText("Score", x, y);

	ctx.font = "18px Arial";
	ctx.fillStyle = "#000000";		
	ctx.fillText(this.oldScore, x + 60, y);

	ctx.fillStyle = "#6666BB";		
	ctx.fillText(score, x + 60, y);
	
	this.oldScore = score;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.speed = function(x, y) {
	var dx = 100 * Math.sqrt(shatl.dx * shatl.dx + shatl.dy * shatl.dy)/shatl.maxSpeed;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("Speed", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 160, 10);	
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 1.6 * dx, y + 10, 160 - 1.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.power = function(x, y) {
	var dx = 100.0 * shatl.v / shatl.maxPower;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("Power", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 160, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 1.6 * dx, y + 10, 160 - 1.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.helm = function(x, y) {
	var dx = 100.0 * shatl.leftPowerValue / shatl.maxHelmPower;

	// Left
	ctx.fillStyle = this.textColor;	
	ctx.fillText("L power", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 60, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 0.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 0.6 * dx, y + 10, 60 - 0.6 * dx, 10);
	ctx.fill();

	// Right
	dx = 100.0 * shatl.rightPowerValue / shatl.maxHelmPower;
	x = x + 100;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("R power", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 60, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 0.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 0.6 * dx, y + 10, 60 - 0.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.drag = function(x, y) {
	var dx = 100.0 * shatl.dragPowerValue / shatl.maxDragPower;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("Drag power", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 160, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 1.6 * dx, y + 10, 160 - 1.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.cooldown = function(x, y) {
	var dx = 100.0 * shatl.cooldownGun / shatl.maxCooldownGun;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("Gun (c) cooldown", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 160, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = "#666600";
	ctx.strokeStyle = "#666600";
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 1.6 * dx, y + 10, 160 - 1.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.shield = function(x, y) {
	var dx = 100.0 * shatl.shieldValue / shatl.maxShieldValue;

	ctx.fillStyle = this.textColor;	
	ctx.fillText("Shield (x)", x, y);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000066";
	ctx.rect(x, y + 10, 160, 10);	
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = shatl.shieldPower ? "#6666FF" : this.barColor;
	ctx.strokeStyle = this.barColor;
	ctx.rect(x, y + 10, 1.6 * dx, 10);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x + 1.6 * dx, y + 10, 160 - 1.6 * dx, 10);
	ctx.fill();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.cruiseControl = function(x, y) {
	ctx.fillStyle = this.textColor;	
	ctx.fillText(" - Cruise control (z)", x + 18, y);

	ctx.beginPath();
	ctx.strokeStyle = "#000066";
	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
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
	
	ctx.strokeStyle = "#000066";
	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
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
	
	ctx.strokeStyle = "#000066";
	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x + 8, y - 4, 8, 0, 2 * Math.PI);
	ctx.stroke();

	this.targetsHide();

	if (shatl.targetsShow) {
		ctx.beginPath();
		ctx.fillStyle = "#005500";
		ctx.arc(x + 8, y - 4, 5, 0, 2 * Math.PI);
		ctx.fill();				
		
		this.targetsShow();
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.targetsHide = function() {
	for (var i = 0; i < this.oldTargets.length; i++) this.oldTargets[i].hide();		 
	this.oldTargets = [];
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.targetsShow = function() {
	var goals = ['meteorite', 'reward'];
	var goal, target, r, color;

	for (var i = 0; i < scene.elements.length; i++) {
		if (scene.elements[i].status == 'norm' && goals.includes(scene.elements[i].type)) {			
			goal = scene.elements[i];

			r = radius(goal, shatl);

			if (r < 20000 && ( goal.x < sceneX || goal.x > sceneX + scene.dX || goal.y < sceneY || goal.y > sceneY + scene.dY )) {				
				target = new tTarget({ goal: goal });
				target.show();
				this.oldTargets.push(target);
			}			
		}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.radar = function(x, y) {			
	ctx.beginPath();
	ctx.strokeStyle = "#000066";
	ctx.arc(x + 80, y + 80, 80, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "#8888FF";
	ctx.arc(x + 80, y + 80, 1, 0, 2 * Math.PI);
	ctx.stroke();

	// Meteorites
	this.showMeteorites(x + 80,  y + 80);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.showMeteorites = function(x, y) {	
	var centerX = sceneX + scene.dX/2.0;
	var centerY = sceneY + scene.dY/2.0;
	var dx, dy;

	for (var i = 0; i < scene.elements.length; i++) {
		if (scene.elements[i].status == 'norm' && scene.elements[i].type == 'meteorite') {			
			dx = 80 * (scene.elements[i].x - centerX)/100000.0;
			dy = 80 * (scene.elements[i].y - centerY)/100000.0;			
			
			if (Math.sqrt(dx * dx + dy * dy) < 78) {
				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				ctx.arc(x + dx, y + dy, 2, 0, 2 * Math.PI);
				ctx.stroke();
			}	

			if (Math.sqrt(dx * dx + dy * dy) < 76) {
				ctx.strokeStyle = "#88FF88";
				ctx.beginPath();
				ctx.arc(x + dx, y + dy, 1, 0, 2 * Math.PI);
				ctx.stroke();								
			}				
		}
        }	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
tPanel.prototype.rocketPanel = function(x, y, key, hint) {
	var count = shatl.missileCounts[key];
	var color, r = 10;

	// Hide
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000066";	
	ctx.rect(x - 1, y - 1, 82, 82);
	ctx.fill();

	// Show
	ctx.font = "14px Arial";	
	ctx.fillStyle = "#007700";
	ctx.fillText(hint, x + 64, y + 16);
	ctx.fillStyle = this.textColor;
	ctx.fillText(count, x + 8, y + 70);
	ctx.fillText("(v)", x + 56, y + 70);
	
	color = (shatl.missileKind == key && count > 0) ? "#004400" : "#000066";
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;

	ctx.moveTo(x + r, y);
	ctx.lineTo(x + 80 - r, y);         // 1
	
	ctx.moveTo(x + 80, y + r);
	ctx.lineTo(x + 80, y + 80 - r);    // 2

	ctx.moveTo(x + 80 - r, y + 80);
	ctx.lineTo(x + r, y + 80);         // 3

	ctx.moveTo(x, y + 80 - r);	    	
	ctx.lineTo(x, y + r);              // 4

	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + 80 - r, y + r, r, 3.0 * Math.PI/2.0, 2.0 * Math.PI); // 1 - 2
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + 80 - r, y + 80 - r, r, 0, Math.PI/2.0);  // 2 - 3
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + r, y + 80 - r, r, Math.PI/2.0, Math.PI); // 3 - 4
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + r, y + r, r, Math.PI, 3.0 * Math.PI/2.0); // 4 - 1
	ctx.stroke();

	// Missile Icon
	this.icons[key].setParam({ x: x + 40, y: y + 36 });
	this.icons[key].engine();
	this.icons[key].show();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
