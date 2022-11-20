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
	
	try {
		this.tabs[this.activeIndex].copyHistory();
		app.tab.navbarPanelManager.clearHistory(s);
	} catch (err) {
		alert(err);
	} 
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
		tabsWidth = this.renderTabs();
	}
	this.nDisplayedTabs = sz(this.tabsData) - n;
	this.nRightTab = sz(this.tabsData);
	this.renderTabs(true);
}


TabPanel.prototype.renderTabs = function(noAll){
	var a = this.dataForRender, i, SZ = sz(a), j,
		tpl = '<div class="tabName">{name}</div>\
					<div class="tabClose">\
						<img id="tabc{id}" data-idx="{idx}" class="pointer imgBtnTabClose" src="' + App.dir() + '/i/tabClose.png">\
					</div>', s,
		parent = e('tabsPlacer'),
		btn, w = 0, o = this, closeBtn;
	parent.innerHTML = "";
	for (i = 0, j = this.nRightTab - this.nDisplayedTabs; i < SZ; i++, j++) {
		s = tpl.replace("{name}", a[i].name);
		s = str_replace('{id}', j, s);
		s = str_replace('{idx}', a[i].idx, s);
		if (!noAll) {
			parent.innerHTML = "";
		}
		
		btn = appendChild(parent, "div", s, {
			"class": "tab" + (a[i].idx == this.activeIndex ? ' active' : ''),
			"id": ("tab" + j),
			"data-idx": a[i].idx,
			"title" : (a[i].path ? a[i].path : '')
		});
		
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
			idx: i
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
		SZ = sz(ls);
	// alert('idx = ' + idx + ' id = ' + id);
	this.tabs[this.activeIndex].copyHistory();
	if (hasClass(evt.target, 'imgBtnTabClose')) {
		return true;
	}
	for (i = 0; i < SZ; i++) {
		if (hasClass(ls[i], 'active')) {
			removeClass(ls[i], 'active');
		}
	}
	addClass(id, 'active');
	app.setActivePath(this.tabs[idx].path, ["tabpanel"]);
	this.activeIndex = idx;
	this.tabs[idx].restoreHistory();
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
}
