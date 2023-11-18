function App() {
	this.clearOldLog();
	this.resetParams();
	this.setListeners();
	try {
		this.outfileDlg = new COutputFileNameDlg(this);
		this.settingDlg = new CSettingsDlg(this);
		this.langDlg = new CLanguageDlg();
		this.mainMenu = new MainMenu(this.settingDlg, this.langDlg, this);
		onLoadLocale(this);
	} catch(err) {
		alert(err);
	}
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
	if (this.settingDlg.visible || this.langDlg.visible) {
		return;
	}
	if (this.convertProcIsRun == 1) {
		alert(L('Уже выполняется конвертация'));
		return;
	}
	this.mediaIterator = 0;
	this.outputFormat = 'mp3';
	var isRun = false;
	if (0 != this.mediaFiles.length) {
		isRun = this.mediaFiles[this.mediaIterator].convert(this.outputFormat);
	}
	if (!isRun) {
		alert(L('Вам надо выбрать mp4 или mts файл'));
	} else {
		this.convertProcIsRun = 1;
	}
}

App.prototype.onConvert2AviClick = function(evt) {
	if (this.settingDlg.visible || this.langDlg.visible) {
		return;
	}
	if (this.convertProcIsRun == 1) {
		alert(L('Уже выполняется конвертация'));
		return;
	}
	this.mediaIterator = 0;
	this.outputFormat = 'avi';
	
	var isRun = false;
	if (0 != this.mediaFiles.length) {
		isRun = this.mediaFiles[this.mediaIterator].convert(this.outputFormat);
	}
	if (!isRun) {
		alert(L('Вам надо выбрать mp4 или mts файл'));
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
	if (this.settingDlg.visible || this.langDlg.visible ) {
		return;
	}
	if (this.convertProcIsRun == 1) {
		alert(L('Уже выполняется конвертация'));
		return;
	}
	var filePath = jqlOpenFileDialog(L('Выберите mp4 или mts файл'), '*.mp4 *.mts *.ts *.avi *.vob', true),
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
 * @description Call, when from queue removed file, convertation process for it yet not run
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
/**
 * @description 
*/
App.prototype.clearOldLog = function() {
	var cmd = '#!/bin/bash\ncd "' + Qt.appDir() + '";\nrm -f *.log;\nrm -f *.png;', 
		file = Qt.appDir() + '/shr.sh';
	PHP.file_put_contents(file, cmd);
	jexec(file, on, on, on);
}
