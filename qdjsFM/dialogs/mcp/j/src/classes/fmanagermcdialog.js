function FManagerMCDialog() {
	this.name = 'FManagerMCDialog';
	this.init();
}
FManagerMCDialog.prototype.init = function() {
	this.pongManager = new PongManager();
	this.pongManager.run();
	
	this.taskManager = new TaskManager();	// TODO
	
	this.slotManager = new SlotManager(this.taskManager);	// TODO
	this.slotManager.run();						// TODO
}
