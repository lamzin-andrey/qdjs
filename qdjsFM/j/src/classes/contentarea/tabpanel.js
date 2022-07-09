function TabPanel() {
	this.tabs = [];
	this.activeIndex = -1;
}

TabPanel.prototype.getActiveTab = function() {
	if (this.activeIndex == -1) {
		this.tabs.push(new Tab());
		this.activeIndex = 0;
	}
	
	return this.tabs[this.activeIndex];
}
