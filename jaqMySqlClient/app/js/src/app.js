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
			onClickSelectServer();
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
    W.addHostDlg = new AddHostDlg();
    
}
function onClickSelectServer() {
    appWindow('hManageServerDlg', 'Настройки соединения с сервером', onClosePopup);
    W.manageHostsDlg = new ManageHostDlg();
    
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
    
    W.sqlField = new SqlField();
    W.dataGrid = new SqlDataGrid('hResultArea');
}

function resizeWorkArea(isNoResizeWindowEvent) {
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
		alert('Выбрано ' + data.n + ' строк');
		W.dataGrid.set(data.rows, data.n);
		return;
	}
	
	if (data.status == 'error') {
		alert(data.msg);
	}
}

function Null() {
	
}
