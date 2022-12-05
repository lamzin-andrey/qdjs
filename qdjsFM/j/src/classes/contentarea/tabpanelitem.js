function TabPanelItem(path, nType) {
	this.history = [];
	this.path = path;
	if (path) {
		if (sz(this.history) == 0) {
			this.history.push(path);
			this.historyIterator = 0;
		}
	}
	this.type = 1;
	if (nType) {
		this.type = nType;
	}
	
}
TabPanelItem.TYPE_CATALOG = 1;
TabPanelItem.TYPE_HTML = 2;


TabPanelItem.prototype.setPath = function(s) {
	this.path = s;
	if (sz(this.history) == 0) {
		this.history.push(s);
		this.historyIterator = 0;
	}
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
		if (this.path == '/') {
			return L("Filesystem");
		}
		return pathinfo(this.path).basename;
	}
	return '';
}

TabPanelItem.prototype.setView = function(btn, closeBtn) {
	this.btn = btn;
	this.closeBtn = closeBtn;
}

TabPanelItem.prototype.copyHistory = function() {
	this.history = mclone(app.tab.navbarPanelManager.history);
	this.historyIterator = app.tab.navbarPanelManager.historyIterator;
	// alert('copy History: ' + JSON.stringify(this.history));
}
TabPanelItem.prototype.restoreHistory = function() {
	// alert(JSON.stringify(this.history));
	app.tab.navbarPanelManager.history = mclone(this.history);
	app.tab.navbarPanelManager.historyIterator = this.historyIterator;
	app.tab.navbarPanelManager.actualizeView();
}
