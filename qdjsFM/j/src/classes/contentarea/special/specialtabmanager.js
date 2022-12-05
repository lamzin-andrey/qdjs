function SpecialTabManager() {
	this.name = 'SpecialTabManager';
}

SpecialTabManager.prototype.process = function() {
	switch (app.tab.tabItem.type) {
		case TabPanelItem.TYPE_HTML:
			app.currentHtmlTab =  new HtmlTab();
			return;
	}
}
