function Tab() {
	var o = this;
	this.cName = 'tabContentItem';
	this.username = '';
	this.specialTabManager = new SpecialTabManager();
	this.navbarPanelManager = new NavbarPanel();
	this.addressPanel = new AddressPanel();
	this.listRenderer = new ListRenderer();
	this.listUpdater = new ListUpdater(this);
	this.sort = window.app.sort;
	this.list = [];
	this.hideList = [];
	this.showList = [];
	this.contentBlock = e('tabItems');
	this.statusBlock = e('statusText');
	this.statusLdrPlacer = e('statusLdrPlacer');
	this.listCount = 0;
	this.oSelectionItems = {};
	this.cutItems = [];
	this.copyPaste = new CopyPaste(this);
	
	this.contentBlock.addEventListener('mousewheel', function(evt){
		o.onMouseWheel(evt);
	}, true);
	/**
	 * @property {Array} selectionItems; Get item id: selectionItems[i].parentNode.id
	*/
}

Tab.prototype.setPath = function(path) {
	var o = this,
		cmd = '#! /bin/bash\nls -lh --full-time "' + path + '"',
		slot = App.dir()  + '/sh/ls.sh',
		slot2 = App.dir()  + '/sh/lsh.sh',
		pathInfo = pathinfo(path);
	cmd = this.setInitSort(cmd);
	this.listUpdater.stop();
	this.currentPath = path;
	this.list = [];
	this.hideList = [];
	this.showList = [];
	this.oSelectionItems = {};
	this.activeItem = null;
	this.cutItems = [];
	this.listCount = 0;
	this.listComplete = false;
	this.hideListComplete = false;
	// this.contentBlock.innerHTML = '';
	this.setStatus(L('Load catalog data') + '. ' + L('Request') + '.', 1);
	this.partListListen = 1;
	
	MW.setTitle(pathInfo.basename + ' - ' + FileManager.PRODUCT_LABEL);
	if (this.isSpecialTab()) {
		
		return;
	}
	
	MW.setIconImage(App.dir() + '/i/folder32.png');
	
	if (this.skipRequestList && this.skipRequestHList) {
		this.showList = mclone(this.skipRequestList);
		this.hideList = mclone(this.skipRequestHList);
		this.list = this.showList;
		this.skipRequestList = 0;
		this.skipRequestHList = 0;
		this.hideListComplete = true;
		this.listComplete = true;
		this.setStatus(L('Load catalog data') + '. ' + L('Рендерим') + '.', 1);
		this.listCount = 2;
		this.renderByMode();
		return;
	}
	
	FS.writefile(slot, cmd);
	jexec(slot, [this, this.onFileList], [this, this.onFileListPart], DevNull);
	
	cmd = '#! /bin/bash\nls -alh --full-time "' + path + '"';
	cmd = this.setInitSort(cmd);
	FS.writefile(slot2, cmd);
	jexec(slot2, [this, this.onHideFileList], [this, this.onHideFileListPart], DevNull);
	
	if (FS.fileExists(path + '/.qdjssz')) {
		FS.unlink(path + '/.qdjssz');
	}
	this.listUpdater.removeSizeFile(path);
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

Tab.prototype.redraw = function() {
	this.rebuildList('list');
	this.rebuildList('hideList');
	
	this.renderByMode();
}
Tab.prototype.rebuildList = function(key) {
	var SZ , i, files = [], dirs = [],
		list = this[key];
	
	SZ = sz(list);
	console.log(list);
	for (i = 0; i < SZ; i++) {
		if (list[i].type == L("Catalog")) {
			dirs.push(mclone(list[i]));
		} else {
			files.push(mclone(list[i]));
		}
	} 
	this.sort.apply(files);
	this.sort.apply(dirs);
	SZ = sz(files);
	for (i = 0; i < SZ; i++) {
		dirs.push(files[i]);
	}
	this[key] = dirs;
}

Tab.prototype.onFileListPart = function(stdout) {
	if (this.partListListen == 0) {
		return;
	}
	if (this.listRenderer.processing) {
		return;
	}
	var ls = this.buildList(stdout), i, SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		this.list.push(ls[i]);
	}
	this.renderByMode(true);
	this.partListListen = 0;
}
Tab.prototype.onHideFileListPart = function(stdout) {
	if (this.listRenderer.processing) {
		return;
	}
	var ls = this.buildList(stdout), i, SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		this.hideList.push(ls[i]);
	}
	this.renderByMode(true);
}

