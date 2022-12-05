function TabPanel() {
	var o = this;
	this.tabs = [];
	this.activeIndex = -1;
	
	e('tabsNavRight').onclick = function(evt) {
		try {
			return o.onClickRightButton(evt);
		} catch (err) {
			alert(err);
		}
	}
	
	e('tabsNavLeft').onclick = function(evt) {
		try {
			return o.onClickLeftButton(evt);
		} catch (err) {
			alert(err);
		}
	}
}

TabPanel.prototype.getActiveTab = function() {
	if (this.activeIndex == -1) {
		this.tabs.push(new TabPanelItem(''));
		this.activeIndex = 0;
		this.tab = new Tab();
		this.tab.setTabItem(this.tabs[this.activeIndex]);
	}
	
	return this.tab;
}

TabPanel.prototype.getActiveTabItem = function() {
	if (this.activeIndex == -1) {
		this.tabs.push(new TabPanelItem(''));
		this.activeIndex = 0;
		if (!this.tab) {
			this.tab = new Tab();
		}
		this.tab.setTabItem(this.tabs[this.activeIndex]);
	}
	
	return this.tabs[this.activeIndex];
}


TabPanel.prototype.setPath = function(s) {
	if (!this.tabsData) {
		this.render();
	}
	var tabItem = this.tabs[this.activeIndex], i, SZ = sz(this.dataForRender);
	
	tabItem.setPath(s);
	tabItem.render();
	for (i = 0; i < SZ; i++) {
		if (this.dataForRender[i].idx == this.activeIndex) {
			this.dataForRender[i].name = tabItem.getName();
			this.dataForRender[i].path = s;
			break;
		}
	}
	this.render(mclone(this.dataForRender));
}

TabPanel.prototype.addTabItem = function(s, tabType) {
	// alert('Add tab item type ' + tabType);
	var tabItem;
	this.getActiveTab();
	tabItem = new TabPanelItem(s, tabType);
	this.tabs.splice(this.activeIndex + 1, 0, tabItem);
	
	try {
		this.tabs[this.activeIndex].copyHistory();
		app.tab.navbarPanelManager.clearHistory(s);
	} catch (err) {
		alert(err);
	} 
	this.activeIndex++;
	if (!this.tab) {
		this.tab = new Tab();
	}
	this.render();
	this.tab.setTabItem(this.tabs[this.activeIndex]);
	// tabItem.render(); ?
}

TabPanel.prototype.render = function(altDataForRender) {
	var tabsWidth, placeWidth, n = 0;
	this.initTabsData();
	placeWidth = this.setPlacerWidth();
	if (!altDataForRender) {
		this.dataForRender = mclone(this.tabsData);
	} else {
		this.dataForRender = mclone(altDataForRender);
	}
	tabsWidth = this.renderTabs();
	while (tabsWidth > placeWidth && sz(this.dataForRender) > 3) {
		n++;
		if (!altDataForRender) {
			this.dataForRender = mclone(this.tabsData);
		} else {
			this.dataForRender = mclone(altDataForRender);
		}
		this.trimLeft(this.dataForRender, n);
		tabsWidth = this.renderTabs();
	}
	if (!altDataForRender) {
		this.nDisplayedTabs = sz(this.tabsData) - n;
		this.nRightTab = sz(this.tabsData);
	} else {
		this.nDisplayedTabs = sz(altDataForRender) - n;
	}
	this.renderTabs(true);
}


TabPanel.prototype.renderTabs = function(noAll){
	var a = this.dataForRender, i, SZ = sz(a), j,
		tpl = '<div class="tabName">{name}</div>\
					<div class="tabClose">\
						<img id="tabc{id}" data-idx="{idx}" class="pointer imgBtnTabClose" src="' + App.dir() + '/i/tabClose.png">\
					</div>', s,
		parent = e('tabsPlacer'),
		btn, w = 0, o = this, closeBtn, elPrps;
	parent.innerHTML = "";
	for (i = 0, j = this.nRightTab - this.nDisplayedTabs; i < SZ; i++, j++) {
		s = tpl.replace("{name}", a[i].name);
		s = str_replace('{id}', j, s);
		s = str_replace('{idx}', a[i].idx, s);
		
		if (!noAll) {
			parent.innerHTML = "";
		}
		
		elPrps = {
			"class": "tab" + (a[i].idx == this.activeIndex ? ' active' : ''),
			"id": ("tab" + j),
			"data-idx": a[i].idx,
			"title" : (a[i].path ? a[i].path : '')
		};
		if (a[i].type == TabPanelItem.TYPE_HTML) {
			elPrps['data-cmid'] = "cmTabHtml";
		}
		
		btn = appendChild(parent, "div", s, elPrps);
		
		btn.onclick = function(evt){
			return o.onClickButton(evt);
		}
		
		closeBtn = e('tabc' + j);
		closeBtn.onclick = function(evt){
			return o.onClickCloseButton(evt);
		}
		
		this.tabs[a[i].idx].setView(btn, closeBtn);
		
		w += btn.offsetWidth;
	}
	
	return w;
}

TabPanel.prototype.setPlacerWidth = function() {
	return e('tabsContainer').offsetWidth  - 30; // 30 == left right buttons width
}

