function SearchTab(idx){
	this.init();
	this.idx = idx;
}
extend(Tab, SearchTab);

SearchTab.prototype.setPath = function(path) {
    var o = this,
		cmd = '#! /bin/bash\nfind "' + path + '" -type f -name ' + this.searchText,
		slot = App.dir()  + '/sh/sr4.sh',
		slot2 = App.dir()  + '/sh/lsh.sh',
		pathInfo = pathinfo(path);
	if (this.searchHidden) {
		cmd = cmd.replace("-lRh", "-lRha");
	}
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
	this.setStatus(L('Load catalog data') + '. ' + L('Request') + '.', 1);
	this.partListListen = 1;
	 
	MW.setTitle(L("Search in") + " " +  pathInfo.basename + ' - ' + FileManager.PRODUCT_LABEL);
	
	MW.setIconImage(App.dir() + '/i/search32.png');
	
	if (this.skipRequestList) {
		this.showList = mclone(this.skipRequestList);
		// this.hideList = mclone(this.skipRequestHList);
		this.list = this.showList;
		this.skipRequestList = 0;
		// this.skipRequestHList = 0;
		this.hideListComplete = true;
		this.listComplete = true;
		this.setStatus(L('Load catalog data') + '. ' + L('Рендерим') + '.', 1);
		this.listCount = 1; // was 2
		this.renderByMode(1);
		return;
	}
	
	FS.writefile(slot, cmd);
	// TODO onFindout
	//jexec(slot, [this, this.onFileList], [this, this.onFileListPart], DevNull);
	jexec(slot, [this, this.onFindDone], [this, this.onFindPart], DevNull);

	
	if (FS.fileExists(path + '/.qdjssz')) {
		FS.unlink(path + '/.qdjssz');
	}
	this.listUpdater.removeSizeFile(path);
}

SearchTab.prototype.onFindPart = function(findout) {
	var i, ls, SZ, b = [], cmd, slot;
	
	ls = findout.split("\n");
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		b.push('"' + ls[i] + '"');
	}
	cmd = '#! /bin/bash\nls -lh --full-time ' + b.join(' ');
	if (this.searchHidden) {
		cmd = cmd.replace("-lh", "-lha");
	}
	cmd = this.setInitSort(cmd);
	slot = App.dir()  + '/sh/ls.sh';
	FS.writefile(slot, cmd);
	jexec(slot, [this, this.onFileListPart], [this, this.onFileList], DevNull);
}

SearchTab.prototype.onFileListPart = function(stdout) {
	
	var ls = this.buildList(stdout), i, SZ = sz(ls);
	
	for (i = 0; i < SZ; i++) {
		this.list.push(ls[i]);
	}
	this.renderByMode(true);
	this.partListListen = 0;
	this.listRenderer.skipRunUpdater = false;
}

SearchTab.prototype.onFileList = function(stdout, stderr) {
	//this.list = this.buildList(stdout);
	this.listComplete = true;
	//this.setStatus(L('Load catalog data') + '. '  + '.', 0);
	
	this.renderByMode(true);
}


SearchTab.prototype.redraw = function() {
	this.rebuildList('list');
	// this.rebuildList('hideList');
	this.renderByMode(true);
}

SearchTab.prototype.onFindDone = function(findout, err) {
	var i, ls, SZ, b = [], cmd;
	stl("sectionPbar", "opacity", 0);
	pBarAnimateStop();
	ls = findout.split("\n");
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		b.push('"' + ls[i] + '"');
	}
	cmd = '#! /bin/bash\nls -lh --full-time ' + b.join(' ');
	if (this.searchHidden) {
		cmd = cmd.replace("-lh", "-lha");
	}
	cmd = this.setInitSort(cmd);
	slot = App.dir()  + '/sh/ls.sh';
	FS.writefile(slot, cmd);
	jexec(slot, [this, this.onFileList], [this, this.onFileList], DevNull);
	
}

