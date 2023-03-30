window.SCROLL_LINE_HEIGHT = 18;
window.VERTICAL_SCROLL_COUNT = 1;
function main() {
	window.AppStartTime = time();
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
	window.onkeydown = onKeyUp;
	
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
		app.onResize();
	}, 1000);
	
	// for items
	contentTopAreaH = e('tabsContainer').offsetHeight + e('addressContainer').offsetHeight;
	e('tabItems').style.height = (vpH - contentTopAreaH - 1.7*dY) + 'px';
	
	// resizeTabItemsWidth();
	
	e('tabItems').style.height = (e('contentArea').offsetHeight - contentTopAreaH - 0.7*dY) + 'px';
	
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
		
		if (72 == evt.keyCode || 1056 == MW.getLastKeyCode()) {
			onClickChangeHideMode();
		}
		if (67 == evt.keyCode || 1057 == MW.getLastKeyCode()) {
			onCopy();
		}
		if (86 == evt.keyCode || 1052 == MW.getLastKeyCode()) {
			onPaste();
		}
		if (65 == evt.keyCode || 1060 == MW.getLastKeyCode()) {
			app.tab.selectAll();
		}
		if (88 == evt.keyCode || 1063 == MW.getLastKeyCode()) {
			app.tab.onClickCut();
		}
		if (76 == evt.keyCode || 1044 == MW.getLastKeyCode()) {
			onClickDisplayPath();
		}
		if (84 == evt.keyCode || 1045 == MW.getLastKeyCode()) {
			app.tabPanel.addTabItem( app.tab.currentPath );
		}
		
    }
    // After press Enter in Confirm dialog '||' not work
    if (46 == evt.keyCode && 16777223 == MW.getLastKeyCode()) {
		onDelete();
	}
	
	if (113 == evt.keyCode) {
		app.tab.onClickRename();
	}
	
	app.kbListener.onKeyDown(evt);
	
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
function onClickChangeAddressMode() {
	var mode = intval(Settings.get('addressLineMode')), text;
	if (1 === mode) {
		mode = 0;
		text = L('Display address line');
	} else {
		mode = 1;
		text = L('Display address as row buttons');
	}
	Settings.set('addressLineMode', mode);
	
	if (app && app.addressPanel) {
		if (1 === mode) {
			app.addressPanel.showTextAddress();
		} else {
			app.addressPanel.showButtonAddress();
		}
		Qt.renameMenuItem(1, 1, text);
	}
}

function onClickDisplayPath(){
	app.addressPanel.showTextAddressShort();
}

function onCopy() {
	app.tab.onClickCopy();
}
function onPaste() {
	app.tab.onClickPaste();
}
function onDelete() {
	try {
		app.tab.onClickRemove();
	} catch(err) {
		alert('main.js onDelete: ' + err);
	}
}

function onClickAbout() {
	alert('Version 3.1.1 pre-release');
}

function onClickCreateFileMenu() {
	app.tab.newFileAction();
}

function onClickCreateFolderMenu() {
	app.tab.newFolderAction();
}

function onClickNewWindowMenu() {
	app.openNewWindow();
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

function getScrollLineHeight() {
	return SCROLL_LINE_HEIGHT * VERTICAL_SCROLL_COUNT;
}

function resizetabItemsWidth() {
	var vpW = getViewport().w;
	e('tabItems').style.width = (vpW - e('sidebarWrapper').offsetWidth - getScrollLineHeight()) + 'px';
	// items headers
	//e('tabContentHeaders').style.width = (vpW - e('sidebarWrapper').offsetWidth - getScrollLineHeight()) + 'px';
	e('tabContentHeadersWr').style.width = (vpW - e('sidebarWrapper').offsetWidth - getScrollLineHeight()) + 'px';
	
	e('tabContentHeaders').style.minWidth = (
		e('tabContentHeaderDate').offsetWidth
		+ e('tabContentHeaderType').offsetWidth
		+ e('tabContentHeaderSize').offsetWidth
		+ e('tabContentHeaderFileName').offsetWidth
	) + 'px';
}

function log(s) {
	var c = FS.readfile(App.dir() + '/log.log');
	c += date('H:i:s') + ' ' + s + "\n";
	FS.writefile(App.dir() + '/log.log', c)
}

window.onload = main;

