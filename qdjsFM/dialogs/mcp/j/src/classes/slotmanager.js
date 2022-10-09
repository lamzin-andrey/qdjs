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
	var slot = App.dir() + '/sh/slot';
	if (FS.fileExists(slot)) {
		// log('Slot: file exists. Will createtask from:' + FS.readfile(slot));
		try {
			this.taskManager.createNewTask(FS.readfile(slot));
		} catch (err) {
			alert('SlotMgr onTuck: ' + err);
		}
		FS.unlink(slot);
	}
}
