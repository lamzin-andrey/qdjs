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
			if (this.activeItem) {
				removeClass(this.activeItem, 'active');
			}
			this.activeItem = activeItem;
			addClass(this.activeItem, 'active');
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

Tab.prototype.setSelection = function(evt) {
	var i, trg = ctrg(evt), cname = 'tabContentItem', lastId, nextId, obj, buf;
	if (!evt.ctrlKey && !evt.shiftKey) {
		for (i = 0; i < sz(this.selectionItems); i++) {
			removeClass(this.selectionItems[i], 'active');
		}
		this.activeItem = cs(trg, cname)[0];
		this.selectionItems.length = 0;
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
}
Tab.prototype.toI = function(s) {
	return String(s).replace(/\D/mig, '');
}
