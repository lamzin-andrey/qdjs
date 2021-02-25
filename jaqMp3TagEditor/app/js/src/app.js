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
function onClickChangeLang() {
	appWindow('hLangChooser', L('Выберите язык'), onDlgClose);
}
function onDlgClose() {
	if (e('cben').checked) {
		W.jaqedLang = W.langEn;
		setLocale();
		e('hCommentSmallText').innerHTML = L('hCommentSmallText');
		storage('lang', 'en');
		var s = PHP.file_get_contents(Qt.appDir() + '/index.html');
		s = s.replace('<html lang="ru">', '<html lang="en">');
		PHP.file_put_contents(Qt.appDir() + '/index.html', s);
	}
	
	if (e('cbru').checked) {
		W.jaqedLang = W.langRu;
		setLocale();
		storage('lang', 'ru');
		e('hCommentSmallText').innerHTML = L('hCommentSmallText');
		var s = PHP.file_get_contents(Qt.appDir() + '/index.html');
		s = s.replace('<html lang="en">', '<html lang="ru">');
		PHP.file_put_contents(Qt.appDir() + '/index.html', s);
	}
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
		var lang = storage('lang');
		if (lang && e('cb' + lang)) {
			e('cb' + lang).checked = true;
			onDlgClose();
		}
		W.ffmpeg = new FFMpeg(Qt.appDir() + '/js/vendor/classes/ffmpeg');
		W.appController = new AppController('hUpdateLabel', 'bSelectDirectory', ffmpeg);
	}  catch(E) {
		alert(E);
	}
}



function resizeWorkArea(isNoResizeWindowEvent) {
	return;
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
