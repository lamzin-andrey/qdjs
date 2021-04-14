function COutputFileNameDlg() {
	this.visible = 0;
	this.container = e('editOutputFileDlgView');
	this.WIDTH = 530;
	this.HEIGHT = 420;
	this.iFileName = e('iOutputFilename');
	this.bSave = e('bEOFNDlgOk');
	this.bClose = e('bCloseEOFNDlg');
	
	this.mediafileProcess = null;
	
	this.setListeners();
}

COutputFileNameDlg.prototype.setListeners = function() {
	var o = this;
	this.bSave.onclick = function(evt) {
		o.onClickSave(evt);
	};
	this.bClose.onclick = function(evt) {
		o.close();
	};
}

COutputFileNameDlg.prototype.onClickSave = function(evt) {
	var fileName = this.iFileName.value;
	if (fileName.trim() == '') {
		alert(L('Имя файла не может быть пустым'));
		return;
	}
	
	this.mediafileProcess.setOutputFileName(fileName);
	this.close();
}

COutputFileNameDlg.prototype.close = function() {
	this.container.style.display = 'none';
	this.visible = 0;
}


COutputFileNameDlg.prototype.show = function(mediafileProcess, fileName) {
	
	this.mediafileProcess = mediafileProcess;
	var a = fileName.split('.'), i;
	a.pop();
	fileName = a.join('.');
	
	this.iFileName.value = fileName;
	
	this.container.style.opacity = 0;
	this.container.style.display = 'block';
	this.container.style.top = ((getViewport().h - this.HEIGHT) / 2 ) + 'px';
	this.container.style.left = ((getViewport().w - this.WIDTH) / 2 ) + 'px';
	this.container.style.opacity = 1;
	
	this.visible = 1;
}
