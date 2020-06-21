function e(i){return document.getElementById(i);}

function copyFields(source, target) {
	target = target ? target : window;
	for (var i in source) {
		if (! (source[i] instanceof Function) ) {
			target[i] = source[i];
		}
	}
}
function clone(source, target) {
	target = target ? target : window;
	for (var i in source) {
		target[i] = source[i];
	}
}

function log(s) {
	var i = 'cout';
	var o = e(i);
	if (o) {
		var c = e('cout').innerHTML;
		c += '<div style="color:blue">' + s + '</div>';
		e(i).innerHTML = c;
	}
}
function hide(i) {
	e(i).style.display = 'none';
}
function show(i) {
	e(i).style.display = 'block';
}
