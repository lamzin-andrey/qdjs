window.SCROLL_LINE_HEIGHT = 18
function main() {
	try {
		var lang = Settings.get('currentLang');
		if (lang == 'ru' || lang == 'en') {
			onClickChangeLang(lang);
		}
	} catch (err) {
		alert(err);
	}
	Qt.setWindowIconImage(Qt.appDir() + '/i/folder32.png');
	Qt.maximize();
	
	//try {
		window.app = new FileManager();
	/*} catch(err) {
		alert(err);
	}/**/
	
	window.onresize = onResize;
	window.onkeyup = onKeyUp;
	
	onResize();
}
function onResize() {
	var contentTopAreaH, 
		vp = getViewport(),
		vpH = vp.h,
		vpW = vp.w,
		dY = 48;
	// for table
	e('contentArea').style.height = (vpH - 0) + 'px';
	e('contentArea').style.maxHeight = (vpH - dY) + 'px';
	
	e('sidebarWrapper').style.height = (vpH - 0) + 'px';
	e('sidebarWrapper').style.maxHeight = (vpH - dY - 1) + 'px';
	
	setTimeout(function() {
		e('contentArea').style.height = (vpH - 0) + 'px';
		e('contentArea').style['max-height'] = (vpH - dY) + 'px';
		
		e('sidebarWrapper').style.height = (vpH - 0) + 'px';
		e('sidebarWrapper').style.maxHeight = (vpH - dY) + 'px';
	}, 1000);
	
	// for items
	contentTopAreaH = e('tabsContainer').offsetHeight + e('addressContainer').offsetHeight;
	e('tabItems').style.height = (vpH - contentTopAreaH - 1.7*dY) + 'px';
	e('tabItems').style.width = (vpW - e('sidebarWrapper').offsetWidth - SCROLL_LINE_HEIGHT) + 'px';
	
	// items headers
	//e('tabContentHeaders').style.width = (vpW - e('sidebarWrapper').offsetWidth - SCROLL_LINE_HEIGHT) + 'px';
	
	e('tabContentHeadersWr').style.width = (vpW - e('sidebarWrapper').offsetWidth - SCROLL_LINE_HEIGHT) + 'px';
	
	e('tabContentHeaders').style.minWidth = (
		e('tabContentHeaderDate').offsetWidth
		+ e('tabContentHeaderType').offsetWidth
		+ e('tabContentHeaderSize').offsetWidth
		+ e('tabContentHeaderFileName').offsetWidth
	) + 'px';
	
	app.onResize();
	
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
	
	if (72 == MW.getLastKeyCode() || 1056 == MW.getLastKeyCode()) {
		onClickChangeHideMode();
	}
	    
    }
	
}

function onClickExitMenu() {
	Qt.quit();
}

function onClickChangeHideMode() {
	var mode = intval(Settings.get('hMode')), text;
	if (1 === mode) {
		mode = 0;
		text = L('Show hidden files Ctrl+H');
	} else {
		mode = 1;
		text = L('Hide hidden files Ctrl+H');
	}
	Settings.set('hMode', mode);
	
	if (app && app.tab) {
		app.tab.setPath(app.tab.currentPath);
		Qt.renameMenuItem(1, 0, text);
	}
}

function onClickAbout() {
	alert('Version 3.1.1 pre-release');
}

function onClickSelectEn() {
	onClickChangeLang('en');
}

function onClickSelectRu() {
	onClickChangeLang('ru');
}

function onClickChangeLang(lang) {
	var root = App.dir(), 
		path = root + '/doc/lang/' + lang + '/content.htm',
		t = 'F:/dev-11-2014/qt/DTOxp/release/default', 
		s;
	s = FS.readfile(path);
	while (s.indexOf(t) != -1) {
		if (t == root) {
			break;
		}
		s = s.replace(t, appDir);
	}
	e('contentArea').innerHTML = s;
	
	s = FS.readfile(App.dir() + '/doc/lang/' + lang + '/navbar.htm');
	while (s.indexOf(t) != -1) {
		if (t == root) {
			break;
		}
		s = s.replace(t, appDir);
	}
	e('sidebarWrapper').innerHTML = s;
	try {
		Search.init();
	} catch(err) {
		alert(err);
	}
	
	// change menu language
	var indexFile = root + '/index.html',
		s = FS.readfile(indexFile);
	s = s.replace(/<html lang="[a-z]{2}">/, '<html lang="' + lang +'">');
	FS.writefile(indexFile, s);
	
	Settings.set('currentLang', lang);
}

window.onload = main;

