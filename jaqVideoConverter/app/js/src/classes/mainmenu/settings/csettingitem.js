function CSettingItem(settingsDlg, langDlg, app) {
	this.settingsDlg = settingsDlg;
	this.langDlg = langDlg;
	this.itemView = e('menuItemFirstFront');
	this.boxView = e('menuItemFile');
	this.childConvertationView = e('hMMenuSetsConv');
	this.childLangView = e('hMMenuSetsLang');
	this.app = app;
	this.setListeners();
}

CSettingItem.prototype.setListeners = function() {
	var o = this;
	this.itemView.onclick = function(evt) {
		o.onClickItemView(evt);
	};
	
	this.childLangView.onclick = function(evt) {
		o.onClickLangItemView(evt);
	};
	
	this.childConvertationView.onclick = function(evt) {
		o.onClickConvertationItemView(evt);
	};
}
CSettingItem.prototype.onClickItemView = function(evt) {
	if (this.settingsDlg.visible || this.langDlg.visible) {
		return;
	}
	if (this.app.convertProcIsRun == 1) {
		alert(L('Уже выполняется конвертация'));
		return;
	}
	if (this.boxView.style.display == 'none') {
		this.boxView.style.display = null;
	} else {
		this.boxView.style.display = 'none';
	}
	
}
CSettingItem.prototype.onClickLangItemView = function(evt) {
	this.boxView.style.display = 'none';
	this.langDlg.show();
}
CSettingItem.prototype.onClickConvertationItemView = function(evt) {
	this.boxView.style.display = 'none';
	this.settingsDlg.show();
}