TabPanel.prototype.initTabsData = function() {
	var i, SZ = sz(this.tabs), item;
	this.tabsData = [];
	for (i = 0; i < SZ; i++) {
		item = {
			path: this.tabs[i].path,
			name: this.tabs[i].getName(),
			idx: i,
			type: this.tabs[i].type
		};
		this.tabsData.push(item);
	}
}

TabPanel.prototype.trimLeft = function(a, n){
	app.addressPanel.buttonAddress.trimLeft(a, n);
}

TabPanel.prototype.onClickButton = function(evt){
	var trg = ctrg(evt), id = trg.id, idx = attr(trg, 'data-idx'), 
		i,
		ls = cs('tabsPlacer', 'tab'),
		SZ = sz(ls),
		safeScrollY;
	// alert('idx = ' + idx + ' id = ' + id);
	this.tabs[this.activeIndex].copyHistory();
	if (hasClass(evt.target, 'imgBtnTabClose')) {
		return true;
	}
	this.tabs[this.activeIndex].scrollY = app.tab.getScrollY();
	this.tabs[this.activeIndex].listCopy = mclone(app.tab.list);
	this.tabs[this.activeIndex].listHCopy = mclone(app.tab.hideList);
	
	
	for (i = 0; i < SZ; i++) {
		if (hasClass(ls[i], 'active')) {
			removeClass(ls[i], 'active');
		}
	}
	addClass(id, 'active');
	app.tab.setTabItem(this.tabs[idx]);
	if (this.tabs[idx].type == 1) {
		show('addressButtonPlacer');
		show('tabContentHeadersWr');
	}
	
	if (this.tabs[idx].listCopy) {
		app.tab.skipRequestList = this.tabs[idx].listCopy;
		app.tab.skipRequestHList = this.tabs[idx].listHCopy;
	}
	app.setActivePath(this.tabs[idx].path, ["tabpanel"]);
	
	this.activeIndex = idx;
	this.tabs[idx].restoreHistory();
	safeScrollY = this.tabs[this.activeIndex].scrollY;
	// MW.setTitle('safeScrollY = ' + safeScrollY);
	setTimeout(function(){
		if (safeScrollY) {
			app.tab.setScrollY(safeScrollY);
		}
	}, 100);
	
	
	
	return true;
}

TabPanel.prototype.onClickCloseButton = function(evt){
	evt.preventDefault();
	var trg = ctrg(evt), id = trg.id, idx = attr(trg, 'data-idx'), SZ = sz(this.tabs);
	if (SZ - 1 == 0) {
		MW.close();
		return;
	}
	rm(id);
	this.tabs.splice(idx, 1);
	if (idx <= this.activeIndex) {
		this.activeIndex--;
	} else {
	}
	this.render();
	app.tab.setTabItem(this.tabs[this.activeIndex]);
	app.setActivePath(this.tabs[this.activeIndex].path, ['']);
	if (this.tabs[this.activeIndex].type == 1) {
		app.addressPanel.show();
	}
	show('tabContentHeadersWr');
}


TabPanel.prototype.onClickLeftButton = function(evt) {
	var i, start, end;
	
	this.dataForRender = [];
	if (this.nRightTab < this.nDisplayedTabs) {
		this.nRightTab = this.nDisplayedTabs;
	}
	start = this.nRightTab - this.nDisplayedTabs;
	start = start < 0 ? 0 : start;
	end = start + this.nDisplayedTabs;
	// alert(start + ', ' + end);
	for (i = start; i < end; i++) {
		if (this.tabsData[i].path == app.tab.currentPath) {
			this.tabsData[i].addClass = 'active';
		} else {
			this.tabsData[i].addClass = '';
		}
		this.dataForRender.push(this.tabsData[i]);
	}
	this.nRightTab--;
	// this.renderTabs(true);
	this.render(mclone(this.dataForRender));
}

TabPanel.prototype.onClickRightButton = function(evt) {
	var i, start, end;
	this.nRightTab++;
	this.dataForRender = [];
	if (this.nRightTab >= sz(this.tabsData)) {
		this.nRightTab = sz(this.tabsData) - 1;
	}
	start = this.nRightTab - this.nDisplayedTabs + 1;
	end = start + this.nDisplayedTabs;
	// alert(start + ', ' + end);
	for (i = start; i < end; i++) {
		if (this.tabsData[i].path == app.tab.currentPath) {
			this.tabsData[i].addClass = 'active';
		} else {
			this.tabsData[i].addClass = '';
		}
		this.dataForRender.push(this.tabsData[i]);
	}
	// this.renderTabs(true);
	this.render(mclone(this.dataForRender));
}

TabPanel.prototype.onClickUtf8 = function(evt) {
	this.setHtmlTabEncoding("UTF-8");
}
TabPanel.prototype.onClickWindows1251 = function(evt) {
	this.setHtmlTabEncoding("WINDOWS-1251");
}
TabPanel.prototype.onClickKOI8R = function(evt) {
	this.setHtmlTabEncoding("KOI8-R");
}
TabPanel.prototype.onClickOther = function(evt) {
	var s = prompt(L("Enter encoding"));
	if (s) {
		this.setHtmlTabEncoding(s);
	}
}
TabPanel.prototype.setHtmlTabEncoding = function(enc) {
	var tab = this.tabsData[this.activeIndex];
	if (tab.type == TabPanelItem.TYPE_HTML && app.currentHtmlTab) {
		app.currentHtmlTab.setEnc(enc);
	}
}
