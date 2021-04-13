function CLanguageDlg(app) {
	this.visible = 0;
	this.container = e('languageDlgView');
	this.WIDTH = 530;
	this.HEIGHT = 420;
	
	this.bSave = e('bLangDlgOk');
	this.bClose = e('bCloseLangsDlg');
	this.setListeners();
	this.app = app;
}

CLanguageDlg.prototype.setListeners = function() {
	var o = this;
	this.bSave.onclick = function(evt) {
		o.onClickSave(evt);
	};
	this.bClose.onclick = function(evt) {
		o.close();
	};
}

CLanguageDlg.prototype.onClickSave = function(evt) {
	var sets = this.loadSettings(),
		options = [
			'bLangRu',
			'bLangEn'
		], i;
	
	for (i = 0; i < sz(options); i++) {
		if (e(options[i]).checked) {
			sets.lang = options[i];
			break;
		}
	}
	storage('langs', sets);
	this.close();
	onLoadLocale(this.app);
}

CLanguageDlg.prototype.close = function() {
	this.container.style.display = 'none';
	this.visible = 0;
}

CLanguageDlg.prototype.loadSettings = function() {
	var sets = storage('langs');
	if (isU(sets) || !sets) {
		sets = {};
	}
	if (!sets.lang) {
		sets.lang = 'bLangRu';
	}
	
	return sets;
}
CLanguageDlg.prototype.show = function() {
	var sets = this.loadSettings();
	e(sets.lang).checked = true;
	
	this.container.style.opacity = 0;
	this.container.style.display = 'block';
	this.container.style.top = ((getViewport().h - this.HEIGHT) / 2 ) + 'px';
	this.container.style.left = ((getViewport().w - this.WIDTH) / 2 ) + 'px';
	this.container.style.opacity = 1;
	
	this.visible = 1;
}
