function Tab() {
	this.username = '';
	this.navbarPanelManager = new NavbarPanel();
	this.addressPanel = new AddressPanel();
	this.listRenderer = new ListRenderer();
	this.listUpdater = new ListUpdater(this);
	this.list = [];
	this.hideList = [];
	this.showList = [];
	this.contentBlock = e('tabItems');
	this.statusBlock = e('statusText');
	this.statusLdrPlacer = e('statusLdrPlacer');
	this.listCount = 0;
	this.selectionItems = [];
	this.cutItems = [];
	this.copyPaste = new CopyPaste(this);
	/**
	 * @property {Array} selectionItems; Get item id: selectionItems[i].parentNode.id
	*/
}

Tab.prototype.setPath = function(path) {
	var o = this,
		cmd = '#! /bin/bash\nls -lh --full-time "' + path + '"',
		slot = App.dir()  + '/sh/ls.sh',
		slot2 = App.dir()  + '/sh/lsh.sh';
	this.listUpdater.stop();
	this.currentPath = path;
	this.list = [];
	this.hideList = [];
	this.showList = [];
	this.selectionItems = [];
	this.cutItems = [];
	this.listCount = 0;
	this.listComplete = false;
	this.hideListComplete = false;
	this.contentBlock.innerHTML = '';
	this.setStatus(L('Load catalog data') + '. ' + L('Request') + '.', 1);
	
	FS.writefile(slot, cmd);
	jexec(slot, [this, this.onFileList], DevNull, DevNull);
	
	
	// No effective on old machine
	/*if (this.getListIval) {
		clearInterval(this.getListIval);
	}
	window.app.listProc.write(path);
	this.getListIval = setInterval(function(){
		var data = window.app.listProc.read(path);
		if (data) {
			o.onFileList(data, '');
			clearInterval(o.getListIval);
			o.getListIval = 0;
		}
	}, 100);*/
	
	cmd = '#! /bin/bash\nls -alh --full-time "' + path + '"';
	FS.writefile(slot2, cmd);
	jexec(slot2, [this, this.onHideFileList], DevNull, DevNull);
	
	/*if (this.getHiddenListIval) {
		clearInterval(this.getHiddenListIval);
	}
	window.app.hiddenListProc.write(path);
	this.getHiddenListIval = setInterval(function(){
		var data = window.app.hiddenListProc.read(path);
		if (data) {
			o.onHideFileList(data, '');
			clearInterval(o.getHiddenListIval);
			o.getHiddenListIval = 0;
		}
	}, 100);*/
}

Tab.prototype.onFileList = function(stdout, stderr) {
	this.setStatus(L('Load catalog data') + '. ' + L('Start build list') + '.', 1);
	this.list = this.buildList(stdout);
	this.listComplete = true;
	this.setStatus(L('Load catalog data') + '. ' + L('Рендерим') + '.', 1);
	this.listCount++;
	this.renderByMode();
}
Tab.prototype.onHideFileList = function(stdout, stderr) {
	this.hideList = this.buildList(stdout);
	this.hideListComplete = true;
	this.listCount++;
	this.renderByMode();
}

Tab.prototype.buildList = function(lsout) {
	var lines = lsout.split('\n'), i, buf, SZ = sz(lines), dirs = [], files = [], item;
	for (i = 0; i < SZ; i++) {
		item = this.createItem(lines[i]);
		if (item) {
			if (item.name == '.' || item.name == '..') {
				continue;
			}
			if (item.type != L('Catalog')) {
				files.push(item);
			} else {
				dirs.push(item);
			}
		}
	}
	SZ = sz(files);
	for (i = 0; i < SZ; i++) {
		dirs.push(files[i]);
	}
	
	return dirs;
}

Tab.prototype.getClickedItem = function(id) {
	var i, SZ;
	id = id.replace('f', '');
	return this.list[id];
}

Tab.prototype.renderByMode = function() {
	var o = this, list = o.list, i, SZ = sz(list), item, s, block;
	o.selectionItems.length = 0;
	
	if (o.listCount != 2) {
		return;
	}
	
	if (1 === intval(Settings.get('hMode'))) {
		o.showList = JSON.parse(JSON.stringify(o.list));
		o.list = JSON.parse(JSON.stringify(o.hideList));
		list = o.list;
		SZ = sz(list)
	}
	this.listRenderer.run(SZ, this, list);
}
Tab.prototype.onClickItem = function(evt) {
	var trg = ctrg(evt),
		ct = new Date().getTime(),
		item,
		path,
		cmd,
		slot,
		i, targetModel;
	
	this.setSelection(evt);
	
	if (ct - this.clicktime > 50 && ct - this.clicktime < 400 && trg.id == this.currentTargetId) {
		this.openAction(trg.id);
	} else {
		targetModel = this.getClickedItem(trg.id);
		if (targetModel) {
			this.setStatus('«' + targetModel.name + '» (' + targetModel.sz + ') ' + targetModel.type);
		}
	}
	this.clicktime = ct;
	this.currentTargetId = trg.id;
}

