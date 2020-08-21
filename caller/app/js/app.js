window.addEventListener('load', onWindowLoad);

function setListeners() {
	bSetH.onclick = onClickSetH;
	bSetM.onclick = onClickSetM;
	bSetPlus.onclick = onClickSetPlus;
	bSetMinus.onclick = onClickSetMinus;
}
function onClickSetH() {
	window.setMode = 'h';
	bSetH.style.backgroundColor = '#6BA4D7';
	bSetM.style.backgroundColor = '#000';
}
function onClickSetM() {
	window.setMode = 'm';
	bSetH.style.backgroundColor = '#000';
	bSetM.style.backgroundColor = '#6BA4D7';
	onTick();
}
function onClickSetPlus() {
	if (window.setMode == 'h') {
		window.targetH++;
		if (window.targetH > 23) {
			window.targetH = 0;
		}
	} else {
		window.targetM++;
		if (window.targetM > 59) {
			window.targetM = 0;
		}
	}
	onTick();
	storeTarget();
}
function onClickSetMinus() {
	if (window.setMode == 'h') {
		window.targetH--;
		if (window.targetH < 0) {
			window.targetH = 23;
		}
	} else {
		window.targetM--;
		if (window.targetM < 0) {
			window.targetM = 59;
		}
	}
	onTick();
	storeTarget();
}

function storeTarget() {
	var file = getFileSettingsPath();
	PHP.file_put_contents(file, z(window.targetH) + ':' + z(window.targetM));
}

function z(n) {
	var s = n < 10 ? ('0' + n) : n;
	return s;
}

function onWindowLoad() {
	window.n = 1;
	window.targetH = 19;
	window.targetM = 0;
	var file = getFileSettingsPath();
	if (PHP.file_exists(file)) {
		var data = PHP.file_get_contents(file);
		var a = data.split(':');
		if (a.length == 2) {
			window.targetH = intval(a[0]);
			window.targetM = intval(a[1]);
		}
	}
	
	window.setMode = 'h';
	setInterval(onTick, 1000);
	setInterval(onHalfTick, 900);
	setInterval(onCall, 5 * 1000);
	setListeners();
	bSetH.style.backgroundColor = '#6BA4D7';
	bSetM.style.backgroundColor = '#000';
	onTick();
}

function getFileSettingsPath() {
	return Qt.appDir() + '/setting.txt';
}

function onTick() {
	hTime.innerHTML = date('H');
	hMinute.innerHTML = date('i');
	hSetTime.innerHTML = z(window.targetH);
	hSetMinute.innerHTML = z(window.targetM);
}

function onCall() {
	if (intval(date('H')) == window.targetH && 
		intval(date('i')) == window.targetM
		) {
			//PHP.exec('rhythmbox /home/andrey/2019-01-08-16-02-00.mp3', 'onNull', 'onNull', 'onNull');
			PHP.exec('rhythmbox ' + Qt.appDir() + '/call.ogg', 'onNull', 'onNull', 'onNull');
			PHP.exec('mplayer ' + Qt.appDir() + '/call.ogg', 'onNull', 'onNull', 'onNull');
			//PHP.exec('gnome-sound-recorder ' + Qt.appDir() + '/call.ogg', 'onNull', 'onNull', 'onNull');
			
	}
}

function onNull(a, b){
	/*alert(a);
	alert(b);*/
}

function onHalfTick() {
	var n = window.n,
		clr = '#39D749',
		sClr = clr;
	if (n == 1) {
		n = 2;
	} else {
		n = 1;
	}
	
	if (n == 2) {
		clr = '#000';
	} else {
		clr = sClr;
	}
	hDots.style.color = clr;
	window.n = n;
}


