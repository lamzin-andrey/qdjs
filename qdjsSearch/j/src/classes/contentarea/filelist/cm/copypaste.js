function CopyPaste(tab) {
	this.tab = tab;
	this.lastAction = "";
}
CopyPaste.prototype.copyAction = function(targetId) {
	this.copycutAction("cp");
}
CopyPaste.prototype.cutAction = function(targetId) {
	this.copycutAction("mv");
}

CopyPaste.prototype.copycutAction = function(cmd) {
	var i, items = this.tab.oSelectionItems,  r = [], id, el;
	for (i in items) {
		id = i.replace('f', '');
		r.push(this.tab.currentPath + '/' + this.tab.list[id].name);
		if (cmd == "mv") {
			el = e(i);
			if (el) {
				stl(el, "opacity", 0.5);
				this.tab.cutItems.push(el);
			}
		}
	}
	
	if (sz(r)) {
		this.tab.bufferSources = r.join('\n');
		Qt.writeClipboard(this.tab.bufferSources);
	}
	
	this.lastAction = cmd;
}

CopyPaste.prototype.pasteAction = function(targetId) {
	if (this.lastAction == "") {
		return;
	}
	var o = this;
	if (this.tab.bufferSources) {
		this.message = this.lastAction + '\n' + this.tab.currentPath + '\n' + this.tab.bufferSources;
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
