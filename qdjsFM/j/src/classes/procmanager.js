function ProcManager() {}
ProcManager.prototype.run = function() {
	window.app.copyPasteProc = new CopyPasteProc();
	window.app.copyPasteProc.run();
}

