MW.setIconImage(App.dir() + '/i/icons/48.png');
window.addEventListener('load', onWindowLoad);


// Store it!
function z(n) {
	var s = n < 10 ? ('0' + n) : n;
	return s;
}

function onWindowLoad() {
	try {
		window.stopTimeCtrl = new TimeControl();
		window.rc = new StopCmdCommander(window.stopTimeCtrl);
		//setLocale();
	} catch(e) {
		alert(e);
	}
}

// Save It!
function DevNull(a, b){
	/*alert(a);
	alert(b);*/
}

function makeCmd() {
	return "#!/bin/bash\n";
}



function log(s) {
	s = date("H:i:s") + "\n" + s + "\n=============\n\n";
	FS.writefile(App.dir() + "/d/uilog.txt", s, FILE_APPEND);
}
