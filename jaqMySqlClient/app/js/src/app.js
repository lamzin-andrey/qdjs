var debug = false;




function log(s) {
	if (debug) {
		//e('log').innerHTML += '<div style="color:blue;">' + s + '</div>';
		PHP.file_put_contents(Qt.appDir() + '/dev.log', s + "\n", 1);
	}
	
}
function onKeyUp(evt) {
	if (W.modalActive) {
		return true;
	}
    if (evt.ctrlKey) {
		switch(evt.keyCode) {
			case 65:
				onClickAddServer();
			break;
			
			case 79:
				onClickSelectServer();
			break;
			
			case 81:
				onClickExitMenu();
			break;
			
			case 82://TODO R
				onClickResetWindow();
			break;
		}
    }
	if (evt.keyCode == 27 && window.mainMenuIsHide) {
		exitFromFullscreen();
	}
}
function onClickAddServer(){
    appWindow('hConfigServerParams', 'Добавить сервер', onClosePopup);
    W.addHostDlg = new AddHostDlg();
    W.dataGrid.setIsFocused(false);
    W.modalActive = 1;  
}
function onClickSelectServer() {
    appWindow('hManageServerDlg', 'Настройки соединения с сервером', onClosePopup);
    W.manageHostsDlg = new ManageHostDlg();
    W.dataGrid.setIsFocused(false);
    W.modalActive = 1;
    window.colorTa.modalActive = 1;
}

function onClickDeleteConfig() {
	if (confirm('Are you sure, than you want delete all configurations? All server connections will be losed. Continue?')) {
		PHP.file_put_contents(Qt.appDir() + '/config.json', '{}');
	}
}

function onClickOpenSqlFile() {
	var lastDir = storage(W.sqlField.SKEY_LAST_FILE);
	if (!lastDir) {
		lastDir = Qt.appDir();
	}
	var fileName = Qt.openFileDialog('Select sql file', lastDir, '*.sql');
	var s = PHP.file_get_contents(fileName);
	W.tEdit1.value = s;
	storage(W.sqlField.SKEY_LAST_FILE, fileName)
}

function onClickResetWindow() {
	if (confirm('Reset window size?')) {
		storage('lasttEdit1H', 0);
		storage('lastWndSize', {});
	}
}

function onClickExitMenu() {
	Qt.quit();
}
function onResizeWindow() {
    resizeWorkArea();
}

function onClosePopup() {
    W.dataGrid.setIsFocused(true);
    W.modalActive = 0;
    window.colorTa.modalActive = 0;
}

window.onresize = onResizeWindow;
window.onload = onLoad;
window.onkeyup = onKeyUp;
function onLoad() {
	Qt.setWindowIconImage(App.dir() + '/i/icons/48.png');
    W.tEdit1 = e('tEdit1');
    W.hResultArea = e('hResultArea');
    resizeWorkArea(1);
    
    try {
		var lastSize = storage('lastWndSize');
		if (lastSize.w && lastSize.h) {
			Qt.resizeTo(lastSize.w, lastSize.h);
			Qt.moveTo(0, 0);
		}
		var lasttEdit1H = storage('lasttEdit1H');
		if (lasttEdit1H) {
			lasttEdit1H = parseInt(lasttEdit1H);
		}
		if (lasttEdit1H) {
			W.tEdit1.style.height = lasttEdit1H + 'px';
		}
	} catch(e) {
		alert('onLoad:\n' + e);
	}
    
    setInterval(function() {
		resizeWorkArea(1);
    }, 200);
    
    
    W.dataGrid = new SqlDataGrid('hResultArea');
    W.sqlField = new SqlField(W);
    
    W.sqlField.onfocus = onSqlFieldFocused;
    W.sqlField.onblur = onSqlFieldBlured;
    
    var sqlColorTextRules = new ColorRuleSql();
	window.colorTa = new Qt5ColorTextArea('richTextEditor1', sqlColorTextRules);
    
    /*setTimeout(function(){
		alert(W.tEdit1.selectionStart);
		alert(W.tEdit1.selectionEnd);
	}, 3*1000
    );*/
}

function onSqlFieldFocused() {
	W.dataGrid.setIsFocused(false);
}

function onSqlFieldBlured() {
	if (!W.modalActive) {
		W.dataGrid.setIsFocused(true);
	}
}


function resizeWorkArea(isNoResizeWindowEvent) {
	var vp = getViewport();
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
			storage('lastWndSize', {w:vp.w, h:vp.h});
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
    var o = getViewport(), editH = tEdit1.offsetHeight;
    W.prevEditH = editH;
    var h = (o.h - editH - 40) + 'px';
    stl(hResultArea, 'height', h);
    
    if (W.dataGrid) {
		W.dataGrid.setScrollBars();
	}
	W.newEdit1HForStore = editH;
	setTimeout(function(){
		if (W.newEdit1HForStore) {
			storage('lasttEdit1H', W.newEdit1HForStore);
			W.newEdit1HForStore = 0;
		}
	},
	1000);
	
}

function onExecuteSql(data) {
	/*alert(data.status);
	alert(data.rows[0]['id']);*/
	if (data.status == 'ok') {
		if (parseInt(data.rows)) {
			//TODO показать мессагу со вставленым id
			alert('Идентификатор вставленной записи ' + parseInt(data.rows));
			return;
		}
		if (parseInt(data.ar)) {
			alert(' Затронуто ' + data.ar + ' строк');
			return;
		}
		if (data.n == 0) {
			alert('Выбрано ' + data.n + ' строк');
		}
		// alert('Выбрано ' + data.n + ' строк');
		
		W.dataGrid.set(data.rows, data.n);
		
		return;
	}
	
	if (data.status == 'error') {
		alert(data.msg);
	}
}

function Null() {
	
}
