var debug = false;
window.envFile = '/opt/lampp/htdocs/backend4-105.lan/.env';

window.addEventListener('load', onLoad);
window.onkeyup = onKeyUp;


function onLoad() {
	try {
		Qt.setWindowIconImage(Qt.appDir() + '/i/icons/32.png');
		//AppRecentFolder.init();
		//AutonullCheckbox.init();
		//JSONCheckbox.init();
		//InsertCheckbox.init();
		//ClassNameField.init();
		
		W.AppCreator = new CAppCreator();
		AppCreator.init();
		W.jaqedLang = W['lang' + TextTransform.capitalize(Settings.get('lang', 'ru'))];
		setLocale();
		// alert('Hello!');
	} catch (err) {
		alert(err);
	}
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


// ---- local
function onClickSelectEn() {
	// appWindow('hLangChooser', L('Выберите язык'), onDlgClose);
	W.jaqedLang = W.langEn;
	setLocale();
	// e('hCommentSmallText').innerHTML = L('hCommentSmallText');
	Settings.set('lang', 'en');
	var s = PHP.file_get_contents(Qt.appDir() + '/index.html');
	s = s.replace('<html lang="ru">', '<html lang="en">');
	PHP.file_put_contents(Qt.appDir() + '/index.html', s);
}

function onClickSelectRu() {
	W.jaqedLang = W.langRu;
	setLocale();
	Settings.set('lang', 'ru');
	// e('hCommentSmallText').innerHTML = L('hCommentSmallText');
	var s = PHP.file_get_contents(Qt.appDir() + '/index.html');
	s = s.replace('<html lang="en">', '<html lang="ru">');
	PHP.file_put_contents(Qt.appDir() + '/index.html', s);	
}

function onClickSelectInsertGenerator()
{	
    Qt.newWindow(App.dir() + '/tools/insertgen/app', []);
}
