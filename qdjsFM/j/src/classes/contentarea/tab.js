function Tab() {
	this.username = '';
}

Tab.prototype.setPath = function(path) {
	alert('Tab get path ' + path);
}

Tab.prototype.setUser = function(s) {
	this.username = s;
}
