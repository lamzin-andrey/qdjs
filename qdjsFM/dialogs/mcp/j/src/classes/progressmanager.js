function ProgressManager(taskManager, ui) {
	this.taskManager = taskManager;
	this.ui = ui;
	this.aCurrentFiles = []; // [ [src, dest, ?sz ], ... ]
	this.nCurrentFilesIterator = -1;
}

ProgressManager.DEFAULT_BIG_FILE_SZ = 1024 * 1024 * 1024;

ProgressManager.prototype.setCurrentFile = function(srcFile, destFile) {
	// добавлять только если размер больше чем условный размер "малого" файла
	var fSz = FS.filesize(srcFile);
	if (fSz > this.getBigFileSize()) {
		this.aCurrentFiles.push([srcFile, destFile]);
	}
}

ProgressManager.prototype.run = function() {
	var o = this;
	this.ival = setInterval(function() {
		o.tick();
	}, 200);
}

ProgressManager.prototype.tick = function() {
	/*if (this.inTickProc) {
		return;
	}*/
	try {
		this.inTickProc = 1;
		this.ui.setSrcSize( this.taskManager.getSrcSize() );
		
		this.ui.setDestSize(this.getDestSize());
		this.ui.setCurrentFileName(this.taskManager.currentFileName);
		
		this.inTickProc = 0;
	} catch (err) {
		log('tick ' + err + ',' + this.taskManager.currentFileName);
	}
}

ProgressManager.prototype.getDestSize = function() {
	var n = this.taskManager.getDestSize(),
		x = this.getCurrentFileSize();
	if (x) {
		n += this.getCurrentDestFileSize();
	}
	if (n > this.taskManager.getSrcSize()) {
		n = this.taskManager.getSrcSize()
	}
	return n;
}

ProgressManager.prototype.getCurrentDestFileSize = function() {
	var idx = this.idx,
		item,
		n = 0, destFile = '';
	if (!idx) {
		idx = sz(this.aCurrentFiles) - 1;
	}
	item = this.aCurrentFiles[idx];
	if (sz(item) > 1) {
		destFile = item[1];
	}
	if (FS.fileExists(destFile)) {
		n = FS.filesize(destFile);
	}
	
	this.idx = idx;
	
	return n;
}

ProgressManager.prototype.getCurrentFileSize = function() {
	if (!sz(this.aCurrentFiles)) {
		return 0;
	}
	var idx = sz(this.aCurrentFiles) - 1,
		item = this.aCurrentFiles[idx],
		n;
	if (sz(item) > 1) {
		n = item[2];
	}
	if (isNaN(parseInt(n))) {
		n = FS.filesize(item[0]);
		item[2] = n;
		this.aCurrentFiles[idx] = item;
	}
	this.idx = idx;
	
	return n;
}

// TODO (2) динамически вычислять BIG_FILE_SZ и сохранять его в настройках
ProgressManager.prototype.getBigFileSize = function() {
	return ProgressManager.DEFAULT_BIG_FILE_SZ;
}

ProgressManager.prototype.stop = function() {
	// this.stopTimer();
	this.aCurrentFiles = [];
	this.nCurrentFilesIterator = -1;
	this.ui.setSrcSize(0);
	this.ui.setDestSize(0);
}

ProgressManager.prototype.stopTimer = function() {
	if (this.ival) {
		clearInterval(this.ival);
		this.ival = null;
	}
}
