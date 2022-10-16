function FManagerMCDialog() {
	this.name = 'FManagerMCDialog';
	this.init();
}
FManagerMCDialog.prototype.init = function() {
	this.pongManager = new PongManager();
	this.pongManager.run();
	
	this.uiManager = new McpUi();
	this.taskManager = new TaskManager(this.uiManager);
	
	
	this.slotManager = new SlotManager(this.taskManager);
	this.slotManager.run();
}

FManagerMCDialog.WND_WIDTH = 320;
FManagerMCDialog.WND_HEIGHT = 200;
