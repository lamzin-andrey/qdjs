function TaskManager(ui) {
	this.name = 'TaskManager';
	this.clearLog();
	this.ui = ui;
	this.progressManager = new ProgressManager(this, ui);
	this.progressManager.run();
	this.init();
}
TaskManager.prototype.init = function() {
	this.isRun = false;
	if (this.tasks) {
		this.tasks.length = 0;
	}
	this.tasks = [];
	this.buildListIterator = 0;
	this.cmdIterator = 0;
	this.cmd = '';
	
	this.srcBytesTotal = 0;
	this.srcFilesTotal = 0;
	this.destBytesTotal = 0;
	this.destFilesTotal = 0;
	this.aSrcFilesSz = [];
	this.aDestFilesSz = [];
	this.aFileExistsExpressions = [];
	this.aFileErrorExpressions = [];
	// replace
	this.bAlreadyReplace = false;
	// errors
	this.bConfirmRetry   = false;
	this.bAlreadyAbort   = false;
}
TaskManager.prototype.createNewTask = function(sData) {
	var i, a = sData.split('\n'), SZ = sz(a), targetDir, task;
	this.cmd = a[0];
	if (!(this.cmd in In(['cp', 'mv', 'rm']))) {
		log('Invalid command fort target dir ' + targetDir + '\nsData = ' + sData);
		return;
	}
	
	if (SZ < 3) {
		log('Invalid SZ fort target dir ' + targetDir + '\nsData = ' + sData);
		return;
	}
	
	
	targetDir = a[1];
	a.splice(0, 2);
	
	task = new Task(this, this.cmd, targetDir, a);
	
	
	if (task.isValid()) {
		log('Task valid and add');
		this.tasks.push(task);
		if (!this.isRun) {
			this.isRun = true;
			MW.minimize();
			setTimeout(function() {
				MW.showNormal();
			}, 100);
		}
		this.nextIteration();
	} else {
		log('Invalid task fort target dir ' + targetDir + '\nsData = ' + sData);
		if (this.allTaskCompleted()) {
			this.stop();
			return;
		}
	}
}

TaskManager.prototype.nextIteration = function() {
	var o = this;

	if (o.allTaskCompleted()) {
		o.stop();
		return;
	}
	
	o.tasks[o.buildListIterator].makeAction();
	

	o.buildListIterator++;
	if (o.buildListIterator > sz(o.tasks) - 1) {
		o.buildListIterator = 0;
	}
	setTimeout(function() {
		try {
			o.nextIteration();
		} catch (err) {
			log('TaskManager:nextIteration timer 87: ' + err);
		}
	}, 100);
}

TaskManager.prototype.allTaskCompleted = function() {
	var i, SZ = sz(this.tasks);
	for (i = 0; i < SZ; i++) {
		if (!this.tasks[i].isCompleted()) {
			return false;
		}
	}
	return true;
}

TaskManager.prototype.stop = function() {
	var i, SZ = sz(this.tasks);
	for (i = 0; i < SZ; i++) {
		delete this.tasks[i];
	}
	this.init();
	this.progressManager.stop();
	// TODO uncomment me! Qt.hide(); // TODO j.js MW+
	MW.minimize(); // TODO remove me
}
TaskManager.prototype.incSrcData = function(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) {
		return;
	}
	this.aSrcFilesSz.push(n);
}
TaskManager.prototype.incDestData = function(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) {
		return;
	}
	this.aDestFilesSz.push(n);
}

TaskManager.prototype.setFileExistsExpression = function(s) {
	var sp = ''
	this.aFileExistsExpressions.push(L('File') + sp + s + sp + L(' already exists. Overwrite?'));
}
/**
 * Если уже выбран Да, для всех, вернуть true;
 * Иначе вернуть confirm
**/
TaskManager.prototype.confirmReplace = function() {
	if (this.bAlreadyReplace) {
		return true;
	}
	var fe = this.aFileExistsExpressions.pop();
	if (fe) {
		this.bAlreadyReplace = confirm(fe);
		return this.bAlreadyReplace;
	}
	
	return false;
}

TaskManager.prototype.setFileErrorExpression = function(s) {
	var sp = ''
	this.aFileErrorExpressions.push(L('Can not copy file') + sp + s + sp + L('. Choose Yes for retry, choose No for skip it and all similar.'));
}

TaskManager.prototype.confirmAbort = function() {
	if (this.bAlreadyAbort) {
		return true;
	}
	var fe = this.aFileErrorExpressions.pop();
	if (fe) {
		this.bAlreadyAbort = !confirm(fe);
		this.bConfirmRetry = !this.bAlreadyAbort;
		return this.bAlreadyAbort;
	}
	
	return false;
}

TaskManager.prototype.confirmRetry = function() {
	return this.bConfirmRetry;
}

TaskManager.prototype.getSrcSize = function() {
	return array_sum(this.aSrcFilesSz);
}

TaskManager.prototype.getDestSize = function() {
	return array_sum(this.aDestFilesSz);
}


TaskManager.prototype.log = function(s) {
	FS.writefile(App.dir() + '/log.log', date('Y-m-d H:i:s') + ' ' + s + "\n", FILE_APPEND);
}
TaskManager.prototype.clearLog = function() {
	FS.writefile(App.dir() + '/log.log', "");
}
