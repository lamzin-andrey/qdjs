function CopyPaste(tab) {
	this.tab = tab;
}
CopyPaste.prototype.copyAction = function(targetId) {
	var i, items = this.tab.selectionItems, SZ = sz(items), r = [], id;
	for (i = 0; i < SZ; i++) {
		id = items[i].parentNode.id.replace('f', '');
		r.push(this.tab.currentPath + '/' + this.tab.list[id].name);
	}
	
	if (sz(r)) {
		this.tab.bufferSources = r.join('\n');
		Qt.writeClipboard(this.tab.bufferSources);
	}
}

CopyPaste.prototype.pasteAction = function(targetId) {
	var o = this;
	if (this.tab.bufferSources) {
		this.message = 'cp\n' + this.tab.currentPath + '\n' + this.tab.bufferSources;
		this.ival = setInterval(function() {
			o.onTick();
		}, 500);
		o.onTick();
	}
}

CopyPaste.prototype.onTick = function() {
	var file = window.app.copyPasteProc.getSlotFileName();
	
	if (!this.message) {
		this.stopTimer();
		return;
	}
	
	if (!FS.fileExists(file)) {
		this.stopTimer();
		FS.writefile(file, this.message);
		this.message = '';
	}
}

CopyPaste.prototype.stopTimer = function() {
	if (this.ival) {
		clearInterval(this.ival);
		this.ival = null;
	}
}
