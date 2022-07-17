function Tab() {
	this.username = '';
	this.navbarPanelManager = new NavbarPanel();
	this.addressPanel = new AddressPanel();
	// this.unselectManager = new UnselectManager();
	this.list = [];
	this.hideList = [];
	this.contentBlock = e('tabItems');
	this.statusBlock = e('statusText');
}

Tab.prototype.setPath = function(path) {
	this.currentPath = path;
	this.list = [];
	this.hideList = [];
	this.listComplete = false;
	this.hideListComplete = false;
	this.contentBlock.innerHTML = '';
	this.setStatus(L('Load catalog data') + '. ' + L('Request') + '.', 1);
	
	var cmd = '#! /bin/bash\nls -lh --full-time "' + path + '"',
		slot = App.dir()  + '/sh/ls.sh',
		slot2 = App.dir()  + '/sh/lsh.sh';
	FS.writefile(slot, cmd);
	
	jexec(slot, [this, this.onFileList], DevNull, DevNull);
	
	cmd = '#! /bin/bash\nls -alh --full-time "' + path + '"';
	FS.writefile(slot2, cmd);
	jexec(slot2, [this, this.onHideFileList], DevNull, DevNull);
}
Tab.prototype.onFileList = function(stdout, stderr) {
	this.setStatus(L('Load catalog data') + '. ' + L('Start build list') + '.', 1);
	this.list = this.buildList(stdout);
	this.listComplete = true;
	this.setStatus(L('Load catalog data') + '. ' + L('Рендерим') + '.', 1);
	this.renderByMode();
}
Tab.prototype.onHideFileList = function(stdout, stderr) {
	this.hideList = this.buildList(stdout);
	this.hideListComplete = true;
	// this.renderByMode();// TODO
}

Tab.prototype.buildList = function(lsout) {
	var lines = lsout.split('\n'), i, buf, SZ = sz(lines), dirs = [], files = [], item;
	for (i = 0; i < SZ; i++) {
		item = this.createItem(lines[i]);
		if (item) {
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
	// TODO посмотреть, что выводим, скрытые или нет
	var i, SZ;
	id = id.replace('f', '');
	return this.list[id];
}

Tab.prototype.renderByMode = function() {
	// TODO посмотреть, что выводим, скрытые или нет
	
	// Пока выводим не скрытые
	var o = this, list = o.list, i, SZ = sz(list), item, s, block;
	for (i = 0; i < SZ; i++) {
		item = list[i];
		s = this.tpl();
		// s = str_replace('{name}', item.name, s);
		s = s.replace('{name}', item.name);
		s = s.replace('{name}', item.name);
		s = s.replace('{img}', item.i);
		s = s.replace('{sz}', item.sz);
		// s = str_replace('{type}', item.type, s);
		s = s.replace('{type}', item.type);
		s = s.replace('{type}', item.type);
		s = s.replace('{mt}', item.mt);
		block = appendChild(this.contentBlock, 'div', s, {
			'data-cmid': "cmExample",
			'data-id': "f" + i,
			id: 'f' + i
		});
		block.onclick = function(evt) {
			o.onClickItem(evt);
		}
	}
	this.setStatus(SZ + ' ' + TextTransform.pluralize(SZ, L('Objects'), L('Objects-voice1'), L('Objects-voice2')));
}
Tab.prototype.onClickItem = function(evt) {
	var trg = ctrg(evt),
		ct = new Date().getTime(),
		item,
		cname = 'tabContentItem',
		path,
		cmd,
		slot,
		// ls = cs(this.contentBlock, cname),
		i;
	// this.unselectManager.run(SZ, this, cs(trg, cname)[0], ls);
	/*for (i = 0; i < SZ; i++) {
		removeClass(ls[i], 'active');
	}*/
	if (this.activeItem) {
		removeClass(this.activeItem, 'active');
	}
	this.activeItem = cs(trg, cname)[0];
	addClass(this.activeItem, 'active');
	
	if (ct - this.clicktime > 50 && ct - this.clicktime < 400 && trg.id == this.currentTargetId) {
		item = this.getClickedItem(trg.id); // TODO
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
			i:''
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
	} else {
		typeData = Types.get(this.currentPath + '/' + item.name);
		item.type = typeData.t;
		item.i = typeData.i;
	}
	
	item.sz = app.devicesManager.pluralizeSize(a[4], 1);
	item.o = a[2];
	item.g = a[3];
	
	
	item.mt = a[5] + ' ' + a[6].split('.')[0];
	item.nSubdirs = a[1] - 2;
	
	return item;
}

Tab.prototype.setUser = function(s) {
	this.username = s;
}

Tab.prototype.getUser = function(s) {
	return this.username;
}

Tab.prototype.setStatus = function(s, showLoader) {
	var ldr = '';
	if (showLoader) {
		ldr = '<img src="' + App.dir() + '/i/ld/s.gif">';
	}
	this.statusBlock.innerHTML = ldr + ' ' + s;
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
							<div class="tabContentItemDate">{mt}</div>\
						</div>\
						<div class="cf"></div>\
					</div> <!-- /tabContentItem -->\
					<div class="cf"></div>';
}
