function Task(taskManager, cmd, targetDir, aSources) {
	this.name = 'Task';
	this.taskManager = taskManager;
	this.cmd = cmd;
	this.targetDir = targetDir;
	this.aSources = aSources;	
	this.state = Task.STATE_BUILD_NO_START;
	this.copyIterator = -1;
}
Task.ACTION_TYPE_BUILD = 1;
Task.ACTION_TYPE_COPY  = 2;

Task.STATE_BUILD_NO_START  = 1;
Task.STATE_BUILD_IN_PROCESS  = 2;
Task.STATE_BUILD_COMPLETE  = 3;
Task.STATE_COPY_NO_START  = 4;
Task.STATE_COPY_IN_PROGRESS  = 5;
Task.STATE_COPY_ALL_COMPLETE  = 6;

Task.prototype.makeAction = function() {
	switch (this.state) {
		case Task.STATE_BUILD_NO_START:
			this.startBuildSubdirs();
			break;
		case Task.STATE_BUILD_COMPLETE:
			this.startCopy();
			break;
	}
}
// не вставляем ли в тот же каталог, в котором скопировали только что?
//  Также внутри исключить из вставляемых тот каталог, в который  возможно вставляем.
//	  (Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
// В этом случае invalid только если после исключения список сорсов пуст.
Task.prototype.isValid = function() {
	// не вставляем ли в тот же каталог, в котором скопировали только что?
	var i, SZ = sz(this.aSources), pathInfo, newSources = [];
	for (i = 0; i < SZ; i++) {
		pathInfo = pathinfo(this.aSources[i]);
		if (pathInfo.dirname == this.targetDir) {
			return false;
		}
		
		// Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
		if (this.targetDir.indexOf(this.aSources[i]) != 0) {
			newSources.push(this.aSources[i]);
		}
	}
	
	this.aSources = newSources;
	
	if (!sz(this.aSources)) {
		return false;
	}
	
	return true;
}

/*Task.prototype.run = function() {
	
}
Task.prototype.onTick = function() {
	
}*/

Task.prototype.startCopy = function() {
	if (this.state == Task.STATE_COPY_IN_PROGRESS) {
		return;
	}
	this.state = Task.STATE_COPY_IN_PROGRESS;
	var i, SZ = sz(this.aSources),
		doWhile,
		cmd;
	this.copyIterator++;
	doWhile = FS.isDir(this.aSources[this.copyIterator]) && this.copyIterator < SZ;
	while (doWhile) {
		this.copyIterator++;
		doWhile = FS.isDir(this.aSources[this.copyIterator]) && this.copyIterator < SZ;
	}
	
	if (this.copyIterator >= SZ) {
		this.currentFile = '';
		this.state = Task.STATE_COPY_ALL_COMPLETE;
		return;
	}
	this.currentFile = this.aSources[this.copyIterator];
	if (this.destFileExists(this.aSources[this.copyIterator])) {
		this.taskManager.setFileExistsExpression(this.getExistsFileName(this.aSources[this.copyIterator]));
		if (!this.taskManager.confirmReplace()) {
			this.state = Task.STATE_BUILD_COMPLETE;
			this.startCopy();
			return;
		}
	}
	
	// TODO ProgressManager.setCurrentFile
	this.taskManager.progressManager.setCurrentFile(this.aSources[this.copyIterator], this.getExistsFileName(this.aSources[this.copyIterator]));
	cmd = '#!/bin/bash\n' + this.getCmd() + ' "' + this.aSources[this.copyIterator] + '" "' + this.targetDir + '"';
	this.lastCmdFile = App.dir() + '/sh/cp.sh';
	FS.writefile(this.lastCmdFile, cmd);
	jexec(this.lastCmdFile, [this, this.onFinishCopy], DevNull, [this, this.onErrCopy]);
}

Task.prototype.makeDir = function(dirName) {
	var pathInfo = pathinfo(dirName);
	dirName = pathInfo.basename;
	FS.mkdir(this.targetDir + '/' + dirName);
}

Task.prototype.onErrCopy = function(stderr) {
	this.taskManager.setFileErrorExpression(this.currentFile);
	if (!this.taskManager.confirmAbort()) {
		if (this.taskManager.confirmRetry()) {
			this.copyIterator--;
		}
		this.startCopy();
	} else {
		this.state = Task.STATE_COPY_ALL_COMPLETE;
	}
}

Task.prototype.onFinishCopy = function() {
	this.taskManager.incDestData(this.currentFile);
	this.state = Task.STATE_BUILD_COMPLETE;
	
	try {
		this.startCopy();
	} catch(err) {
		log('Task::OnFinishCopy run startCopy: ' + err);
	}
}

Task.prototype.destFileExists = function(sourceFile) {
	var file = this.getExistsFileName(sourceFile),
		b = FS.fileExists(file);
	return b;
}

Task.prototype.getExistsFileName = function(sourceFile) {
	var pathInfo = pathinfo(sourceFile);
	
	return this.targetDir + '/' + pathInfo.basename;
}

Task.prototype.startBuildSubdirs = function() {
	var i, SZ = sz(this.aSources), fileName;
	this.state = Task.STATE_BUILD_IN_PROCESS;
	for (i = 0; i < SZ; i++) {
		fileName = this.aSources[i];
		if (FS.isDir(fileName)) {
			this.buildOneDir(fileName);
		} else {
			this.taskManager.incSrcData(FS.filesize(fileName));
		}
	}
	this.state = Task.STATE_BUILD_COMPLETE;
}

Task.prototype.buildOneDir = function(dirname) {
	var i,
		a = FS.scandir(dirname),
		r = [],
		SZ = sz(a),
		sData = '',
		pathInfo,
		n = '\n';
	for (i = 0; i < SZ; i++) {
		if (a[i] != '.' && a[i] != '..') {
			r.push(dirname + '/' + a[i]);
		}
	}
	this.makeDir(dirname);
	pathInfo = pathinfo(dirname);
	
	sData = this.cmd + n;
	sData += this.targetDir + '/' + pathInfo.basename + n;
	sData += r.join(n);
	this.taskManager.createNewTask(sData);
	
}

Task.prototype.getCmd = function() {
	return this.cmd; // for windows cp -> copy etc
}

Task.prototype.isCompleted = function() {
	if (this.state == Task.STATE_COPY_ALL_COMPLETE) {
		return true;
	}
	return false;;
}