Tab.prototype.buildList = function(lsout, calcDirSizes) {
	var lines = lsout.split('\n'), i, buf, SZ = sz(lines), dirs = [], files = [], item, t;
	for (i = 0; i < SZ; i++) {
		item = this.createItem(lines[i]);
		if (item) {
			if (item.name == '.' || item.name == '..') {
				continue;
			}
			if (item.type != L('Catalog')) {
				files.push(item);
			} else {
				if (calcDirSizes && this.listUpdater) {
					item.rsz = this.listUpdater.calculateSubdirSz(item.name, item.rsz);
					item.sz = this.listRenderer.getHumanFilesize(item.rsz, 1, 3, false);
					t = item.rsz;
					if (item.sz == 'NaN Байт') {
						item.sz = t;
					}
				}
				dirs.push(item);
			}
		}
	}
	this.sort.apply(files);
	
	if (Settings.get("noShowDir") == 1) {
		return files;
	}
	
	this.sort.apply(dirs);
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

Tab.prototype.renderByMode = function(skipCheckCount) {
	var o = this, list = o.list, i, SZ = sz(list), item, s, block;
	o.oSelectionItems = {};
	
	if (o.listCount != 2 && !skipCheckCount) {
		return;
	}
	
	if (1 === intval(Settings.get('hMode'))) {
		o.showList = JSON.parse(JSON.stringify(o.list));
		o.list = JSON.parse(JSON.stringify(o.hideList));
		list = o.list;
		SZ = sz(list);
	}
	if (skipCheckCount) {
		this.listRenderer.skipRunUpdater = true;
	}
	this.listRenderer.run(SZ, this, list, 0);
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
	this.oSelectionItems = {};
	for (i = 0; i < SZ; i++) {
		itemId = 'f' + i;
		this.oSelectionItems[itemId] = 1;
		tabContentItem = cs(itemId, this.cName)[0];
		if (tabContentItem) {
			addClass(tabContentItem, 'active');
		}
	}
}
Tab.prototype.createItem = function(s) {
	var item = {
			name: '',
			sz:'',
			rsz:0,
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
	
	item.rsz = a[4];
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
	
	item.sz = (app.devicesManager ? app.devicesManager.pluralizeSize(item.rsz, 1) : '0');
	
	item.o = a[2];
	item.g = a[3];
	
	
	item.mt = a[5] + ' ' + a[6].split('.')[0];
	item.nSubdirs = a[1] - 2;
	
	return item;
}

Tab.prototype.onContextMenu = function(targetId, event) {
	var activeItem = e(targetId);
	if (activeItem) {
		activeItem = cs(activeItem, this.cName)[0];
		if (activeItem) {
			this.setSelection({currentTarget:activeItem.parentNode, isRight:true}, false);
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
	var item, path, cmd, slot, 
		pathInfo, runner = 'xdg-open';
	
	item = this.getClickedItem(id);
	path = this.currentPath + '/' + item.name;
	pathInfo = pathinfo(path)
	if (item.type == L('Catalog')) {
		app.setActivePath(path, ['']);
	} else {
		path = str_replace('//', '/', path);
		cmd = '#!/bin/bash\n' + runner + ' \'' + path + '\'';
		if (pathInfo.extension == 'mts' || pathInfo.extension == 'mov') {
			// runner = 'vlc &;\n sleep 1;\n vlc --started-from-file';
			runner = 'killall vlc; vlc --started-from-file';
			cmd = '#!/bin/bash\n' + runner + ' "' + path + '"';
		}
		
		// cmd = '#!/bin/bash\n' + runner + ' \'' + path + '\'';
		slot = App.dir() + '/sh/o.sh';
		FS.writefile(slot, cmd);
		jexec(slot, DevNull, DevNull, DevNull);
	}
}

Tab.prototype.onClickOpenWebNewTab = function() {
	var item, path;
	item = this.getClickedItem(currentCmTargetId);
	path = this.currentPath + '/' + item.name;
	if (FS.fileExists(path)) {
		// add spec tab
		// set tab spec tab
		app.tabPanel.addTabItem(path, TabPanelItem.TYPE_HTML);
		app.tab.setPath(path);
	}
}

Tab.prototype.onClickOpen = function() {
	this.openAction(window.currentCmTargetId);
}
Tab.prototype.onClickOpenNewTab = function() {
	var n = this.toI(window.currentCmTargetId);
	if (n) {
		app.tabPanel.addTabItem(this.currentPath + '/' + this.list[n].name);
	}
}
Tab.prototype.onClickSendDesktop = function() {
	var n = this.toI(window.currentCmTargetId), desktopPath;
	if (n && window.USER) {
		desktopPath = '/home/' + USER + '/' + app.bookmarksManager.getLocaleFolderName("Desktop", app.getCurrentLocale());
		this.exec('ln -s', (this.currentPath + '/' + this.list[n].name.trim()), desktopPath);
	}
}
Tab.prototype.exec = function(cmd, src, dest, onFinish, onStd, onErr) {
	var slot;
	onFinish = onFinish ? onFinish : DevNull;
	onStd = onStd ? onStd : DevNull;
	onErr = onErr ? onErr : DevNull;
	
	cmd = '#!/bin/bash\n' + cmd;
	if (src) {
		cmd += ' "' + src + '"';
	}
	if (dest) {
		cmd += ' "' + dest + '"';
	}
	cmd += '\n';
	slot = App.dir() + '/sh/o.sh';
	FS.writefile(slot, cmd);
	jexec(slot, onFinish, onStd, onErr);
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
	this.newItemAction(L("New catalog"), L("Enter catalog name"), "mkdir", true);
}
Tab.prototype.newFileAction = function() {
	this.newItemAction(L("New file"), L("Enter file name"), "echo '' >", false);
}
Tab.prototype.newItemAction = function(newName, label, command, isDir) {
	var slot, cmd, o = this, shortName;
	newName = prompt(label, newName);
	if (newName) {
		if (FS.fileExists(this.currentPath + '/' + newName)) {
			alert(L("File or folder already exists"));
			return;
		}
		shortName = newName;
		newName = this.currentPath + '/' + newName;
		cmd = "#!/bin/bash\n" + command + " \"" + newName + '"';
		slot = App.dir() + '/sh/o.sh';
		FS.writefile(slot, cmd);
		jexec(slot, function(){
			o.onCreateNewItem(shortName, isDir);
		}, DevNull, function(err){alert(err)});
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
		var firstId = firstKey(this.oSelectionItems);
		if (firstId) {
			currentCmTargetId = firstId;
		}
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


Tab.prototype.onClickCreateArch = function() {
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
		item,
		aSelectionItems = [],
		i,
		SZ;

	if (!currentCmTargetId) {
		currentCmTargetId = this.activeItem.parentNode.id;
	}
	if (!currentCmTargetId) {
		var firstId = firstKey(this.oSelectionItems);
		if (firstId) {
			currentCmTargetId = firstId;
		}
	}
	
	if (!currentCmTargetId) {
		currentCmTargetId = window.currentCmTargetId;
	}
	if (!currentCmTargetId) {
		return;
	}
	
	
	for (i in this.oSelectionItems) {
		idx = i.replace('f', '');
		srcName = this.list[idx].name;
		aSelectionItems.push('"' + srcName + '"');
	}
	
	
	idx = currentCmTargetId.replace('f', '');
	srcName = this.currentPath + '/' + this.list[idx].name;
	pathInfo = pathinfo(srcName);
	shortName = pathInfo.basename;
	newName = prompt(L("Enter new name"), shortName + '.tar.gz');
	
	if (newName) {
		newPath = this.currentPath + '/' + newName;
		if (FS.fileExists(newPath)) {
			alert(L("File or folder already exists"));
			return;
		}
		newName = newName.replace(/\.tar\.gz$/, '');
		newPath = this.currentPath + '/' + newName;
		cmd = "#!/bin/bash\ncd \"" + this.currentPath + "\"\ntar -cvzf  \"" + newPath + ".tar.gz\" " + aSelectionItems.join(' ') + "\n";
		FS.writefile(sh, cmd);
		jexec(sh, function() {
			alert(newName + ".tar.gz " + L("created"));
		}, DevNull, DevNull);
		
	}
}


Tab.prototype.onClickExtractArch = function() {
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
		item,
		aSelectionItems = [],
		i,
		SZ;

	if (!currentCmTargetId) {
		currentCmTargetId = this.activeItem.parentNode.id;
	}
	if (!currentCmTargetId) {
		var firstId = firstKey(this.oSelectionItems);
		if (firstId) {
			currentCmTargetId = firstId;
		}
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
	shortName = pathInfo.basename;// ??
	// ?? newName = prompt(L("Enter new name"), shortName + '.tar.gz');
	
	// if (newName) {
		/*newPath = this.currentPath + '/' + newName;
		if (FS.fileExists(newPath)) {
			alert(L("File or folder already exists"));
			return;
		}*/
		cmd = "#!/bin/bash\ncd \"" + this.currentPath + "\"\ntar -xvzf  \"" + srcName + "\"";
		FS.writefile(sh, cmd);
		jexec(sh, function() {
			alert(shortName + ".tar.gz " + L("extracted"));
		}, DevNull, DevNull);
		
	// }
}

Tab.prototype.onClickAddBookmark = function() {
	var idx, srcName, pathInfo, shortName;
	
	idx = currentCmTargetId.replace('f', '');
	srcName = this.currentPath + '/' + this.list[idx].name;
	pathInfo = pathinfo(srcName);
	shortName = pathInfo.basename;
	app.bookmarksManager.addNewBm(srcName, shortName);
}

Tab.prototype.onClickOpenTerm = function(inCurrentFolder) {
	var cmd,
		sh = App.dir() + "/sh/o.sh",
		idx
		;
	if (inCurrentFolder) {
		cmd = this.createOpenTermCommand(this.currentPath);
	} else {
		idx = this.activeItem.parentNode.id.replace('f', '');
		// cmd = "#!/bin/bash\nxfce4-terminal --working-directory=\"" + this.currentPath + '/' + this.list[idx].name + '"';
		cmd = this.createOpenTermCommand(this.currentPath + '/' + this.list[idx].name);
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
		i, SZ, keys, parentNode, deletedKeys = [];
		
	if (count(this.oSelectionItems) > 1) {
		msg = L("Are you sure you want to permanently delete files") + "?";
	} else if (count(this.oSelectionItems) == 1) {
		id = this.toI(firstKey(this.oSelectionItems));
		msg = L("Are you sure you want to permanently delete file") + sp + '"' + this.list[id].name + sp + "\"?";
	} else {
		return;
	}
 		
	if (confirm(msg)) {
		i = 0;
		keys = array_keys(this.oSelectionItems);
		
		SZ = sz(keys);
		this.listUpdater.run();
		ival = setInterval(function(){
			var id, j;
			if (i >= SZ) {
				clearInterval(ival);
				SZ = sz(deletedKeys);
				for (j = SZ - 1; j > -1; j--) {
					o.list.splice(o.toI(deletedKeys[j]), 1);
				}
				o.listRenderer.run(sz(o.list), o, o.list, o.toI(o.listRenderer.firstRenderedEl.id));
				return;
			}
			id = keys[i].replace('f', '');
			try {
				if (o.list[id]) {
					path = o.currentPath + "/" + o.list[id].name;
					o.removeOneItem(path, e(keys[i]));
					deletedKeys.push(keys[i]);
				}
			} catch(err) {
				alert(err);
			}
			i++;
		}, 100);
	}
}
Tab.prototype.removeOneItem = function(path, node) {
	var arg = 'f',
		cmd,
		sh = App.dir() + "/sh/o.sh",
		o = this;
	if (FS.isDir(path)) {
		arg = "rf";
	}
	cmd = "#!/bin/bash\nrm -" + arg + " \"" + path.trim() + "\"\n";
	FS.writefile(sh, cmd);
	jexec(sh, [o, o.onFinishRemove], DevNull, [o.onErrorRemove]);
	
	if (node) {
		rm(node);
		/*node.removeAttribute('id');
		stl(node, 'display', 'none');*/
	}
}
Tab.prototype.onFinishRemove = function(stdout, stderr) {
	
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
	return '<div class="tabContentItem {active}" title="{name} id=f{id}">\
						<div class="tabContentItemNameMain fl">\
							<div class="tabContentItemIcon fl">\
								<img class="imgTabContentItemIcon" src="{img}" onload="app.tab.onLoadPreview({id})">\
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
	needClearSelection = String(needClearSelection) == 'undefined' || needClearSelection === true  ? true : false;
	var i, trg = ctrg(evt), cname = this.cName, lastId, nextId, obj, buf;
	
	if (!evt.ctrlKey && !evt.shiftKey) {
		this.activeItem = cs(trg, cname)[0];
		if (!needClearSelection) {
			needClearSelection = false;
			if (this.oSelectionItems[trg.id] && !evt.isRight) {
				needClearSelection = true;
			}
		}
		if (needClearSelection) {
			this.clearSelections();
		}
		
		
		this.oSelectionItems[trg.id] = 1;
		addClass(this.activeItem, 'active');
	} else if (evt.ctrlKey) {
		this.activeItem = cs(trg, cname)[0];
		if (hasClass(this.activeItem, 'active')) {
			removeClass(this.activeItem, 'active');
			
			this.oSelectionItems[trg.id] = 0;
			delete this.oSelectionItems[trg.id];
			this.activeItem = null;
		} else {
			addClass(this.activeItem, 'active');
			this.oSelectionItems[trg.id] = 1;
		}
		
	} else if (evt.shiftKey) {
		lastId = -1;
		if (this.activeItem) {
			lastId = this.toI(this.activeItem.parentNode.id);
			
			for (i in this.oSelectionItems) {
				buf = parseInt(this.toI(i));
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
		
		
		if (nextId <= lastId) {
			buf = lastId;
			lastId = nextId;
			nextId = buf;
		
			for (i in this.oSelectionItems) {
				buf = parseInt(this.toI(i));
				if (buf > parseInt(nextId)) {
					nextId = buf;
				}
			}
		}
		
		this.clearSelections(); // TODO
		
		if (lastId == -1 || nextId == -1) {
			
			this.oSelectionItems[trg.id] = 1;
			addClass(this.activeItem, 'active');
		} else if (lastId < nextId) {
			for (i = lastId; i <= nextId; i++) {
				this.oSelectionItems['f' + i] = 1;
				obj = e('f' + i);
				if (obj) {
					obj = cs(obj, cname)[0];
					if (obj) {
						
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
	
}

Tab.prototype.onKeyDown = function(evt) {
	var pathInfo;
	if (evt.keyCode == 40) {
		this.onPushArrowDown(evt);
		return;
	}
	if (evt.keyCode == 38) {
		if (evt.altKey) {
			pathInfo = pathinfo(this.currentPath);
			if (pathInfo.dirname) {
				app.setActivePath(pathInfo.dirname, ['']);
			} else {
				app.setActivePath('/', ['']);
			}
			return;
		} else {
			this.onPushArrowUp(evt);
			return;
		}
		
	}
	if (evt.keyCode == 13) {
		this.openAction(this.getActiveItemId());
	}
	if (MW.getLastKeyChar() != '' 
		&& !this.isFilterBoxShown()
		&& evt.keyCode != 27 
		&& evt.keyCode != 13
		&& evt.keyCode != 9
		&& evt.keyCode != 8
		&& !evt.ctrlKey
		&& MW.getLastKeyCode() != 16777223
	) {
		
		this.showFilterBox(MW.getLastKeyChar());
		this.processFilterBoxInput();
	}
}
Tab.prototype.onPushArrowDown = function(evt) {
	evt.preventDefault();
	var id;
	id = this.getActiveItemId();
	if (!id) {
		id = 'f0';
		this.setSelection({
			currentTarget: e(id),
			shiftKey: evt.shiftKey
		}, !evt.shiftKey);
	
		this.scrollToItem(id);
		return;
	}
	id = this.getNextId(id);
	if (!id) {
		return;
	}
	this.scrollToItem(id, true);
	if (e(id)) {
		this.setSelection({
			currentTarget: e(id),
			shiftKey: evt.shiftKey
		}, !evt.shiftKey);
	}
}

Tab.prototype.onScrollDown = function() {
	var id, lastItem;
	lastItem = this.listRenderer.lastRenderedEl;
	if (!lastItem) {
		lastItem = this.getLastItem();
	}
	
	if (!lastItem) {
		return;
	}
	this.activeItem = cs(lastItem, this.cName)[0];
	id = lastItem.id;
	
	id = this.getNextId(id);
	if (!id) {
		return;
	}
	this.scrollToItem(id, true);
}
Tab.prototype.onScrollUp = function() {
	var id = '', firstItem;
	firstItem = this.listRenderer.firstRenderedEl;
	
	if (!firstItem) {
		firstItem = this.getFirstItem();
	}
	
	if (firstItem) {
		this.activeItem = cs(firstItem, this.cName)[0];
		id = firstItem.id;
	}
	// MW.setTitle('id = ' + id);
	
	
	id = this.getPrevId(id);
	if (!id) {
		return;
	}
	this.scrollToItem(id);
}

Tab.prototype.onPushArrowUp = function(evt) {
	evt.preventDefault();
	var id;
	id = this.getActiveItemId();
	if (!id) {
		id = 'f0';
		this.setSelection({
			currentTarget: e(id),
			shiftKey: evt.shiftKey
		}, !evt.shiftKey);
		this.scrollToItem(id);
		return;
	}
	id = this.getPrevId(id);
	if (!id) {
		return;
	}
	if (!evt.shiftKey) {
		this.scrollToItem(id);
	}
	if (e(id)) {
		this.setSelection({
			currentTarget: e(id),
			shiftKey: evt.shiftKey
		}, !evt.shiftKey);
	}
	
}
Tab.prototype.getActiveItemId = function() {
	if(!this.activeItem) {
		return '';
	}
	return this.toI(this.activeItem.parentNode.id);
}

Tab.prototype.getNextId = function(id) {
	id = this.toI(id);
	id++;
	if (id < sz(this.list)) {
		return ('f' + id);
	}
	
	return '';
}

Tab.prototype.getPrevId = function(id) {
	id = this.toI(id);
	id--;
	
	if (id < 0) {
		id = 0;
	}
	
	return ('f' + id);
}

Tab.prototype.scrollToItem = function(id, toBtm) {
	var line = e(id), nId = this.toI(id),
		tabItems = this.contentBlock,
		activeItemId;
	if (!line) {
		activeItemId = this.getActiveItemId();
		if (!activeItemId) {
			this.listRenderer.run(sz(this.list), this, this.list, nId, true);
		} else {
			if (toBtm) {
				if (nId - activeItemId == 1) {
					this.listRenderer.shiftDown(this.list[nId], nId);
					return;
				} else {
					nId = nId - this.listRenderer.part + 1;
					nId = nId >= 0 ? nId : 0;
				}
			} else if (nId - activeItemId == -1) {
				this.listRenderer.shiftUp(this.list[nId], nId);
				return;
			}
			
			this.listRenderer.run(sz(this.list), this, this.list, nId, true);
		}
	}
}

Tab.prototype.isFilterBoxShown = function() {
	if (e('hFilterBox')) {
		return true;
	}
	return false;
}

Tab.prototype.showFilterBox = function(ch) {
	var o = this, filterBox, input;
	filterBox = appendChild(body(), 'div', o.getFilterBoxHtml(ch), {"id": "hFilterBox", "style" : o.getFilterBoxStyle()});
	input = e('hFilterBoxInput');
	input.onkeydown = function(evt) {
		if (evt.keyCode == 27) {
			evt.preventDefault();
			rm("hFilterBoxInput");
			rm("hFilterBox");
			return;
		}
		app.filterBoxDeadTime = time() + 5;
		setTimeout(function(){
			o.processFilterBoxInput();
		}, 100);
	}
	input.focus();
	app.filterBoxDeadTime = time() + 5;
	this.filterBoxInterval = setInterval(function(){
		if (time() > app.filterBoxDeadTime) {
			rm('hFilterBoxInput');
			rm('hFilterBox');
			clearInterval(o.filterBoxInterval);
		}
	}, 1000);
}

Tab.prototype.getFilterBoxHtml = function(ch) {
	var s = '<input style="height:32px; border: 2px solid #8ba8df; font-size:13px; border-radius:2px;" value="' + ch + '" id="hFilterBoxInput">';
	return s;
}

Tab.prototype.getFilterBoxStyle = function() {
	var s = 'position:fixed; right:2px; bottom:4px;';
	return s;
}

Tab.prototype.processFilterBoxInput = function() {
	var input = input = e('hFilterBoxInput'), s, i, SZ = sz(this.list), item, id;
	if (!input) {
		return;
	}
	s = input.value;
	if (!s) {
		return;
	}
	s = input.value;
	for (i = 0; i < SZ; i++) {
		item = this.list[i];
		if (item.name.indexOf(s) == 0) {
			id = 'f' + i;
			this.scrollToItem(id);
			if (e(id)) {
				this.setSelection({
					currentTarget: e(id)
				}, true);
			}
			break;
		}
	}
}

Tab.prototype.setTabItem = function(tabItem) {
	this.tabItem = tabItem;
}

Tab.prototype.isSpecialTab = function() {
	if (this.tabItem && this.tabItem.type != TabPanelItem.TYPE_CATALOG) {
		this.specialTabManager.process(); // TODO
		return true;
	}
}

Tab.prototype.onCreateNewItem = function(name, isDir) {
	var item, typeData, idx = 0;
	// item = mclone(this.list[0]);
	item = item ? item : {};

	if (isDir) {
		item.type = L('Catalog');
		item.i = App.dir() + '/i/folder32.png';
		item.cmId = 'cmCatalog';
	} else {
		typeData = Types.get(this.currentPath + '/' + name);
		item.type = typeData.t;
		item.i = typeData.i;
		item.cmId = typeData.c;
	}
	
	item.g = 0;
	item.mt = date('Y-m-d H:i:s');
	item.nSubdirs = 0;
	item.name = name;
	item.o = window.USER;
	item.rsz = 0;
	item.sz = '0';
	item.src = '';
	this.contentBlock.innerHTML = '';
	if (sz(this.list) > 0) {
		if (window.currentCmTargetId) {
			idx = this.toI(window.currentCmTargetId);
			idx--;
			idx = idx > 0 ? idx : 0;
		}
		this.list.splice(idx, 0, item);
	} else {
		this.list.push(item);
	}
	
	this.createdItemName = name;
	this.listRenderer.run(sz(this.list), this, this.list, intval(this.getFirstItemId()));
	this.createdItemName = name;
	
}

Tab.prototype.createOpenTermCommand = function(s) {
	return "#!/bin/bash\nxfce4-terminal --working-directory=\"" + s + '"';
}


Tab.prototype.selectItemByIdx = function(createdItemFound) {
	var newFoundedActiveItem;
	this.createdItemName = '';
	this.scrollToItem('f' + createdItemFound);
	window.currentCmTargetId = 'f' + createdItemFound;
	newFoundedActiveItem = cs('f' + createdItemFound, this.cName)[0];
	if (newFoundedActiveItem) {
		this.activeItem = newFoundedActiveItem;
		this.setSelection({currentTarget:this.activeItem.parentNode}, false);
	}
}

Tab.prototype.getScrollY = function() {
	// return this.contentBlock.scrollTop;
	return intval(this.toI(this.getFirstItemId()));
}
Tab.prototype.getFirstItem = function() {
	var o = cs(this.contentBlock, this.cName)[0];
	if (o) {
		return o.parentNode;
	}
}
Tab.prototype.getFirstItemId = function() {
	var o = this.getFirstItem();
	if (o) {
		return o.id;
	}
	return '';
}

Tab.prototype.getLastItem = function() {
	var ls = cs(this.contentBlock, this.cName),
		o = ls[sz(ls) - 1];
	if (o) {
		return o.parentNode;
	}
}
Tab.prototype.getLastItemId = function() {
	var o = this.getLastItem();
	if (o) {
		return o.id;
	}
	return '';
}

Tab.prototype.setScrollY = function(y) {
	// this.contentBlock.scrollTop = y;
	
	this.scrollToItem(y);
	if (e('f' + y)) {
		this.selectItemByIdx(y);
	}
}

Tab.prototype.onMouseWheel = function(evt) {
	// MW.setTitle(evt.wheelDeltaY);
	if (this.listRenderer.processing) {
		return;
	}
	if (this.scrollWheelProc) {
		return;
	}
	this.scrollWheelProc = 1;
	if (evt.wheelDeltaY < 0) {
		try {
			this.onScrollDown();
		} catch(err) {
			alert(err);
		}
	} else {
		this.onScrollUp();
	}
	this.scrollWheelProc = 0;
}

Tab.prototype.clearSelections = function() {
	var i, buf, cname = this.cName;
	for (i in this.oSelectionItems) {
		buf = cs(i, cname);
		if (buf) {
			buf = buf[0];
			removeClass(buf, 'active');
		}
	}
	this.oSelectionItems = {};
}

Tab.prototype.onLoadPreview = function(i) {
	
	var s, cI;
	if (this.list[i].type.indexOf(L("Image")) != -1) {
		s = this.currentPath + '/' + this.list[i].name;
		if (FS.filesize(s) < 1024*512) {
			cI = this.listRenderer.getCurrentIcon(i);
			if (cI != s) {
				this.listRenderer.setCurrentIcon(i, s);
			}
		}
	}
}

Tab.prototype.setInitSort = function(cmd) {
	var arg = '', k = this.sort.field;
	
	if (this.sort.field == 'DESC') {
		switch (k) {
			case 'name':
				arg = '-r';
			case 'rsz':
				arg = '-S';
			case 'type':
				arg = '-X';
			case 'mt':
				arg = '-t';
		}
	} else {
		switch (k) {
			case 'rsz':
				arg = '-Sr';
			case 'type':
				arg = '-Xr';
			case 'mt':
				arg = '-tr';
		}
	}
	
	cmd = cmd.replace('--full-time', '--full-time ' + arg);
	
	return cmd;
}
