function TaskManager() {
	this.name = 'TaskManager';
	this.init();
}
TaskManager.prototype.init = function() {
	this.clearLog();
	this.isRun = false;
	this.tasks = [];
	this.buildListIterator = 0;
	this.cmdIterator = 0;
	this.cmd = '';
	
	this.srcBytesTotal = 0;
	this.srcFilesTotal = 0;
	this.destBytesTotal = 0;
	this.destFilesTotal = 0;
}
TaskManager.prototype.createNewTask = function(sData) {
	var i, a = sData.split(sData), SZ = sz(a), targetDir, task;
	this.cmd = a[0];
	if (!(this.cmd in In(['cp', 'mv', 'rm']))) {
		this.log('Exit because cmd = ' + this.cmd);
		return;
	}
	
	if (SZ < 3) {
		this.log('Exit because sData = ' + sData);
		return;
	}
	
	targetDir = a[1];
	a.splice(0, 2);
	
	task = new Task(this, this.cmd, a[1], a);
	
	if (task.isValid()) {
		this.tasks.push(task);
		if (!this.isRun) {
			this.isRun = true;
			MW.showNormal();
			this.nextIteration();
		}
	}
}

TaskManager.prototype.nextIteration = function() {
	var o = this;
	
	if (o.allTaskCompleted()) {
		o.stop();
		return;
	}
	
	o.tasks[o.buildListIterator].makeAction(); // Task.makeAction() TODO
	o.buildListIterator++;
	if (o.buildListIterator > sz(o.tasks) - 1) {
		o.buildListIterator = 0;
	}
	setTimeout(function() {
		o.nextIteration();
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
	this.tasks.length = 0;
	this.srcBytesTotal = 0;
	this.srcFilesTotal = 0;
	this.destBytesTotal = 0;
	this.destFilesTotal = 0;
	this.isRun = false;
	MW.hide();
}

TaskManager.prototype.log = function(s) {
	FS.writefile(App.dir() + '/log.log', date('Y-m-d H:i:s') + s + "\n", FILE_APPEND);
}
TaskManager.prototype.clearLog = function() {
	FS.writefile(App.dir() + '/log.log', "");
}
