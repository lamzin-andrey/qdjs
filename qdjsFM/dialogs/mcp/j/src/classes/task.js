function Task(taskManager, cmd, targetDir, aSources) {
	this.name = 'Task';
	this.taskManager = taskManager;
	this.cmd = cmd;
	this.targetDir = targetDir;
	this.aSources = aSources;
}
// не вставляем ли в тот же каталог, в котором скопировали только что?
//  Также внутри исключить из вставляемых тот каталог, в который  возможно вставляем.
//	  (Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
// В этом случае invalid только если после исключения список сорсов пуст.
Task.prototype.isValid = function() {
	// не вставляем ли в тот же каталог, в котором скопировали только что?
	var i, SZ = sz(this.aSources), pathInfo, newSources = [];
	for (i = 0; i < SZ; i++) {
		pathInfo = pathinfo(this.aSources[i]);
		if (pathInfo.dirname == this.targetDir) {
			log('Invalid task data, вставляем ли в тот же каталог, в котором скопировали только что');
			return false;
		}
		
		// Например, выбрали три каталога, скопировали, вошли в один из них и выбрали Вставить)
		if (this.targetDir.indexOf(this.aSources[i]) != 0) {
			newSources.push(this.aSources[i]);
		}
	}
	
	this.aSources = newSources;
	
	if (!sz(this.aSources)) {
		return false;
	}
	
	return true;
}

Task.prototype.run = function() {
	
}
Task.prototype.onTick = function() {
	
}
