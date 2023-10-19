function CScreenAppIcon() {}
CScreenAppIcon.prototype.init = function() {
	this.setListeners();
}

CScreenAppIcon.prototype.setListeners = function() {
	var o = this;
	e('bSelectImage').onclick = function(evt) {
		o.onClickSelectImage(evt);
	}
}

CScreenAppIcon.prototype.onClickSelectImage = function() {
	var path = jqlOpenFileDialog(L('Select application icon'), '*.png');
	if (path) {
		attr('imgAppIcon', 'src', path);
	}
}
