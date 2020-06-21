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
			case 65:
				onClickAddServer();
				break;
			case 79:
				onClickSelectSwfFile();
				break;
			case 81:
				onClickExitMenu();
				break;
		}
		
	}
	if (evt.keyCode == 27 && window.mainMenuIsHide) {
		exitFromFullscreen();
	}
}
function onClickAddServer(){
    appWindow('hConfigServerParams', 'Добавить сервер', onClosePopup);
}
function onClickExitMenu() {
	Qt.quit();
}
function onResizeWindow() {
    resizeWorkArea();
}

function onClosePopup() {
    //alert('It Will close!');
}

window.onresize = onResizeWindow;
window.onload = onLoad;
window.onkeyup = onKeyUp;
function onLoad() {
    W.tEdit1 = e('tEdit1');
    W.hResultArea = e('hResultArea');
    resizeWorkArea(1);
    
    setInterval(function() {
	resizeWorkArea(1);
    }, 200);
}

function resizeWorkArea(isNoResizeWindowEvent) {
    if (isNoResizeWindowEvent && String(W.prevEditH) != 'undefined') {
	if (tEdit1.offsetHeight == W.prevEditH) {
	    return;
	}
    }
    var o = getViewport(), editH = tEdit1.offsetHeight;
    W.prevEditH = editH;
    var h = (o.h - editH) + 'px';
    stl(hResultArea, 'height', h);
}
