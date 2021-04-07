function CSettingItem(settingsDlg, app) {
	this.settingsDlg = settingsDlg;
	this.view = e('menuItemFirstFront');
	this.app = app;
	this.setListeners();
}

CSettingItem.prototype.setListeners = function() {
	var o = this;
	this.view.onclick = function(evt) {
		o.onClick(evt);
	};
}
CSettingItem.prototype.onClick = function(evt) {
	if (this.app.convertProcIsRun == 1) {
		alert(L('Уже выполняется конвертация'));
		return;
	}
	this.settingsDlg.show();
}
