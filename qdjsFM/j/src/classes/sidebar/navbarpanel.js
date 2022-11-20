function NavbarPanel() {
	var o = this;
	o.btnUp   = e('btnUp');
	o.btnBack = e('btnBack');
	o.btnFwd  = e('btnFwd');
	o.btnHome = e('btnHome');
	
	o.setDisabled(this.btnUp);
	o.setDisabled(this.btnBack);
	o.setDisabled(this.btnFwd);
	o.setDisabled(this.btnHome);
	
	o.history = [];
	o.historyIterator = -1;
	
	o.btnHome.onclick = function(evt) {
		o.onClickHome(evt);
	}
	o.btnUp.onclick = function(evt) {
		try  {
			o.onClickUp(evt);
		} catch(err) {
			alert(err);
		}	
	}
	o.btnFwd.onclick = function(evt) {
		o.onClickFwd(evt);
	}
	o.btnBack.onclick = function(evt) {
		try {
			o.onClickBack(evt);
		}catch(err) {
			alert(err);
		}
	}
}
NavbarPanel.prototype.setDisabled = function(img) {
	var s = img.src;
	console.log(s);
	if (s.indexOf('32d.png') == -1) {
		s = s.replace('32.png', '32d.png');
		attr(img, 'src', s);
		img.isDisabled = true;
	}
}
NavbarPanel.prototype.setEnabled = function(img) {
	var s = img.src;
	if (s.indexOf('32.png') == -1) {
		s = s.replace('32d.png', '32.png');
		attr(img, 'src', s);
		img.isDisabled = false;
	}
}
/**
 * Важно, никогда не вызывать здесь другие setPath
*/
NavbarPanel.prototype.setPath = function(path) {
	var s = path;
	this.history.push(s);
	this.historyIterator = sz(this.history) - 1;
	
	this.checkUpButtonState(s);
	this.checkHomeButtonState(s);
	this.checkHistoryNavButtonsState(s);
}
NavbarPanel.prototype.checkUpButtonState = function(path) {
	if ('/' == path) {
		this.setDisabled(this.btnUp);
	} else {
		this.setEnabled(this.btnUp);
	}
}
NavbarPanel.prototype.checkHomeButtonState = function(path) {
	if (USER && path == '/home/' + USER) {
		this.setDisabled(this.btnHome);
	} else {
		this.setEnabled(this.btnHome);
	}
}
NavbarPanel.prototype.checkHistoryNavButtonsState = function(path) {
	var SZ = sz(this.history);
	if (SZ == 0) {
		this.setDisabled(this.btnBack);
		this.setDisabled(this.btnFwd);
	} else {
		if (this.historyIterator == SZ - 1) {
			this.setDisabled(this.btnFwd);
		} else {
			this.setEnabled(this.btnFwd);
		}
		if (this.historyIterator == 0) {
			this.setDisabled(this.btnBack);
		} else {
			this.setEnabled(this.btnBack);
		}
	}
}

NavbarPanel.prototype.onClickFwd = function(evt) {
	var n = this.historyIterator + 1, s;
	if (n <= sz(this.history) - 1) {
		this.historyIterator++;
		s = this.history[this.historyIterator];
		app.setActivePath(s, ['navbarPanelManager']);
		this.checkUpButtonState(s);
		this.checkHomeButtonState(s);
		this.checkHistoryNavButtonsState(s);
	}
}
NavbarPanel.prototype.onClickBack = function(evt) {
	var n = this.historyIterator - 1, s;
	if (n > - 1) {
		this.historyIterator--;
		s = this.history[this.historyIterator];
		app.setActivePath(s, ['navbarPanelManager']);
		this.checkUpButtonState(s);
		this.checkHomeButtonState(s);
		this.checkHistoryNavButtonsState(s);
	}
}

NavbarPanel.prototype.onClickUp = function(evt) {
	var s = this.history[this.historyIterator],
		a;
	
	a = s.split('/');
	a.splice(sz(a) - 1, 1);
	if (sz(a) > 1) {
		s = a.join('/');
	} else {
		s = '/';
	}
	
	
	app.setActivePath(s, ['']);
}

NavbarPanel.prototype.onClickHome = function(evt) {
	var path = '/home/' + window.USER;
	if (this.btnHome.isDisabled || !USER) {
		return true;
	}
	
	app.setActivePath(path, ['']);
}

NavbarPanel.prototype.clearHistory = function(s) {
	var o = this;
	this.actualizeView(s);
	
	o.history = [];
	o.history.push(s);
	o.historyIterator = 0;
}

NavbarPanel.prototype.actualizeView = function(s) {
	var o = this;
	if (this.historyIterator == -1) {
		return;
	}
	if (!s) {
		s = this.history[this.historyIterator];
	}
	o.setDisabled(this.btnUp);
	o.setDisabled(this.btnBack);
	o.setDisabled(this.btnFwd);
	o.setDisabled(this.btnHome);
	
	if (s != '/home/' + USER) {
		o.setEnabled(this.btnHome);
	}
	if (s != '/') {
		o.setEnabled(this.btnUp);
	}
	
	if (this.historyIterator < sz(this.history) - 1) {
		o.setEnabled(this.btnFwd);
	}
	if (this.historyIterator > 0) {
		o.setEnabled(this.btnBack);
	}
}
