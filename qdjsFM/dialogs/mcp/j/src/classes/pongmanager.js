function PongManager() {
	this.name = 'PongManager';
}
PongManager.prototype.run = function() {
	var o = this;
	setInterval(function() {
		o.onTick();
	}, 1000);
}
PongManager.prototype.onTick = function() {
	var path = App.dir() + '/sh/ping';
	if (FS.fileExists(path)) {
		FS.unlink(path);
	}
}
