function App() {
	this.resetParams();
	this.setListeners();
}

App.prototype.setListeners = function() {
	var o = this;
	e('bPlusFile').onclick = function(evt) {
		o.onBrowse(evt);
	};
	
	e('bConvertToAvi').onclick = function(evt) {
		o.onConvert2AviClick(evt);
	};
	e('bConvertToMp3').onclick = function(evt) {
		o.onConvert2Mp3Click(evt);
	};
	
}

App.prototype.resetParams = function() {
	this.convertProcIsRun = 0;
	this.mediaIterator = 0;
	this.mediaFiles = [];
	this.idCounter = 1;
}

App.prototype.onConvert2Mp3Click = function(evt) {
	if (this.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	this.mediaIterator = 0;
	this.outputFormat = 'mp3';
	var isRun = this.mediaFiles[this.mediaIterator].convert(this.outputFormat);
	if (!isRun) {
		alert('Вам надо выбрать mp4 или mts файл');
	} else {
		this.convertProcIsRun = 1;
	}
}

App.prototype.onConvert2AviClick = function(evt) {
	if (this.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	this.mediaIterator = 0;
	this.outputFormat = 'avi';
	var isRun = this.mediaFiles[this.mediaIterator].convert(this.outputFormat);
	if (!isRun) {
		alert('Вам надо выбрать mp4 или mts файл');
	} else {
		this.convertProcIsRun = 1;
	}
}

App.prototype.onObserveOneFile = function(std, err) {
	this.mediaFiles[this.mediaIterator].onObserve(std, err);
}

// It call from onComplete
App.prototype.onFinishOneFile = function(std, err) {
	// log('CApp:onFinishOneFile, ' + (this.mediaIterator < this.mediaFiles.length ? 'if OK...' : 'else...') + ', std = ' + std);
	this.mediaIterator++;
	if (this.mediaIterator < this.mediaFiles.length) {
		this.mediaFiles[this.mediaIterator].convert(this.outputFormat);
	} else {
		var msg = 'Done!';
		/* TODO  (?) if (W.app.isInterrupt()) {
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
	var filePath = jqlOpenFileDialog('Выберите mp4 или mts файл', '*.mp4 *.mts *ts', true),
		media, i;
	
	//Set filename in view
	if (filePath.length) {
		for (i = 0; i < filePath.length; i++) {
			media = new MediaFileProcess();
			media.order = this.idCounter;
			this.idCounter++;
			media.setOnCompleteOneFileListener(this, this.onFinishOneFile);
			media.setOnInterruptOneFileListener(this, this.onInterruptOneFile);
			this.mediaFiles.push(media);
			media.addFileInfoBlock('hFileList', filePath[i]);
		}
	}
}

/**
 * @description Вызывается, когда удален из очереди файл, конвертация которого ещё не началась
*/
App.prototype.onInterruptOneFile = function(order) {
	var i, media, target = -1;
	for (i = 0; i < this.mediaFiles.length; i++) {
		media = this.mediaFiles[i];
		if (media.order == order) {
			target = i;
			break;
		}
	}
	this.mediaFiles.splice(target, 1);
	
}
