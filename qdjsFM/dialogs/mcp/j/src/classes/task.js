function Task(taskManager, cmd, targetDir, aSources) {
	this.name = 'Task';
	this.taskManager = taskManager;
	this.cmd = cmd;
	this.targetDir = targetDir;
	this.aSources = aSources;	
	this.state = Task.STATE_BUILD_NO_START;
	this.copyIterator = -1;
	this.duplicates = {};
}
Task.ACTION_TYPE_BUILD = 1;
Task.ACTION_TYPE_COPY  = 2;

Task.STATE_BUILD_NO_START  = 1;
Task.STATE_BUILD_IN_PROCESS  = 2;
Task.STATE_BUILD_COMPLETE  = 3;
Task.STATE_COPY_NO_START  = 4;
Task.STATE_COPY_IN_PROGRESS  = 5;
Task.STATE_COPY_ALL_COMPLETE  = 6;
Task.STATE_POST_COPY_TRIGGERS  = 7;
Task.STATE_COPY_ALL_TRIGGERS_COMPLETE  = 8;


Task.prototype.makeAction = function() {
	switch (this.state) {
		case Task.STATE_BUILD_NO_START:
			this.startBuildSubdirs();
			break;
		case Task.STATE_BUILD_COMPLETE:
			this.startCopy();
			break;
		case Task.STATE_POST_COPY_TRIGGERS:
			this.startPostCopyTriggers();
			break;
	}
}
// не вставляем ли в тот же каталог, в котором скопировали только что?
//  Также внутри исключить из вставляемых тот каталог, в который  возможно вставляем.
//	  (Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
// В этом случае invalid только если после исключения список сорсов пуст.
Task.prototype.isValid = function() {
	
	var i, SZ = sz(this.aSources), pathInfo, newSources = [];
	for (i = 0; i < SZ; i++) {
		// Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
		if (this.targetDir.indexOf(this.aSources[i]) != 0) {
			newSources.push(this.aSources[i]);
		}
	}
	
	// не вставляем ли в тот же каталог, в котором скопировали только что?
	for (i = 0; i < SZ; i++) {
		pathInfo = pathinfo(this.aSources[i]);
		if (pathInfo.dirname == this.targetDir) {
			// return false;
			this.calculateCopyName(newSources, i, pathInfo);
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
	var o = this;
	if (this.state == Task.STATE_COPY_IN_PROGRESS || this.taskManager.cpState == Task.STATE_COPY_IN_PROGRESS) {
		return;
	}
	if (this.isCopyCmd()) {
		MW.setTitle("Copy files");
	} else {
		MW.setTitle("Move files");
	}
	this.state = Task.STATE_COPY_IN_PROGRESS;
	this.taskManager.cpState = Task.STATE_COPY_IN_PROGRESS;
	var i, SZ = sz(this.aSources),
		doWhile,
		cmd;
	this.copyIterator++;
	doWhile = FS.isDir(this.aSources[this.copyIterator] /*&& !this.duplicates[this.aSources[this.copyIterator]]*/ ) && this.copyIterator < SZ;
	while (doWhile) {
		this.copyIterator++;
		doWhile = FS.isDir(this.aSources[this.copyIterator]) /*&& !this.duplicates[this.aSources[this.copyIterator]]*/ && this.copyIterator < SZ;
	}
	
	if (this.copyIterator >= SZ) {
		this.currentFile = '';
		this.setStateOperationComplete();
		this.taskManager.cpState = 0;
		return;
	}
	this.currentFile = this.aSources[this.copyIterator];
	if (this.destFileExists(this.currentFile) && !this.duplicates[this.currentFile]) {
		this.taskManager.setFileExistsExpression(this.getExistsFileName(this.currentFile));
		if (!this.taskManager.confirmReplace()) {
			this.state = Task.STATE_BUILD_COMPLETE;
			this.taskManager.cpState = 0;
			this.startCopy();
			return;
		}
	}
	
	
	this.taskManager.progressManager.setCurrentFile(this.aSources[this.copyIterator], this.getExistsFileName(this.aSources[this.copyIterator]));
	cmd = '#!/bin/bash\n' + this.getCmd() + ' "' + this.aSources[this.copyIterator] + '" "' + this.targetDir + '"';
	if (this.duplicates[this.currentFile]) {
		
		cmd = '#!/bin/bash\n' + this.getCmd() + ' "' + this.aSources[this.copyIterator] + '" "' + this.duplicates[this.currentFile] + '"';
		if (FS.isDir(this.currentFile)) {
			// cmd = '#!/bin/bash\n' + this.getCmd() + ' -r "' + this.aSources[this.copyIterator] + '" "' + this.duplicates[this.currentFile] + '"';
			log('It no need, but it was! directory in list files for cp! ');
			return;
		}
	}
	// log(cmd);
	this.lastCmdFile = App.dir() + '/sh/cp.sh';
	
	FS.writefile(this.lastCmdFile, cmd);
	jexec(this.lastCmdFile, [this, this.onFinishCopy], [this, this.onStdOutCopy], [this, this.onErrCopy]);
	setTimeout(function(){
		o.taskManager.cpState = 0;
	}, 10);
	
}

Task.prototype.makeDir = function(dirName) {
	var pathInfo = pathinfo(dirName), newDir;
	dirName = pathInfo.basename;
	if (!FS.fileExists(this.targetDir + '/' + dirName)) {
		FS.mkdir(this.targetDir + '/' + dirName);
		return this.targetDir + '/' + dirName;
	} else {
		newDir = this.calculateCopyDirName(this.targetDir + '/' + dirName);
		FS.mkdir(newDir);
		return newDir;
	}
}

Task.prototype.onErrCopy = function(stderr) {
	/*if (!this.isCopyCmd()) {
		this.taskManager.incDestData(1024);
	}*/
	this.taskManager.setFileErrorExpression(this.currentFile);
	if (!this.taskManager.confirmAbort()) {
		if (this.taskManager.confirmRetry()) {
			this.copyIterator--;
		}
		this.startCopy();
	} else {
		this.setStateOperationComplete();
	}
}

Task.prototype.onStdOutCopy = function(stdout) {
	log('Task::onStdOutCopy ' + stdout);
}

Task.prototype.onFinishCopy = function(stdout, stderr) {
	var pathInfo = pathinfo(this.currentFile),
		destFile = this.targetDir + '/' + pathInfo.basename;
	if (this.isCopyCmd()) {
		destFile = this.currentFile;
	}
	if (stderr) {
		log('Task::Fin onErrCopy ' + stderr);
	}
	if (stdout) {
		log('Task::Fin onSOCopy ' + stdout);
	}
	
	this.taskManager.incDestData(FS.filesize(destFile));
	// log('Complete ' + this.currentFile);
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
	var i, SZ = sz(this.aSources), fileName, pathInfo;
	this.state = Task.STATE_BUILD_IN_PROCESS;
	for (i = 0; i < SZ; i++) {
		try {
			fileName = this.aSources[i];
			if (FS.isDir(fileName)) {
				// иначе при копировании вложенного каталога в тот же каталог происходит копирование вложенных в нго файлов в сам себя.
				// но нам это не надо pathInfo = pathinfo(fileName);
				// if (pathInfo.dirname != this.targetDir) {
					this.buildOneDir(fileName);
				// }
			} else {
				this.taskManager.incSrcData(FS.filesize(fileName));
			}
		} catch (err) {
			alert('Task::startBuildSubdirs ' + err);
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
	
	dirname = this.makeDir(dirname);
	pathInfo = pathinfo(dirname);
	
	sData = this.cmd + n;
	sData += this.targetDir + '/' + pathInfo.basename + n;
	sData += r.join(n);
	this.taskManager.createNewTask(sData);
	
}

Task.prototype.getCmd = function() {
	return this.cmd; // for windows cp -> copy etc
}
Task.prototype.isCopyCmd = function() {
	if (this.getCmd() == 'cp') { // for windows cp -> copy etc
		return true;
	}
	return false;
}

Task.prototype.isCompleted = function() {
	if (this.state == Task.STATE_COPY_ALL_COMPLETE) {
		return true;
	}
	return false;
}

Task.prototype.isPostTriggerCompleted = function() {
	if (this.state == Task.STATE_COPY_ALL_TRIGGERS_COMPLETE) {
		return true;
	}
	return false;
}

Task.prototype.setStateOperationComplete = function() {
	this.state = Task.STATE_COPY_ALL_COMPLETE;
}

Task.prototype.startPostCopyTriggers = function() {
	var i, SZ = sz(this.aSources), sub, cmd, sh = App.dir() + '/sh/cp.sh',
		notDeleted = 0;
	for (i = 0; i < SZ; i++) {
		if (!FS.fileExists(this.aSources[i])) {
			continue;
		}
		if (FS.isDir(this.aSources[i])) {
			notDeleted++;
			sub = FS.scandir(this.aSources[i]);
			if (sub.length == 2) {
				cmd = "#!/bin/bash\nrm -rf \"" + this.aSources[i] + '"';
				FS.writefile(sh, cmd);
				jexec(sh, DevNull, DevNull, DevNull);
			}
		}
	}
	
	if (notDeleted == 0) {
		this.state = Task.STATE_COPY_ALL_TRIGGERS_COMPLETE;
	}
}


Task.prototype.calculateCopyName = function(newSources, i, pathInfo) {
	var path = newSources[i],
		dirname = pathInfo.dirname,
		srcPath = newSources[i],
		n = 1,
		SZ = sz(newSources[i]),
		oVal = {base: '', n:1};

	if (FS.isDir(path)) {
		return;
	}

	while (FS.fileExists(path)) {
		if (this.isCopyname(path, oVal) ) {
			if (pathInfo.basename == pathInfo.filename) {
				path = dirname + '/' + oVal.base + ' (' + (intval(oVal.n)) + ')';
			} else {
				path = dirname + '/' + oVal.base + ' (' + (intval(oVal.n)) + ').' + pathInfo.extension;
			}
		} else {
			if (pathInfo.basename == pathInfo.filename) {
				path = dirname + '/' + pathInfo.filename + ' (' + (n + 1) + ')';
			} else {
				path = dirname + '/' + pathInfo.filename + ' (' + (n + 1) + ').' + pathInfo.extension;
				n++;
			}
		}
	}
	this.duplicates[srcPath] = path;
}

Task.prototype.calculateCopyDirName = function(dirname) {
	var path = dirname, // newSources[i],
		pathInfo,
		// dirname = pathInfo.dirname,
		// srcPath = newSources[i],
		n = 1,
		oVal = {base: '', n:1};
	pathInfo = pathinfo(dirname);
	while (FS.fileExists(path)) {
		if (this.isCopyname(path, oVal) ) {
			if (pathInfo.basename == pathInfo.filename) {
				path = pathInfo.dirname + '/' + oVal.base + ' (' + (intval(oVal.n)) + ')';
			}
		} else {
			if (pathInfo.basename == pathInfo.filename) {
				path = pathInfo.dirname + '/' + pathInfo.filename + ' (' + (n + 1) + ')';
				n++;
			}
		}
	}
	return path;
}

/**
 * @param oVal {base: '', n: 1}
 * */
Task.prototype.isCopyname = function(s, oVal) {
	var i, SZ, base = '', n = [], ch, isNum = 0, pathInfo;
	s = strval(s);
	pathInfo = pathinfo(s);
	s = pathInfo.filename;
	SZ = sz(s);
	if (s.charAt(SZ - 1) != ')') {
		return 0;
	}
	for (i = SZ - 2; i > -1; i--) {
		ch = s.charAt(i);
		isNum = is_numeric(ch);
		if (!isNum && ch != '(') {
			return 0;
		}
		if (ch == '(') {
			n.reverse();
			oVal.n = intval(n.join('')) + 1;
			oVal.base = s.substring(0, i).trim();
			return 1;
		}
		n.push(ch);
	}
	
	return 0;
}
