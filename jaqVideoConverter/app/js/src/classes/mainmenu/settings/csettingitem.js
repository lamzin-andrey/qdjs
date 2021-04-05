function CSettingItem(settingsDlg) {
	this.settingsDlg = settingsDlg;
	this.view = e('menuItemFirstFront');
	this.setListeners();
}

CSettingItem.prototype.setListeners = function() {
	var o = this;
	this.view.onclick = function(evt) {
		o.onClick(evt);
	};
}
CSettingItem.prototype.onClick = function(evt) {
	this.settingsDlg.show();
}
