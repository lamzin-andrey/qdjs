function SlotManager(taskManager) {
	this.name = 'SlotManager';
	this.taskManager = taskManager;
}
SlotManager.prototype.run = function() {
	var o = this;
	setInterval(function(){
		o.onTick();
	}, 1000);
}
SlotManager.prototype.onTick = function() {
	var slot = App.dir() + '/slot';
	if (FS.fileExists(slot)) {
		this.taskManager.createNewTask(FS.readfile(slot));
		FS.unlink(slot);
	}
}
