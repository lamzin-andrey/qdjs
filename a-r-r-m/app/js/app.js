MW.setIconImage(App.dir() + '/i/icons/48.png');
window.addEventListener('load', onWindowLoad);


// Store it!
function z(n) {
	var s = n < 10 ? ('0' + n) : n;
	return s;
}

function onWindowLoad() {
	try {
		window.startTimeCtrl = new TimeControl('startTC', 'Старт в:', 'startSets');
		window.stopTimeCtrl = new TimeControl('stopTC', 'Стоп в:', 'stopSets');
		window.rc = new RecordCommander(window.startTimeCtrl, window.stopTimeCtrl);
	} catch(e) {
		document.write(e );
	}
}

// Save It!
function onNull(a, b){
	/*alert(a);
	alert(b);*/
}

