function CSettingsDlg() {
	this.visible = 0;
	this.container = e('settingsDlgView');
	this.WIDTH = 530;
	this.HEIGHT = 420;
	this.iCatalogName = e('iMoveSourceCatalog');
	this.bSave = e('bsettingsDlgOk');
	this.bClose = e('bCloseSettingsDlg');
	this.bRemoveMeta = e('bRemoveMeta');
	this.setListeners();
}

CSettingsDlg.prototype.setListeners = function() {
	var o = this;
	this.bSave.onclick = function(evt) {
		o.onClickSave(evt);
	};
	this.bClose.onclick = function(evt) {
		o.close();
	};
}

CSettingsDlg.prototype.onClickSave = function(evt) {
	var sets = this.loadSettings(),
		options = [
			'bNothingSource',
			'bRemoveSource',
			'bMoveSource'
		], i;
	sets.catalogName = this.iCatalogName.value;
	if (sets.catalogName == '') {
		alert(L('Имя каталога не может быть пустым'));
		return;
	}
	
	for (i = 0; i < sz(options); i++) {
		if (e(options[i]).checked) {
			sets.actions = options[i];
			break;
		}
	}
	sets.removeMeta = this.bRemoveMeta.checked;
	
	storage('convertsettings', sets);
	this.close();
}

CSettingsDlg.prototype.close = function() {
	this.container.style.display = 'none';
	this.visible = 0;
}

CSettingsDlg.prototype.loadSettings = function() {
	var sets = storage('convertsettings');
	if (isU(sets) || !sets) {
		sets = {};
	}
	if (!sets.actions) {
		sets.actions = 'bNothingSource';
	}
	if (!sets.catalogName) {
		sets.catalogName = 'source-videow';
	}
	if (!sets.removeMeta) {
		sets.removeMeta = false;
	}
	return sets;
}
CSettingsDlg.prototype.show = function() {
	var sets = this.loadSettings();
	e(sets.actions).checked = true;
	this.iCatalogName.value = sets.catalogName;
	this.bRemoveMeta.checked = sets.removeMeta;
	
	
	this.container.style.opacity = 0;
	this.container.style.display = 'block';
	this.container.style.top = ((getViewport().h - this.HEIGHT) / 2 ) + 'px';
	this.container.style.left = ((getViewport().w - this.WIDTH) / 2 ) + 'px';
	this.container.style.opacity = 1;
	
	this.visible = 1;
}
