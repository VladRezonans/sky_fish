//-------------------------------------------------------------------------------------------------------
function start() {
	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;
	window.onresize = onResize;

	shatl = new tShatl();
	scene = new tScene();	
	panel = new tPanel();		

	initCanvas();
	setTimeout(gameTimer, 1);
}
//-----------------------------------------------------------------------------------------------------------
function initCanvas() {	
	canvas = document.getElementById('canvas');	
	canvas.width = document.getElementById('screen').clientWidth;
	canvas.height = document.getElementById('screen').clientHeight;	
	ctx = canvas.getContext('2d');

	scene.build();
	panel.build();
}
//----------------------------------------------------------------------------------------------------------	
function onResize(evt) {
	initCanvas();
}
//----------------------------------------------------------------------------------------------------------	
function onKeyDown(evt) {
	evt = (evt) ? evt : window.event; 
	
	if(evt) {
		var elm = (evt.target) ? evt.target : evt.srcElement;
		if(elm) {
			var code = (evt.charCode)? evt.charCode : evt.keyCode;

			switch(code) { 					
				case 37: shatl.rightOn();  break;
				case 38: shatl.turnOn();   break;						 					
				case 39: shatl.leftOn();   break;
				case 40: shatl.dragOn();   break;
				case 88: shatl.shieldOn(); break;
				
				case 65: shatl.targetsSwitch();           break;
				case 67: shatl.bang(); 			  break;
				case 83: shatl.helmStabilizationSwitch(); break;
				case 86: shatl.startRocket();             break;
				case 90: shatl.cruiseControlSwitch();     break;

				case 49: shatl.switchMissile('heavyMissile');  break;
				case 50: shatl.switchMissile('smartMissile');  break;
				case 51: shatl.switchMissile('plazmaMissile'); break;
				case 52: shatl.switchMissile('megaMissile');   break;
			}
		}         
	} 	
}
//----------------------------------------------------------------------------------------------------------
function onKeyUp(evt) {
	evt = (evt) ? evt : window.event; 
	
	if(evt) {
		var elm = (evt.target) ? evt.target : evt.srcElement;
		if(elm) {
			var code = (evt.charCode)? evt.charCode : evt.keyCode;

			switch(code) { 					
				case 37: shatl.rightOff();  break;				
				case 38: shatl.turnOff();   break;
				case 39: shatl.leftOff();   break;
				case 40: shatl.dragOff();   break;
				case 88: shatl.shieldOff(); break;				
			}
		}         
	}
}
//----------------------------------------------------------------------------------------------------------	
function gameTimer() {	
	scene.show();
	panel.show();	
	setTimeout(gameTimer, 1); 
}
//----------------------------------------------------------------------------------------------------------	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
