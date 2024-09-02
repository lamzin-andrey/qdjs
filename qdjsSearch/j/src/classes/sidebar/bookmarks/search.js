function Search() {
	this.container = e("searchBlock");
	this.bSearchClose = e("bSearchClose");
	this.bSearch = e("bSearch");
	this.bSearchBrowse = e("bSearchBrowse");
	this.iNameContaints = e("iNameConaints");
	this.bHiddenAndBkp = e("bHiddenAndBkp");
	this.iContentConaints = e("iContentConaints");
	this.setListeners();
}
Search.prototype.show = function() {
  var o = this, a;
  show(o.container);
  o.path = app.tab.currentPath;
  app.kbListener.activeArea = app.kbListener.AREA_SEARCH_FORM;
  o.iNameContaints.focus();
  a = o.path.split("/");
  e("searchFolderName").innerHTML = a[sz(a) - 1];
}

Search.prototype.setListeners = function() {
  var o = this;
  o.bSearchClose.onclick = function(ev) {
	  o.onClickClose();
  }
  o.bSearch.onclick = function(ev) {
	  o.onClickSearch();
  }
  o.bSearchBrowse.onclick = function(ev) {
	  o.onClickBrowse(); // TODO
  }
  o.iNameContaints.onfocus = function(ev) {
	o.activateSearchTab();
  }
  o.iContentConaints.onfocus = function(ev) {
	o.activateSearchTab();
  }
}

Search.prototype.activateSearchTab = function() {
	app.kbListener.activeArea = app.kbListener.AREA_SEARCH_FORM;
}

Search.prototype.onClickClose = function() {
  hide(this.container);
  app.kbListener.activeArea = 0;
}
 
 
Search.prototype.onClickSearch = function() {
  var activeTab, searchTabWasNotInit, activeTabIndex, currentSearchTab;
  
  currentSearchTab = app.searchTabs ? app.searchTabs[app.tabPanel.activeIndex] : 0;
  if (currentSearchTab && currentSearchTab.list) {
	app.tabPanel.tabs[app.tabPanel.activeIndex].listCopy = mclone(currentSearchTab.list);
  }
  
  activeTabIndex = app.tabPanel.addTabItem(L("Search result"), TabPanelItem.TYPE_SEARCH);
  app.tab.tabItem.searchPath = this.path;
  
  try {
	  stl("sectionPbar", "opacity", 1);
	  pBarAnimateStart();
	  if (!app.searchTabs || !app.searchTabs[activeTabIndex]) {
		app.tab.setPath(this.path);
		searchTabWasNotInit = 1;
	  }
	  app.searchTabs[activeTabIndex].searchHidden = this.bHiddenAndBkp.checked;
	  app.searchTabs[activeTabIndex].containtsText = this.iContentConaints.value;
	  app.searchTabs[activeTabIndex].searchText = this.iNameContaints.value;
	  if (searchTabWasNotInit) {
		  app.tab.setPath(this.path);
	  }
	  
	  app.kbListener.activeArea = 0;
	  // alert(app.tab.isSpecialTab()); true!
  } catch(err) {
	  alert(err);
  }
}

Search.prototype.onClickBrowse = function() {
  var rd = RecentDir.jmp3cutGetDir(false), a,
		title = L("Select catalog for search"),
		o = this; // RecentDir.jmp3cutLastDir()
  if (!rd) {
	o.path = Qt.openDirectoryDialog(title, o.path);
	RecentDir.jmp3cutSaveSetting('lastDir', o.path);
  } else {
	o.path = jqlOpenDirectoryDialog(title);
  }
  a = o.path.split("/");
  e("searchFolderName").innerHTML = a[sz(a) - 1];
}



