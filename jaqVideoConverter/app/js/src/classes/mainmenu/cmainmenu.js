function MainMenu(settingsDlg, langDlg, app) {
	this.settingsMenuItem = new CSettingItem(settingsDlg, langDlg, app);
	
	//this.setListeners();
}

/*MainMenu.prototype.setListeners = function() {
	var o = this;
	e('#').onclick = function(evt) {
		o.on(evt);
	};
}*/
