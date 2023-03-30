function ListUpdater(tab) {
	this.tab = tab;
	this.newList = [];
	this.iterator = 0;
	this.sz = 0;
	this.filesSize = 0;
	this.part = 100;
	this.isRun = false;
	this.isPause = false;
	this.isRenderProcess = false;
}
ListUpdater.prototype.run = function(){
	var o = this;
	if (this.getListIval) {
		clearInterval(this.getListIval);
		this.getListIval = 0;
	}
	if (this.getHiddenListIval) {
		clearInterval(this.getHiddenListIval);
		this.getHiddenListIval = 0;
	}
	if (this.renderProcessIval) {
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
	}
	this.isRenderProcess = false;
	
	try {
		window.app.listProc.write(this.tab.currentPath);
	} catch(err) {
		;
	}
	this.getListIval = setInterval(function(){
		if (o.isPause || !o.isRun || o.isRenderProcess) {
			return;
		}
		o.onListTick();
		// TODO o.onHiddenListTick();
	}, 1 * 1000);
	this.isRun = true;
}
ListUpdater.prototype.pause = function(){
	this.isPause = true;
}
ListUpdater.prototype._continue = function() {
	this.isPause = false;
}
ListUpdater.prototype.stop = function(){
	this.isRun = false;
	this.isPause = false;
	if (this.getListIval) {
		clearInterval(this.getListIval);
		this.getListIval = 0;
	}
	if (this.getHiddenListIval) {
		clearInterval(this.getHiddenListIval);
		this.getHiddenListIval = 0;
	}
	if (this.renderProcessIval) {
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
	}
	this.newList = [];
	this.iterator = 0;
	this.sz = 0;
	this.filesSize = 0;
}
ListUpdater.prototype.onListTick = function(){
	var o = this, lsout;
	if (
			o.isPause 
			|| !o.isRun 
			|| o.isRenderProcess
			|| 1 === intval(Settings.get('hMode'))
		) {
		return;
	}
	this.sz = 0;
	lsout = window.app.listProc ? window.app.listProc.read(this.tab.currentPath) : 0;
	if (lsout) {
		o.isRenderProcess = true;
		this.newList = this.tab.buildList(lsout, true);
		this.iterator = 0;
		this.sz = sz(this.newList);
		this.filesSize = 0;
		this.renderProcessIval = setInterval(function(){
			try {
				o.renderPart();
			} catch (err) {
				alert('ListUpdater.onListTick: ' + err);
			}
		}, 200);
	}
}

ListUpdater.prototype.renderPart = function(){
	var start = this.iterator,
		end = this.iterator + this.part, i,
		newItem, block, s, oldItem, nextNewItem,
		done = false,
		o, self = this,
		statusText, freeSpaceText = '', sizeText = '',
		cmId, createdItemFound = -1, newFoundedActiveItem;
	if (end >= this.sz) {
		done = true;
		end = this.sz;
	}
	o = this.tab; // context is tab
	for (i = start; i < end; i++) {
		if (
			this.isPause 
			|| !this.isRun 
		) {
			return;
		}
		newItem = this.newList[i];
		oldItem = this.tab.list[i];
		// Если существует такой индекс в старом листе
		//  Если текст нового свойства не равен
		//   переписать текущее
		// Иначе (если не существует)
		// Создать свойство и добавить его в конец.
		this.filesSize += this.tab.listRenderer.incSize(newItem.sz);
		if (newItem.name == app.tab.createdItemName) {
			createdItemFound = i;
		}
		if (oldItem) {
			if (oldItem.src == newItem.src && oldItem.sz == newItem.sz) {
				this.iterator++;
				continue;
			}
			this.updateItem(i, newItem);
		} else {
			this.appendNew(i, newItem);
		}
		
		this.iterator++;
		
	}
	
	if (createdItemFound > -1) {
		app.tab.selectItemByIdx(createdItemFound);
	}
	if (done) {
		this.isRenderProcess = false;
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
		this.cutTail();
		
		freeSpaceText = app.devicesManager.getPluralFreeSpaceOfDiskPartByPath(this.tab.currentPath);
		if (freeSpaceText) {
			freeSpaceText = ', ' + freeSpaceText;
		}
		statusText = this.sz + ' ' 
						+ TextTransform.pluralize(this.sz, L('Objects'), L('Objects-voice1'), L('Objects-voice2'))
						+ ' (' + this.tab.listRenderer.getHumanFilesize(intval(this.filesSize), 2, 3, false) + ')'
						+ freeSpaceText;
		if (0 == count(this.tab.oSelectionItems)) {
			this.tab.setStatus.call(this.tab, statusText);
		}
	}
}

