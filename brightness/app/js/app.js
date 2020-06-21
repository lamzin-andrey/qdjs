var SOCKET = '/home/andrey/.config/fastxampp/brightness.conf',
	INIT = 300,
	MAX = 5000,
	MIN = 100,
	curr = INIT,
	APP_NAME	= 'jaqMon';
function ch(n) {
	curr += n;
	if (curr > MAX) {
		curr = MAX;
	}
	if (curr < MIN) {
		curr = MIN;
	}
	PHP.file_put_contents(SOCKET, curr);
	$('#current').text(curr);
}
function jaqMon() {
	$('#bMin').click(decToMin);
	$('#bMin1000').click(decTo1000);
	$('#bMin100').click(decTo100);
	
	$('#bMax').click(incToMax);
	$('#bMax1000').click(incTo1000);
	$('#bMax100').click(incTo100);
	Qt.moveTo((screen.width - 320) / 2, 0);
	v = 0;
	if (PHP.file_exists(SOCKET)) {
		v = +PHP.file_get_contents(SOCKET);
	}
	v = v ? v : 300;
	$('#current').text(v);
}



function incToMax() {
	ch(MAX - curr);
}
function incTo1000() {
	ch(1000);
}
function incTo100() {
	ch(100);
}

function decToMin() {
	ch(-(curr - MIN));
}
function decTo1000() {
	ch(-1000);
}
function decTo100() {
	ch(-100);
}

window.onload = jaqMon;
