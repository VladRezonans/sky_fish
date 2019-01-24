//---------------------------------------------------------------------------------------------------------------------------------------------------
var IDENTIF = 100000;
//---------------------------------------------------------------------------------------------------------------------------------------------------
var MINERAL_COUNT = 0;
var MINERAL_MAX = 1000;		
//---------------------------------------------------------------------------------------------------------------------------------------------------
function getId() {
	return ++IDENTIF;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function extend(Child, Parent)  {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function radius(first, second) {
	var dx = second.x - first.x;
	var dy = second.y - first.y;
	return Math.sqrt(dx * dx + dy * dy);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function angle(first, second) {
	var dx = second.x - first.x;
	var dy = second.y - first.y;
	var r = radius(first, second);
	var a;
	
	if (r == 0) return 0;
	if (dy == 0) {
		if ( dx >= 0) return Math.PI/2.0;
		if ( dx < 0) return  3.0 * Math.PI/2.0;
	};

	if ( dx >= 0) {
		a = Math.asin(-dy/r);
		a += Math.PI/2.0;
	}		 
	if ( dx < 0) {
		a = Math.asin(dy/r);
		a -= Math.PI/2.0;
	}
	if (a > 2.0 * Math.PI) a = a - 2.0 * Math.PI;
	if (a < 0) a = a + 2.0 * Math.PI;
	
	return a;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function isContainsHash(a, b) {
	for (var key in a) {		
		if (b[key] != a[key]) return false;
	}
	return true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function isEqualHash(a, b) {
	return isContainsHash(a, b) && isContainsHash(b, a);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function isEqualArray(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function copyArrays(b) {
	var a = [];
	for (var i = 0; i < b.length; i ++) a[i] = b[i];
	return a;	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function diffArray(a, b) {
	var check, c = [];

	for (var i = 0; i < a.length; i++) {		
		diff = true;

		for (var j = 0; j < b.length; j++) {
			if (a[i] == b[j]) {
				diff = false;
				break;
			}			
		}

		if (diff) c.push(a[i]);
	}
	
	return c;
	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function toDegrees(a) {
	return Math.floor(180.0 * a/Math.PI);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------