ListUpdater.prototype.updateItem = function(i, newItem) {
	/*if (this.nameExists(newItem, sz(this.tab.list))) {
		return;
	}*/
	
	var t;
	
	if (newItem.type == L('Catalog')) {
		newItem.rsz = this.calculateSubdirSz(newItem.name, newItem.rsz);
		newItem.sz = this.tab.listRenderer.getHumanFilesize(newItem.rsz, 1, 3, false);
		t = newItem.rsz;
		if (newItem.sz == 'NaN Байт') {
			newItem.sz = t;
		} else {
			// newItem.rsz = newItem.sz;
		}
	}
	
	this.tab.listRenderer.updateItem(i, newItem);
	this.tab.list[i] = newItem;
	if (1 === intval(Settings.get('hMode'))) {
		this.tab.hideList[i] = newItem;
	} else {
		this.tab.showList[i] = newItem;
	}
}

ListUpdater.prototype.appendNew = function(i, newItem) {
	// this.tab.listRenderer.appendNew(i, newItem);
	var needAppend = 0, oldSz = sz(this.tab.list),
		isNameExists = this.nameExists(newItem, oldSz);
	if (isNameExists) {
		return;
	}
	if (newItem.type == L('Catalog')) {
		newItem.rsz = this.calculateSubdirSz(newItem.name, newItem.rsz);
		newItem.sz = this.tab.listRenderer.getHumanFilesize(newItem.rsz, 1, 3, false);
	}
	if (!isNameExists) {
		needAppend = 1;
		this.tab.list.push(newItem);
		if (1 === intval(Settings.get('hMode'))) {
			this.tab.hideList.push(newItem);
		} else {
			this.tab.showList.push(newItem);
		}
	}
	
	this.tab.listRenderer.calculatePart();
	if ((oldSz == 0 || i < this.tab.listRenderer.part)) {
		if (needAppend) {
			this.tab.listRenderer.appendNew(i, newItem);
		}
	} else if ((i - 1) == intval(this.tab.getLastItemId().replace('f', ''))) {
		this.tab.listRenderer.shiftDown(newItem, i);
	}
	
}


ListUpdater.prototype.calculateSubdirSz = function(shortName, defaultSize) {
	if (shortName == '.' || shortName == '..') {
		return defaultSize;
	}
	var 
		// file = this.tab.currentPath + '/' + shortName + '/.qdjssz', 
		file = this.getDirParamPath(this.tab.currentPath + '/' + shortName) + "/sz", 
		o = this;
	if (FS.fileExists(file)) {
		return intval(FS.readfile(file));
	}
	setTimeout(function(){
		o.calculateSize(o.tab.currentPath + '/' + shortName);
	}, 10);
	return defaultSize;
}

ListUpdater.prototype.calculateSize = function(path) {
	var cmd = "#!/bin/bash\n", slot = App.dir() + "/sh/o.sh";
	// cmd += "du -bs " + path + " > " + path + "/.qdjssz";
	cmd += "du -bs " + path + " > " + this.getDirParamPath(path) + "/sz";
	if (!FS.fileExists(this.getDirParamPath(path))) {
		FS.mkdir(this.getDirParamPath(path));
	}
	FS.writefile(slot, cmd);
	jexec(slot, DevNull, DevNull, DevNull);
}

ListUpdater.prototype.removeSizeFile = function(dir) {
	var sizeFile = this.getDirParamPath(dir) + "/sz";
	if (FS.fileExists(sizeFile)) {
		FS.unlink(sizeFile);
	}
}
ListUpdater.prototype.getDirParamPath = function(dir) {
	var h = FS.md5(dir),
		sub = h.substring(0, 5);
	return App.dir() + "/var/" + sub + "/" + h;
}


ListUpdater.prototype.cutTail = function() {
	var SZ = sz(this.tab.list), cBreak = 0, node;
	while (SZ > this.sz) {
		rm('f' + (SZ - 1));
		/*node = e('f' + (SZ - 1));
		if (node) {
			node.removeAttribute('id');
			stl(node, 'display', 'none');
		}*/
		this.tab.list.splice(SZ - 1, 1);
		// TODO remove me!
		cBreak++;
		if (cBreak > 500) {
			break;
		}
		SZ = sz(this.tab.list);
	}
}

ListUpdater.prototype.nameExists = function(newItem, _sz) {
	var i;
	for (i = 0; i < _sz; i++) {
		if (this.tab.list[i] && newItem.name == this.tab.list[i].name) {
			
			return true;
		}
	}
}
