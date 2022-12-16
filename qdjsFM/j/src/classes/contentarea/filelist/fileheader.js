function FileHeader() {
	this.name = 'FileHeader';
	this.sort = window.app.sort;
	this.activeTabKey = Settings.get('tabSortKey') ? Settings.get('tabSortKey') : 'name';
	this.direct = Settings.get('tabSortDirect') ? Settings.get('tabSortDirect') : 'ASC';
	this.sort.field = this.activeTabKey;
	this.sort.direct = this.direct;
	this.setListeners();
	this.initView();// TODO showImage( switch(activeTabKey) )
}
FileHeader.prototype.initView = function(){
	switch (this.activeTabKey) {
		case 'rsz':
			return this.showImage(this.tabSize);
		case 'type':
			return this.showImage(this.tabType);
		case 'mt':
			return this.showImage(this.tabDate);
	}
	this.showImage(this.tabFile);
}
FileHeader.prototype.showImage = function(activeTab){
	this.setImgVisible(this.tabDate, false);
	this.setImgVisible(this.tabFile, false);
	this.setImgVisible(this.tabSize, false);
	this.setImgVisible(this.tabType, false);
	
	this.setImgVisible(activeTab, true);
}
FileHeader.prototype.setImgVisible = function(tab, v){
	var img = cs(tab, 'imgTabContentHeaderImg')[0], c = 'd-none';
	if (this.direct == 'ASC') {
		attr(img, 'src', App.dir() + '/i/tabContentHeaderImgB.png');
	} else {
		attr(img, 'src', App.dir() + '/i/tabContentHeaderImgT.png');
	}
	if (!v) {
		addClass(img, c);
	} else {
		removeClass(img, c);
	}
}
FileHeader.prototype.setListeners = function() {
	var o = this;
	this.tabFile = e('tabContentHeaderFileName');
	this.tabSize = e('tabContentHeaderSize');
	this.tabType = e('tabContentHeaderType');
	this.tabDate = e('tabContentHeaderDate');

	this.tabFile.onclick = function(){
		o.onClickTabFile();
	}
	this.tabSize.onclick = function(){
		o.onClickTabSize();
	}
	this.tabType.onclick = function(){
		o.onClickTabType();
	}
	this.tabDate.onclick = function(){
		o.onClickTabDate();
	}
}


FileHeader.prototype.onClickTabFile = function(){
	this.onClickTab(this.tabFile, 'name');
}
FileHeader.prototype.onClickTab = function(tab, key){
	if (this.activeTabKey == key) {
		this.direct = this.direct == 'ASC' ? 'DESC' : 'ASC';
	} else {
		this.direct = 'ASC';
		this.activeTabKey = key;
	}
	
	this.showImage(tab);
	
	this.sort.direct = this.direct;
	this.sort.field = this.activeTabKey;
	Settings.set('tabSortKey', this.activeTabKey);
	Settings.set('tabSortDirect', this.direct);
	app.tab.redraw();
}
FileHeader.prototype.onClickTabSize = function(){
	this.onClickTab(this.tabSize, 'rsz');
}
FileHeader.prototype.onClickTabType = function(){
	this.onClickTab(this.tabType, 'type');
}
FileHeader.prototype.onClickTabDate = function(){
	this.onClickTab(this.tabDate, 'mt');
}

