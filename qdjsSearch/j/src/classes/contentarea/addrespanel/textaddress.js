function TextAddress(){
	var o = this;
	this.input = e('iAddressLine');
	this.container = e('addressContainer');
	this.placer = e('addressLine');
	this.icon = e('addressLineIcon');
	this.bReload = e('addressLineReloadIcon');
	
	this.mode = 1;
	
	this.bReload.onclick = function(){
		o.onClickReload();
	}
	this.input.addEventListener('keydown', function(evt){
		o.onKeyDown(evt);
		return true;
	});
	this.input.addEventListener('focus', function(evt){
		app.kbListener.activeArea = KBListener.AREA_ADDRESS_LINE;
	});	
}
TextAddress.MODE_SHORT = 0;
TextAddress.MODE_DEFAULT = 1;

TextAddress.prototype.onClickReload = function() {
	app.setActivePath(app.tab.currentPath, ['']);
}

TextAddress.prototype.setPath = function(s){
	this.input.value = s;
	if (s == '/home/' + window.USER) {
		this.icon.src = App.dir() + '/i/home32.png';
	} else if (s == '/') {
		this.icon.src = App.dir() + '/i/disk32.png';
	} else {
		this.icon.src = App.dir() + '/i/folder32.png';
	}
}

TextAddress.prototype.resize = function() {
	var 
		vpW = getViewport().w,
		w = (vpW - e('sidebarWrapper').offsetWidth - getScrollLineHeight());//this.container.offsetWidth;
	this.placer.style.width = (w - 10) + 'px';
	this.input.style.width = (w - 24 - this.icon.offsetWidth - this.bReload.offsetWidth) + 'px';
}

TextAddress.prototype.show = function() {
	this.placer.style.display = 'block';
	this.resize();
}
TextAddress.prototype.hide = function() {
	this.placer.style.display = 'none';
}
TextAddress.prototype.onKeyDown = function(evt) {
	var o = this;
	if (evt.keyCode == 13) {
		setTimeout(function(){
			var s = o.input.value;
			if (FS.fileExists(s) && FS.isDir(s)) {
				app.setActivePath(s, ['']);
				app.kbListener.activeArea = KBListener.AREA_TAB;
				o.input.blur();
				if (1 != intval(Settings.get('addressLineMode'))) {
					app.addressPanel.showButtonAddress();
					app.kbListener.activeArea = KBListener.AREA_TAB;
				}
			} else if (s.indexOf("http") == 0){
				app.tabPanel.addTabItem(s, TabPanelItem.TYPE_HTML);
				app.tab.setPath(s);
			}
		}, 10);
	}
	if (evt.keyCode == 27 && this.mode == TextAddress.MODE_SHORT) {
		this.mode = TextAddress.MODE_DEFAULT;
		if (1 != intval(Settings.get('addressLineMode'))) {
			app.addressPanel.showButtonAddress();
			app.kbListener.activeArea = KBListener.AREA_TAB;
		} else {
			evt.preventDefault();
		}
	}
	
	if (evt.ctrlKey && (86 == evt.keyCode || 1052 == MW.getLastKeyCode() ) ) {
		this.mode = TextAddress.MODE_DEFAULT;
		if (1 != intval(Settings.get('addressLineMode'))) {
			// app.addressPanel.showButtonAddress();
			app.kbListener.activeArea = KBListener.AREA_TAB;
		} else {
			evt.preventDefault();
		}
	}
}

TextAddress.prototype.setShortDisplayMode = function() {
	this.mode = TextAddress.MODE_SHORT;
}
TextAddress.prototype.focus = function() {
	this.input.focus();
	this.input.select();
}
