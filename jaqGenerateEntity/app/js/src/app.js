var debug = false;
window.envFile = '/opt/lampp/htdocs/backend4-105.lan/.env';

window.addEventListener('load', onLoad);
window.onkeyup = onKeyUp;

function onLoad() {
	try {
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
