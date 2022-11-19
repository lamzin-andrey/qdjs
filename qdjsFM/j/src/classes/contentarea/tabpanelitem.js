function TabPanelItem(path) {
	this.history = [];
	this.path = path;
	this.type = 1;
}
TabPanelItem.TYPE_CATALOG = 1;


TabPanelItem.prototype.setPath = function(s) {
	this.path = s;
}

TabPanelItem.prototype.render = function() {
	var name = this.getName(), namePlace;
	if (name && this.btn) {
		namePlace = cs(this.btn, 'tabName')[0];
		if (namePlace) {
			namePlace.innerHTML = name;
		}
	}
}

TabPanelItem.prototype.getName = function() {
	if (this.path) {
		return pathinfo(this.path).basename;
	}
	return '';
}

TabPanelItem.prototype.setView = function(btn, closeBtn) {
	this.btn = btn;
	this.closeBtn = closeBtn;
}
