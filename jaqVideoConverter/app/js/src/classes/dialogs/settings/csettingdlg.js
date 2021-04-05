function CSettingsDlg() {
	this.visible = 0;
	this.container = e('settingsDlgView');
	this.WIDTH = 530;
	this.HEIGHT = 420;
	// this.setListeners();
}

/*CSettingsDlg.prototype.setListeners = function() {
	var o = this;
	e('#').onclick = function(evt) {
		o.on(evt);
	};
}*/

CSettingsDlg.prototype.show = function() {
	this.container.style.opacity = 0;
	this.container.style.display = 'block';
	this.container.style.top = ((getViewport().h - this.HEIGHT) / 2 ) + 'px';
	this.container.style.left = ((getViewport().w - this.WIDTH) / 2 ) + 'px';
	this.container.style.opacity = 1;
}
