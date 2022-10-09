//Qt.hide();
//MW.minimize();
MW.setIconImage(App.dir() + '/i/folder32.png');
function main() {
	window.onresize = onResize;
	window.onkeyup = onKeyUp;
	onResize();
	
	window.app = new FManagerMCDialog();
	
}

function log(s) {
	if (window.app) {
	// if (isset(window, 'app', 'taskManager', 'log') {
		window.app.taskManager.log(s);
	}
	
}


function onResize() {
	
	
}



function onKeyUp(evt) {
    if (evt.ctrlKey) {
		switch(evt.keyCode) {
			case 79:	//O
			// onClickChangeEnv();
			break;
			case 81:	//Q
			onClickExitMenu();
			break;
		}
	}
}

function onClickExitMenu() {
	Qt.quit();
}

function DevNull(){}

window.onload = main;

