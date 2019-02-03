//-------------------------------------------------------------------------------------------------------
function start() {
	isMobile = detectMobile();

	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;
	document.ontouchstart = onTouchStart;
	document.ontouchend = onTouchEnd;
	document.ontouchmove = onTouchMove;
	document.onmousedown = onMouseDown;

	window.onresize = onResize;

	shatl = new tShatl();
	scene = new tScene();	
	panel = new tPanel();
	timer = new tTouchTimer({ delay: 200 });
	touchShift = new tTouchShift();

	initCanvas();
	setTimeout(gameTimer, 1);
}
//-----------------------------------------------------------------------------------------------------------
function initCanvas() {
	screen = document.getElementById('screen');
	canvas = document.getElementById('canvas');
	canvas.width = screen.clientWidth;
	canvas.height = screen.clientHeight;
	ctx = canvas.getContext('2d');

	scene.build();
	panel.build();

    scene.showHelpInfo('*');
}
//----------------------------------------------------------------------------------------------------------	
function onResize(evt) {
	initCanvas();
}
//----------------------------------------------------------------------------------------------------------	
function onKeyDown(evt) {
	var evt = (evt) ? evt : window.event;
	
	if (evt) {
		var elm = (evt.target) ? evt.target : evt.srcElement;
		if (elm) {
			var code = (evt.charCode)? evt.charCode : evt.keyCode;

			switch(code) { 					
				case 37: shatl.rightOn();  break;
				case 38: shatl.turnOn();   break;						 					
				case 39: shatl.leftOn();   break;
				case 40: shatl.dragOn();   break;
				case 88: shatl.shieldOn(); break;
				
				case 65: shatl.targetsSwitch();           break;
				case 67: shatl.bang(); 			  break;
				case 71: shatl.switchGun(); 		  break;
				case 83: shatl.helmStabilizationSwitch(); break;
				case 86: shatl.startRocket();             break;
				case 90: shatl.cruiseControlSwitch();     break;

				case 49: shatl.switchMissile('heavyMissile');  break;
				case 50: shatl.switchMissile('smartMissile');  break;
				case 51: shatl.switchMissile('plazmaMissile'); break;
				case 52: shatl.switchMissile('megaMissile');   break;

				case 19: scene.switchPause(); break;
				case 27: scene.switchPause(); break;

				case 16: shatl.shiftFlag = true; break;
			}
		}
	}
}
//----------------------------------------------------------------------------------------------------------
function onKeyUp(evt) {
	var evt = (evt) ? evt : window.event;
	
	if (evt) {
		var elm = (evt.target) ? evt.target : evt.srcElement;
		if(elm) {
			var code = (evt.charCode)? evt.charCode : evt.keyCode;

			switch(code) { 					
				case 37: shatl.rightOff();  break;
				case 38: shatl.turnOff();   break;
				case 39: shatl.leftOff();   break;
				case 40: shatl.dragOff();   break;
				case 88: shatl.shieldOff(); break;

				case 16: shatl.shiftFlag = false; break;
			}
		}
	}
}
//----------------------------------------------------------------------------------------------------------
function onMouseDown(evt) {
	//panel.touchStart(evt.clientX, evt.clientY);
}
//----------------------------------------------------------------------------------------------------------	
function onTouchStart(evt) {
	//if (timer.isDelay()) return true;

	var touches = evt.changedTouches;
	var touch = panel.touchStart(touches[0].pageX, touches[0].pageY);

	if (!touch) touchShift.start(touches[0].pageX, touches[0].pageY);

	evt.preventDefault();
	evt.stopPropagation();
}
//----------------------------------------------------------------------------------------------------------
function onTouchMove(evt) {
	var touches = evt.changedTouches;
	touchShift.move(touches[0].pageX, touches[0].pageY);

    evt.preventDefault();
    evt.stopPropagation();
}
//----------------------------------------------------------------------------------------------------------
function onTouchEnd(evt) {
	var touches = evt.changedTouches;
	panel.touchEnd(touches[0].pageX, touches[0].pageY);
	touchShift.end();

	evt.preventDefault();
	evt.stopPropagation();
}
//----------------------------------------------------------------------------------------------------------
function gameTimer() {	
	scene.render();	
	setTimeout(gameTimer, 1); 
}
//----------------------------------------------------------------------------------------------------------	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
