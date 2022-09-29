function CopyPasteProc(){}
CopyPasteProc.prototype.run = function() {
	this.isRun = false;
	this.slotDir = App.dir() + '/dialogs/mcp/sh';
	this.slotFileName = this.slotDir + '/slot';
	FS.writefile(this.slotDir + '/ping', time());
	var o = this;
	setTimeout(function(){
		o.checkPong();
	}, 2000);
}
CopyPasteProc.prototype.checkPong = function() {
	if (!FS.fileExists(this.slotDir + '/ping')) {
		this.isRun = true;
		return;
	}
	jexec(App.dir() + '/dialogs/mcp/qdjsFMmcp.sh', DevNull, DevNull, DevNull);
	this.isRun = true;
}

CopyPasteProc.prototype.getSlotFileName = function() {
	return this.slotFileName;
}
