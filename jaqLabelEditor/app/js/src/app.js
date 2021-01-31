var debug = false;




function log(s) {
	if (debug) {
		//e('log').innerHTML += '<div style="color:blue;">' + s + '</div>';
		PHP.file_put_contents(Qt.appDir() + '/dev.log', s + "\n", 1);
	}
	
}
function onKeyUp(evt) {
    if (evt.ctrlKey) {
		switch(evt.keyCode) {
			case 65: // A
			// onClickAddServer(); 
			break;
			case 79: // O
			// onClickSelectServer();
			break;
			case 81:
			onClickExitMenu(); // Q
			break;
		}
	    
    }
	if (evt.keyCode == 27 && window.mainMenuIsHide) {
		// exitFromFullscreen();
	}
}

function onClickExitMenu() {
	Qt.quit();
}
function onResizeWindow() {
    resizeWorkArea();
}


window.onresize = onResizeWindow;
window.onload = onLoad;
window.onkeyup = onKeyUp;
function onLoad() {
    W.hResultArea = e('hResultArea');
    resizeWorkArea(1);
    
    setInterval(function() {
		resizeWorkArea(1);
    }, 200);
    try {
		PHP.exec(Qt.appDir() + '/shell/user.sh', 'onUserData', 'Null', 'Null');
		W.appController = new AppController('hUpdateLabel');
		W.diskListController = new DiskListController(W.hResultArea,
		 './i/icons/usb16.png',
		 './i/icons/uusb16.png',
		 './i/icons/disk16.png',
		 './i/icons/udisk16.png'
		 );
		W.diskListController.onProcesLoadEventEnd = {
			m: W.appController.onStartLoadDisks,
			context: W.appController
		};
		W.diskListController.onProcesLoadEvent = {
			m: W.appController.onEndLoadDisks,
			context: W.appController
		};
		W.diskListController.build();
	}  catch(E) {
		alert(E);
	}
}

function onUserData(out, err) {
	W.USER = String(out).trim();
	W.GROUP = out;
	if (W.USER) {
		W.GROUP = W.USER;
		var s = PHP.file_get_contents('/home/' + W.USER + '/.mtoolsrc');
		if (s.indexOf('mtools_skip_check=1') == -1) {
			PHP.exec(Qt.appDir() + '/shell/actualize.sh', 'Null', 'Null', 'Null');
		}
	}
	
}


function resizeWorkArea(isNoResizeWindowEvent) {
	if (!W.tEdit1) {
		return;
	}
    if (isNoResizeWindowEvent && String(W.prevEditH) != 'undefined') {
		if (tEdit1 && tEdit1.offsetHeight == W.prevEditH) {
			return;
		}
    }
    var o = getViewport(), editH = tEdit1.offsetHeight;
    W.prevEditH = editH;
    var h = (o.h - editH - 40) + 'px';
    stl(hResultArea, 'height', h);
    
    if (W.dataGrid) {
		W.dataGrid.setScrollBars();
	}
}


function Null() {
	
}