Tab.prototype.selectAll = function() {
	var i, SZ = sz(this.list), itemId, tabContentItem;
	this.selectionItems.length = 0;
	for (i = 0; i < SZ; i++) {
		itemId = 'f' + i;
		tabContentItem = cs(itemId, 'tabContentItem')[0];
		if (tabContentItem) {
			addClass(tabContentItem, 'active');
			this.selectionItems.push(tabContentItem);
		}
	}
	
}
Tab.prototype.createItem = function(s) {
	var item = {
			name: '',
			sz:'',
			type:'',
			o:'',
			g:'',
			mt:'',
			nSubdirs: 0,
			i:'',
			src: s
		},
		i, buf, a, typeData;
	buf = s.split('->');
	a = buf[0].split(/\s+/);
	if (sz(a) < 9) {
		return;
	}
	item.name = a.slice(8).join(' ').replace(/^'/, '').replace(/'$/, '');
	
	if (a[0][0] == 'd') {
		item.type = L('Catalog');
		item.i = App.dir() + '/i/folder32.png';
		item.cmId = 'cmCatalog';
	} else {
		typeData = Types.get(this.currentPath + '/' + item.name);
		item.type = typeData.t;
		item.i = typeData.i;
		item.cmId = typeData.c;
	}
	
	item.sz = app.devicesManager.pluralizeSize(a[4], 1);
	item.o = a[2];
	item.g = a[3];
	
	
	item.mt = a[5] + ' ' + a[6].split('.')[0];
	item.nSubdirs = a[1] - 2;
	
	return item;
}

Tab.prototype.onContextMenu = function(targetId, event) {
	var activeItem = e(targetId);
	if (activeItem) {
		activeItem = cs(activeItem, 'tabContentItem')[0];
		if (activeItem) {
			this.setSelection({currentTarget:activeItem.parentNode}, false);
		}
	}
}

Tab.prototype.setUser = function(s) {
	this.username = s;
}

Tab.prototype.getUser = function(s) {
	return this.username;
}

Tab.prototype.openAction = function(id) {
	var item, path, cmd, slot;
	item = this.getClickedItem(id);
	path = this.currentPath + '/' + item.name;
	if (item.type == L('Catalog')) {
		app.setActivePath(path, ['']);
	} else {
		cmd = '#!/bin/bash\nxdg-open \'' + path + '\'';
		slot = App.dir() + '/sh/o.sh';
		FS.writefile(slot, cmd);
		jexec(slot, DevNull, DevNull, DevNull);
	}
}
Tab.prototype.onClickOpen = function() {
	this.openAction(window.currentCmTargetId);
}

Tab.prototype.onClickNewFolder = function() {
	try {
		this.newFolderAction();
	} catch(err) {
		alert(err);
	}
}

Tab.prototype.onClickNewFile = function() {
	this.newFileAction();
}

Tab.prototype.newFolderAction = function() {
	this.newItemAction(L("New catalog"), L("Enter catalog name"), "mkdir");
}
Tab.prototype.newFileAction = function() {
	this.newItemAction(L("New file"), L("Enter file name"), "echo '' >");
}
Tab.prototype.newItemAction = function(newName, label, command) {
	var slot, cmd;
	newName = prompt(label, newName);
	if (newName) {
		if (FS.fileExists(this.currentPath + '/' + newName)) {
			alert(L("File or folder already exists"));
			return;
		}
		newName = this.currentPath + '/' + newName;
		cmd = "#!/bin/bash\n" + command + " \"" + newName + '"';
		slot = App.dir() + '/sh/o.sh';
		FS.writefile(slot, cmd);
		jexec(slot, DevNull, DevNull, DevNull);
	} else {
		alert("What the mix?");
	}
}

Tab.prototype.getNewName = function(newName) {
	var n = 0, next = this.currentPath + '/' + newName;
	
	while (FS.fileExists(next)) {
		n++;
		next = this.currentPath + '/' + newName + " (" + n + ')';
	}
	
	return next;
}

