function FileManager() {
	this.bookmarksManager = new Bookmarks();
	this.tabPanel = new TabPanel();
	AppEnv.init([this, this.onGetActualEnv], [this, this.onGetSavedEnv]);
	this.devicesManager = new Devices();
	this.devicesManager.run();
	
	
	this.navbarPanelManager = new NavbarPanel();
	
	this.addressPanel = new AddressPanel();
	
}

/**
 * @param {String} path
 * @param {Array} aExcludes - идентификатор(ы) элементов управления, для которых не надо применять setPath
*/
FileManager.prototype.setActivePath = function(path, aExcludes) {
	var emitter = aExcludes[0];
	if (emitter != 'navbarPanelManager') {
		this.navbarPanelManager.setPath(path);
	}
	if (emitter != 'tab') {
		this.tab.setPath(path);
	}
	if (emitter != 'bookmarksManager') {
		this.bookmarksManager.setPath(path);
	}
	if (emitter != 'devicesManager') {
		this.devicesManager.setPath(path);
	}
}

FileManager.prototype.initActiveTab = function() {
	this.tab = this.tabPanel.getActiveTab();
}

/**
 * Вызывается когда получены последние данные об окружении AppEnv (USER, HOME и т. п)
*/
FileManager.prototype.onGetActualEnv = function() {
	if (!this.bookmarksManager.isRun()) {
		this.bookmarksManager.run();
		this.initActiveTab();
	} else {
		if (this.tab.getUser() != USER && USER != 'root') {
			this.bookmarksManager.setUser(USER);
			this.tab.setUser(USER);
		}
	}
}

/**
 * TODO Вызывается когда получены предварительно сохраненные данные об окружении AppEnv (USER, HOME и т. п)
*/
FileManager.prototype.onGetSavedEnv = function() {
	//console.log(this);
	this.bookmarksManager.setUser(AppEnv.config.USER);
	this.bookmarksManager.run();
	this.initActiveTab();
}

/**
 * TODO Изменяет размеры кнопок "строки адреса"
 * TODO Изменяет размеры табов
*/
FileManager.prototype.onResize = function() {
	
}
