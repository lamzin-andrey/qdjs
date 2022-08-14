function AbstractListProc() {}
AbstractListProc.prototype.run = function() {
	this.isRun = false;
	var homeDir = '/home/' + USER,
		procName = this.getProcName(),
		workDir = App.dir() + '/sh/' + procName,
		testDir = homeDir,
		currentDirContent = '',
		o = this;
	
	// check run daemon
	this.sourceCurrentDirContent = currentDirContent;
	if (FS.fileExists(workDir + '/' + procName + '.inp')) {
		currentDirContent = FS.readfile(workDir + '/' + procName + '.inp');
		this.sourceCurrentDirContent = currentDirContent;
		currentDirContent = currentDirContent.replace(/\/$/mig, '');
	}
	if (currentDirContent && currentDirContent == homeDir) {
		testDir = '/usr';
	}
	FS.writefile(workDir + '/' + procName + '.inp', testDir);
	this.workDir = workDir;
	this.testDir = testDir;
	setTimeout(function() {
		o.onDataForCheckRun();
	}, 2 * 1000);
}

AbstractListProc.prototype.onDataForCheckRun = function() {
	var procName = this.getProcName(),
		line = FS.readfile(this.workDir + '/' + procName + '.out').split('\n')[0].trim(),
		tpl, s, cmd = this.workDir + '/' + procName + '.sh';
	line = line.replace(/\/$/mig, '');
	if (this.sourceCurrentDirContent) {
		FS.writefile(this.workDir + '/' + procName + '.inp', this.sourceCurrentDirContent);
	}
	if (line != 'BOF ' + this.testDir) {
		alert('Will run! ex = ' + this.testDir + ', got ' + line);
		// run daemon
		tpl = FS.readfile(App.dir() + '/sh/' + procName + '/' + procName + '.sh.tpl');
		s = tpl.replace('{daemonDir}', App.dir() + '/sh/' + procName);
		FS.writefile(cmd, s);
		this.procId = jexec(cmd, DevNull, DevNull, DevNull)[1];
	}
	this.isRun = true;
}

AbstractListProc.prototype.write = function(path) {
	if (!this.isRun) {
		return;
	}
	var procName = this.getProcName();
	FS.writefile(this.workDir + '/' + procName + '.inp', path);
}

AbstractListProc.prototype.read = function(path, dbg) {
	if (!this.isRun) {
		return '';
	}
	var procName = this.getProcName(),
		ls, first, last;
	ls = FS.readfile(this.workDir + '/' + procName + '.out').split('\n');
	first = ls[0].trim();
	last = ls[sz(ls) - 2].trim();
	if (dbg){
		alert(first);
		alert(last);
	}
	if (first == ('BOF ' + path) && last == ('EOF ' + path)) {
		ls.splice(0, 1);
		ls.splice(sz(ls) - 2, 1);
		last = ls.join('\n');
		if (dbg){
			alert(last);
		}
		return last;
	}
	
	return '';
}
