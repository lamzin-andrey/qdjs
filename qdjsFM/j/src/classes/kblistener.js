function KBListener(){
	this.name = "KBListener";
	this.activeArea = 0;
}
KBListener.AREA_BOOKMARKS = 1;
KBListener.AREA_DEVICES = 2;
KBListener.AREA_TAB = 3;
KBListener.AREA_ADDRESS_LINE = 4;
KBListener.prototype.onKeyDown = function(evt) {
	if (this.activeArea == 0) {
		this.activeArea = KBListener.AREA_TAB;
	}
	
	switch (this.activeArea) {
		case KBListener.AREA_TAB:
			app.tab.onKeyDown(evt);
	}
}
