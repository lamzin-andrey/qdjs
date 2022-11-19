function TabPanel() {
	this.tabs = [];
	this.activeIndex = -1;
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


TabPanel.prototype.setPath = function(s) {
	if (!this.tabsData) {
		this.render();
	}
	var tabItem = this.tabs[this.activeIndex];
	tabItem.setPath(s);
	tabItem.render();
}

TabPanel.prototype.addTabItem = function(s) {
	var tabItem;
	this.getActiveTab();
	tabItem = new TabPanelItem(s);
	this.tabs.splice(this.activeIndex, 0, tabItem);
	this.activeIndex++;
	this.render();
	// tabItem.render(); ?
}

TabPanel.prototype.render = function() {
	var tabsWidth, placeWidth, n = 0;
	this.initTabsData();
	placeWidth = this.setPlacerWidth();
	this.dataForRender = mclone(this.tabsData);
	tabsWidth = this.renderTabs();
	while (tabsWidth > placeWidth && sz(this.dataForRender) > 3) {
		n++;
		this.dataForRender = mclone(this.tabsData);
		this.trimLeft(this.dataForRender, n);
		tabWidth = this.renderTabs();
	}
	this.nDisplayedTabs = sz(this.tabsData) - n;
	this.nRightTab = sz(this.tabsData);
	this.renderTabs(true);
}


TabPanel.prototype.renderTabs = function(noAll){
	var a = this.dataForRender, i, SZ = sz(a), j,
		tpl = '<div class="tabName">{name}</div>\
					<div class="tabClose">\
						<img id="tabc{id}" class="pointer imgBtnTabClose" src="' + App.dir() + '/i/tabClose.png">\
					</div>', s,
		parent = e('tabsPlacer'),
		btn, w = 0, o = this, closeBtn;
	parent.innerHTML = "";
	for (i = 0, j = this.nRightTab - this.nDisplayedTabs; i < SZ; i++, j++) {
		s = tpl.replace("{name}", a[i].name);
		s = str_replace('{id}', j, s);
		if (!noAll) {
			parent.innerHTML = "";
		}
		
		btn = appendChild(parent, "div", s, {
			"class": "tab" + (i == this.activeIndex ? ' active' : ''),
			"id": ("tab" + j),
			"title" : (a[i].path ? a[i].path : '')
		});
		
		btn.onclick = function(evt){
			return o.onClickButton(evt); // TODO
		}
		
		closeBtn = e('tabc' + j);
		closeBtn.onclick = function(evt){
			return o.onClickCloseButton(evt); // TODO
		}
		
		this.tabs[i].setView(btn, closeBtn);
		
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
			name: this.tabs[i].getName()
		};
		this.tabsData.push(item);
	}
}

TabPanel.prototype.trimLeft = function(a, n){
	app.addressPanel.buttonAddress.trimLeft(a, n);
}
