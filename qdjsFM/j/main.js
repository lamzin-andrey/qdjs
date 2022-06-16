function main() {
	try {
		var lang = Settings.get('curretLang');
		if (lang == 'ru' || lang == 'en') {
			onClickChangeLang(lang);
		}
	} catch (err) {
		alert(err);
	}
	Qt.setWindowIconImage(Qt.appDir() + '/i/folder32.png');
	Qt.moveTo(0, 31);
	Qt.resizeTo((screen.width), (screen.height - 92));
	
	window.onresize = onResize;
	window.onkeyup = onKeyUp;
	onResize();
	
	
}
function onResize() {
	// for table
	e('contentArea').style.height = (getViewport().h - 0) + 'px';
	e('contentArea').style.maxHeight = (getViewport().h - 32) + 'px';
	
	e('sidebarWrapper').style.height = (getViewport().h - 0) + 'px';
	e('sidebarWrapper').style.maxHeight = (getViewport().h - 32) + 'px';
	
	setTimeout(function() {
		e('contentArea').style.height = (getViewport().h - 0) + 'px';
		e('contentArea').style['max-height'] = (getViewport().h - 32) + 'px';
		
		e('sidebarWrapper').style.height = (getViewport().h - 0) + 'px';
		e('sidebarWrapper').style.maxHeight = (getViewport().h - 32) + 'px';
	}, 1000);
	
	
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
		Qt.showMainMenu();
	}
}

function onClickExitMenu() {
	Qt.quit();
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
	
	Settings.set('curretLang', lang);
}

window.onload = main;

