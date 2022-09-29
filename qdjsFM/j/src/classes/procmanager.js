function ProcManager() {}
ProcManager.prototype.run = function() {
	window.app.listProc = new ListProc();
	window.app.listProc.run();
	window.app.hiddenListProc = new HiddenListProc();
	window.app.hiddenListProc.run();
	window.app.copyPasteProc = new CopyPasteProc();
	window.app.copyPasteProc.run();
}