SearchTab.prototype.init = function() {
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

SearchTab.prototype.createItem = function(s) {
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
		i, buf, a, typeData, normalizeResult;
	
	buf = s.split('->');
	a = buf[0].split(/\s+/);
	if (sz(a) < 9) {
		return;
	}
	item.name = a.slice(8).join(' ').replace(/^'/, '').replace(/'$/, '');
	
	normalizeResult = this.normalizeDirName(item.name);
	item.name = normalizeResult.name;
	item.dirName = normalizeResult.dirName;
	
	
	item.rsz = a[4];
	if (a[0][0] == 'd') {
		item.type = L('Catalog');
		item.i = App.dir() + '/i/folder32.png';
		item.cmId = 'cmCatalog';
	} else {
		typeData = Types.get(this.currentPath + '/' + item.name);
		item.type = typeData.t;
		item.i = typeData.i;
		item.cmId = 'cmSR';
	}
	
	item.sz = (app.devicesManager ? app.devicesManager.pluralizeSize(item.rsz, 1) : '0');
	
	item.o = a[2];
	item.g = a[3];
	
	
	item.mt = a[5] + ' ' + a[6].split('.')[0];
	item.nSubdirs = a[1] - 2;
	
	return item;
}

SearchTab.prototype.normalizeDirName = function(fullPath) {
	var a, b, c, r = {};
	a = fullPath.split("/");
	b = sz(a) - 1;
	c = a[b];
	a.splice(b, 1);
	r.name = c;
	r.dirName = a.join("/");
	return r;
}

SearchTab.prototype.onKeyDown = function(evt) {
	var pathInfo;
	
	if (evt.keyCode == 40) {
		this.onPushArrowDown(evt);
		return;
	}
	if (evt.keyCode == 38) {
		this.onPushArrowUp(evt);
		return;
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


SearchTab.prototype.searchConditionOk = function(s){
	var a, name, fh, line, buf; 
	
	if (!this.containtsText) {
		return true;
	}
	
	buf = s.split('->');
	a = buf[0].split(/\s+/);
	if (sz(a) < 9) {
		return;
	}
	name = a.slice(8).join(' ').replace(/^'/, '').replace(/'$/, '');
	
	if (FS.filesize(name) > 100*1024*1024) {
		fh = FS.open(name, "r");
		while(!FS.eof(fh)) {
			line = FS.gets(fh);
			if (line.indexOf(this.containtsText) != -1) {
				FS.close(fh);
				return true;
			}
		}
		FS.close(fh);
	} else {
		line = FS.readfile(name);
		if (line.indexOf(this.containtsText) != -1) {
			return true;
		}
	}
}


SearchTab.prototype.openAction = function(id) {
	var item, path, cmd, slot, 
		pathInfo, runner = 'xdg-open';
	
	item = this.getClickedItem(id);
	path = item.dirName + '/' + item.name;
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

SearchTab.prototype.buildList = function(lsout, calcDirSizes) {
	var lines = lsout.split('\n'), i, buf, SZ = sz(lines), dirs = [], files = [], item, t, fileOk;
	for (i = 0; i < SZ; i++) {
		
		try {
			fileOk = this.searchConditionOk(lines[i]);
		} catch(err) {
			alert("searchConditionOk:\n" + err);
		}
		
		if (!fileOk) {
			continue;
		}
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

SearchTab.prototype.onClickOpenContainingFolder = function() {
	var item, path, cmd, slot, 
		pathInfo, runner = 'xdg-open', pathForXdg;
	try {
		item = this.getClickedItem(window.currentCmTargetId);
		path = this.currentPath;
		if (item.dirName) {
			path = item.dirName;
		}
		pathInfo = pathinfo(path)
		pathForXdg = str_replace('//', '/', path);
		cmd = '#!/bin/bash\nexport LD_LIBRARY_PATH=:/usr/lib/x86_64-linux-gnu;\n' + runner + ' \'' + pathForXdg + '\'';
		
		slot = App.dir() + '/sh/o.sh';
		FS.writefile(slot, cmd);
		jexec(slot, DevNull, DevNull, function(err){alert(err);});
		//app.tabPanel.addTabItem(path);
		//app.setActivePath(path, 'bookmarksManager');
	} catch(err) {
		alert("onClickOpenContainingFolder:\n" + err);
	}
}


SearchTab.prototype.scrollToItem = function(id, toBtm) {
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
