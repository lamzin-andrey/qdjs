function CAppRecentFolder(dialogTitle, inputId, btnId) {
	this.dialogTitle = dialogTitle;
	this.inputId = inputId;
	this.btnId = btnId;
}

CAppRecentFolder.prototype.init = function(){
	var o = this;
	o.pathInput = e(o.inputId);
	o.pathInput.value = o.getlastDirViewValue(o.getLastDir());
	e(o.btnId).onclick = function() {
		o.onClickLastDirButton();
	}
}
CAppRecentFolder.prototype.getlastDirViewValue = function(s){
	var a = s.split('/src/');
	if (a.length > 1) {
		return 'src/' + a[1];
	}
	
	return s;
}
CAppRecentFolder.prototype.onClickLastDirButton = function(s){
	var o = this, s = o.openDirectoryDialog(o.dialogTitle, '');
		o.pathInput.value = o.getlastDirViewValue(s);
	
	return s;
}
CAppRecentFolder.prototype.get = function(s){
	return this.getLastDir();
}
/**
 * @description Запускает Qt.openDirectoryDialog но при этом запоминает последнюю выбранную директорию
 * @param {String} sTitle - тайтл окна диалога
 * @param {String} sFileTypes  - @see Qt.openFileDialog filetypes (for example '*.sql' in Linux)
*/
CAppRecentFolder.prototype.openDirectoryDialog = function(sTitle, sFileTypes){
	var key = this.inputId + "AppRecentLastDir", lastDir = Settings.get(key);
	if (!lastDir) {
		lastDir = "";
	}
	s = Qt.openDirectoryDialog(sTitle, lastDir, sFileTypes);
	if (!s) {
		return '';
	}
	Settings.set(key, s);
	return s;
}

CAppRecentFolder.prototype.getLastDir = function(){
	var key = this.inputId + "AppRecentLastDir", lastDir = Settings.get(key);
	if (!lastDir) {
		lastDir = "";
	}
	return lastDir;
}


var AppRecentFolder  = new CAppRecentFolder("Выберите каталог с сущностями", "entityFolder", "bSwitchEntityFolder");