Tab.prototype.onClickCopy = function() {
	this.listUpdater.pause();
	this.copyPaste.copyAction(window.currentCmTargetId);
	this.listUpdater._continue();
}
Tab.prototype.onClickCut = function() {
	this.listUpdater.pause();
	this.copyPaste.cutAction(window.currentCmTargetId);
	this.listUpdater._continue();
}
Tab.prototype.onClickPaste = function() {
	this.copyPaste.pasteAction();
}

Tab.prototype.onClickRename = function() {
	var 
		currentCmTargetId,
		idx,
		srcName,
		pathInfo,
		shortName,
		newName,
		cmd,
		sh = App.dir() + "/sh/o.sh",
		newPath,
		cmId,
		item;

	if (!currentCmTargetId) {
		currentCmTargetId = this.activeItem.parentNode.id;
	}
	if (!currentCmTargetId) {
		currentCmTargetId = this.selectionItems[0].parentNode.id;
	}
	
	if (!currentCmTargetId) {
		currentCmTargetId = window.currentCmTargetId;
	}
	if (!currentCmTargetId) {
		return;
	}
	idx = currentCmTargetId.replace('f', '');
	srcName = this.currentPath + '/' + this.list[idx].name;
	pathInfo = pathinfo(srcName);
	shortName = pathInfo.basename;
	newName = prompt(L("Enter new name"), shortName)
	
	if (newName) {
		newPath = this.currentPath + '/' + newName;
		if (FS.fileExists(newPath)) {
			alert(L("File or folder already exists"));
			return;
		}
		cmd = "#!/bin/bash\nmv \"" + srcName + "\" \"" + newPath + '"';
		FS.writefile(sh, cmd);
		jexec(sh, DevNull, DevNull, DevNull);
		cmId = attr(currentCmTargetId, 'data-cmid');
		if (cmId) {
			item = this.list[idx];
			item.name = newName
			this.listRenderer.updateItem(idx, item);
		}
	}
}

Tab.prototype.onClickOpenTerm = function(inCurrentFolder) {
	var cmd,
		sh = App.dir() + "/sh/o.sh",
		idx
		;
	if (inCurrentFolder) {
		cmd = "#!/bin/bash\nxfce4-terminal --working-directory=\"" + this.currentPath + '"';
	} else {
		idx = this.activeItem.parentNode.id.replace('f', '');
		cmd = "#!/bin/bash\nxfce4-terminal --working-directory=\"" + this.currentPath + '/' + this.list[idx].name + '"';
	}
	FS.writefile(sh, cmd);
	jexec(sh, DevNull, DevNull, DevNull);
}

// TODO сделать через диалог
Tab.prototype.onClickRemove = function() {
	var id,
		path,
		msg,
		sp = " ",
		o = this,
		ival,
		path,
		i, SZ = sz(this.selectionItems);
		
	if (sz(this.selectionItems) > 1) {
		msg = L("Are you sure you want to permanently delete files") + "?";
	} else if (sz(this.selectionItems) == 1) {
		id = this.selectionItems[0].parentNode.id.replace('f', '');
		msg = L("Are you sure you want to permanently delete file") + sp + '"' + this.list[id].name + sp + "\"?";
	} else {
		return;
	}
 		
	if (confirm(msg)) {
		i = 0;
		ival = setInterval(function(){
			var id;
			if (i >= SZ) {
				clearInterval(ival);
				return;
			}
			id = o.selectionItems[i].parentNode.id.replace('f', '');
			try {
				path = o.currentPath + "/" + o.list[id].name;
				o.removeOneItem(path);
			} catch(err) {
				alert(err);
			}
			i++;
		}, 100);
	}
}
Tab.prototype.removeOneItem = function(path) {
	var arg = 'f',
		cmd,
		sh = App.dir() + "/sh/o.sh",
		o = this;
	if (FS.isDir(path)) {
		arg = "rf";
	}
	cmd = "#!/bin/bash\nrm -" + arg + " \"" + path + "\"\n";
	FS.writefile(sh, cmd);
	jexec(sh, [o, o.onFinishRemove], DevNull, [o.onErrorRemove]);
}
Tab.prototype.onFinishRemove = function(stdout, stderr) {
	// this.setPath(this.currentPath);
}
Tab.prototype.onErrorRemove = function(stdout, stderr) {
	alert(L("Error remove file"));
}

Tab.prototype.setStatus = function(s, showLoader) {
	var ldr = '';
	if (showLoader) {
		ldr = '<img src="' + App.dir() + '/i/ld/s.gif">';
		if (this.lastLoader != ldr) {
			this.statusLdrPlacer.innerHTML = ldr;
			this.lastLoader == ldr;
		}
	} else {
		this.statusLdrPlacer.innerHTML = ldr;
		this.lastLoader == ldr;
	}
	
	this.statusBlock.innerHTML = s;
}

