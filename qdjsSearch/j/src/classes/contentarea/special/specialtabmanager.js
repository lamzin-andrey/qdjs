function SpecialTabManager() {
	this.name = 'SpecialTabManager';
}

SpecialTabManager.prototype.process = function() {
	switch (app.tab.tabItem.type) {
		case TabPanelItem.TYPE_HTML:
			app.currentHtmlTab =  new HtmlTab();
			return;
		case TabPanelItem.TYPE_SEARCH:
			if (!app.searchTabs) {
				app.searchTabs = {};
			}
			if (!app.searchTabs[app.tabPanel.activeIndex]) {
				app.searchTabs[app.tabPanel.activeIndex] =  new SearchTab(app.tabPanel.activeIndex);
			}
			return;
	}
}
