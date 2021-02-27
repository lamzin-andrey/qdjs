function App() {
	this.mediaFiles = [];
	this.setListeners();
}

App.prototype.setListeners = function() {
	var o = this;
	e('bPlusFile').onclick = function(evt) {
		o.onBrowse(evt);
	};
	// TODO bConvertToAvi
	e('bConvertToAvi').onclick = function(evt) {
		o.onConvert2AviClick(evt);
	};
}

App.prototype.resetParams = function() {
	this.convertProcIsRun = 0;
	this.mediaIterator = 0;
	this.mediaFiles = [];
}

App.prototype.onConvert2AviClick = function(evt) {
	if (this.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	this.mediaIterator = 0;
	var isRun = this.mediaFiles[this.mediaIterator].convert();
	if (!isRun) {
		alert('Вам надо выбрать mp4 или mts файл');
	} else {
		this.convertProcIsRun = 1;
	}
}

App.prototype.onObserveOneFile = function(std, err) {
	this.mediaFiles[this.mediaIterator].onObserve(std, err);
}

// TODO move to onComplete
App.prototype.onFinishOneFile = function(std, err) {
	this.mediaIterator++;
	if (this.mediaIterator < this.mediaFiles.length) {
		this.mediaFiles[this.mediaIterator].convert();
	} else {
		
		var msg = 'Done!';
		/* TODO if (W.app.isInterrupt()) {
			msg = 'Прервано пользователем';
		}*/
		this.resetParams();
		Qt.setTitle(msg);
		
		e('hFileList').innerHTML = '';
		alert(msg);//alert('procId = ' + procId + '\n sysId = ' + sysId);
	}
}

/**
 * @description Обработка нажатия кнопки выбора mp3 файла. Сохраняет последнюю директорию.
*/
App.prototype.onBrowse = function(evt) {
	if (this.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	var filePath = jqlOpenFileDialog('Выберите mp4 или mts файл', '*.mp4 *.mts'),
		media;
	
	//Set filename in view
	if (filePath) {
		media = new MediaFileProcess();
		media.setOnCompleteOneFileListener(this, this.onFinishOneFile);
		this.mediaFiles.push(media);
		media.addFileInfoBlock('hFileList', filePath);
	}
}