Tab.prototype.tpl = function() {
	return '<div class="tabContentItem" title="{name}">\
						<div class="tabContentItemNameMain fl">\
							<div class="tabContentItemIcon fl">\
								<img class="imgTabContentItemIcon" src="{img}">\
							</div>\
							<div class="tabContentItemName fl">{name}</div>\
							<div class="cf"></div>\
						</div>\
						\
						<div class="tabContentItemSize fl">\
							<div class="tabContentItemName">{sz}</div>\
						</div>\
						\
						<div class="tabContentItemType fl" title="{type}">\
							<div class="tabContentItemName" >{type}</div>\
						</div>\
						\
						<div class="tabContentItemDate fl">\
							<div class="tabContentItemName">{mt}</div>\
						</div>\
						<div class="cf"></div>\
					</div> <!-- /tabContentItem -->\
					<div class="cf"></div>';
}

Tab.prototype.setSelection = function(evt, needClearSelection) {
	needClearSelection = String(needClearSelection) == 'undefined' ? true : false;
	var i, trg = ctrg(evt), cname = 'tabContentItem', lastId, nextId, obj, buf;
	
	if (!evt.ctrlKey && !evt.shiftKey) {
		this.activeItem = cs(trg, cname)[0];
		if (!needClearSelection) {
			needClearSelection = true;
			for (i = 0; i < sz(this.selectionItems); i++) {
				if (this.activeItem.parentNode.id == this.selectionItems[i].parentNode.id) {
					needClearSelection = false;
					break;
				}
			}
		}
		if (needClearSelection) {
			for (i = 0; i < sz(this.selectionItems); i++) {
				removeClass(this.selectionItems[i], 'active');
			}
			this.selectionItems.length = 0;
		}
		
		this.selectionItems.push(this.activeItem);
		addClass(this.activeItem, 'active');
	} else if (evt.ctrlKey) {
		this.activeItem = cs(trg, cname)[0];
		if (hasClass(this.activeItem, 'active')) {
			removeClass(this.activeItem, 'active');
			for (i = 0; i < sz(this.selectionItems); i++) {
				obj = this.selectionItems[i];
				if (obj && obj.parentNode.id == this.activeItem.parentNode.id) {
					this.selectionItems.splice(i, 1);
					break;
				}
			}
			this.activeItem = null;
		} else {
			addClass(this.activeItem, 'active');
			this.selectionItems.push(this.activeItem);
		}
		
	} else if (evt.shiftKey) {
		lastId = -1;
		if (this.activeItem) {
			lastId = this.toI(this.activeItem.parentNode.id);
			for (i = 0; i < sz(this.selectionItems); i++) {
				buf = parseInt(this.toI(this.selectionItems[i].parentNode.id));
				if (buf < parseInt(lastId)) {
					lastId = buf;
				}
			}
		}
		this.activeItem = cs(trg, cname)[0];
		nextId = -1;
		if (this.activeItem) {
			nextId = this.toI(this.activeItem.parentNode.id);
		}
		for (i = 0; i < sz(this.selectionItems); i++) {
			removeClass(this.selectionItems[i], 'active');
		}
		if (nextId <= lastId) {
			buf = lastId;
			lastId = nextId;
			nextId = buf;
			for (i = 0; i < sz(this.selectionItems); i++) {
				buf = parseInt(this.toI(this.selectionItems[i].parentNode.id));
				if (buf > parseInt(nextId)) {
					nextId = buf;
				}
			}
		}
		this.selectionItems.length = 0;
		if (lastId == -1 || nextId == -1) {
			this.selectionItems.push(this.activeItem);
			addClass(this.activeItem, 'active');
		} else if (lastId < nextId) {
			for (i = lastId; i <= nextId; i++) {
				obj = e('f' + i);
				if (obj) {
					obj = cs(obj, cname)[0];
					if (obj) {
						this.selectionItems.push(obj);
						addClass(obj, 'active');
					}
				}
			}
		}
	}
	this.normalizeSelectionItems();
}
Tab.prototype.toI = function(s) {
	return String(s).replace(/\D/mig, '');
}

Tab.prototype.normalizeSelectionItems = function() {
	var i, map = {}, SZ = sz(this.selectionItems), id;
	if (SZ) {
		for (i = 0; i < SZ; i++) {
			id = this.selectionItems[i].parentNode.id;
			if (!map[id]) {
				map[id] = this.selectionItems[i];
			}
		}
		this.selectionItems.length = 0;
		for (i in map) {
			this.selectionItems.push(map[i]);
		}
	}
}
