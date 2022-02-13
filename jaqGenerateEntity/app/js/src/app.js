var debug = false;
window.envFile = '/opt/lampp/htdocs/backend4-105.lan/.env';

window.addEventListener('load', onLoad);
window.onkeyup = onKeyUp;
window.onresize = onResize;

function onLoad() {
	try {
		Qt.setWindowIconImage(Qt.appDir() + '/i/icons/32.png');
		AppRecentFolder.init();
		AutonullCheckbox.init();
		EntityNameFields.init();
		FieldList.init();
		EntityCodeGenerator.init();
		// alert('Hello!');
	} catch (err) {
		alert(err);
	}
}

function onResize() {
	resizeWorkArea();
}


function resizeWorkArea(isNoResizeWindowEvent) {
	
	try {
		if (W.colorTa) {
			// W.colorTa.emulateOnScroll();
			W.colorTa.onResize();
		}
	} catch(e) {
		alert(e);
		W.isCatched = true;
	}
	
	
	if (!isNoResizeWindowEvent && W.initalizedForSaveResize) {
		try {
			storage('lastWndSize', {w:screen.width, h:screen.height});
		} catch(e) {
			alert('App::resizeWorkArea:\n' + e);
		}
	}
	W.initalizedForSaveResize = true;
	
    if (isNoResizeWindowEvent && String(W.prevEditH) != 'undefined') {
		if (tEdit1.offsetHeight == W.prevEditH) {
			return;
		}
    }
    var o = getViewport(), 
		tEdit1 = e('hMainScreen'),
		editH = tEdit1.offsetHeight;
    
    var h = (o.h  - 0) + 'px';
    stl(tEdit1, 'height', h);
    
	W.newEdit1HForStore = editH;
	setTimeout(function(){
		if (W.newEdit1HForStore) {
			storage('lasttEdit1H', W.newEdit1HForStore);
			W.newEdit1HForStore = 0;
		}
	},
	1000);
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
	if (evt.keyCode == 27 && window.mainMenuIsHide) {
		exitFromFullscreen();
	}
}

function onClickExitMenu() {
	Qt.quit();
}
