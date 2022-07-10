function Tab() {
	this.username = '';
	this.navbarPanelManager = new NavbarPanel();
	this.addressPanel = new AddressPanel();
	this.list = [];
	this.hideList = [];
	this.contentBlock = e('tabItems');
}

Tab.prototype.setPath = function(path) {
	alert('Tab get path ' + path);
	this.currentPath = path;
	this.list = [];
	this.hideList = [];
	this.listComplete = false;
	this.hideListComplete = false;
	
	var cmd = '#! /bin/bash\nls -lh --full-time "' + path + '"',
		slot = App.dir()  + '/sh/ls.sh',
		slot2 = App.dir()  + '/sh/lsh.sh';
	FS.writefile(slot, cmd);
	
	jexec(slot, [this, this.onFileList], DevNull, DevNull);
	
	cmd = 'ls -alh --full-time "' + path + '"';
	FS.writefile(slot2, cmd);
	jexec(slot2, [this, this.onHideFileList], DevNull, DevNull);
}
Tab.prototype.onFileList = function(stdout, stderr) {
	
	this.list = this.buildList(stdout);
	this.listComplete = true;
	this.renderByMode();
}
Tab.prototype.onHideFileList = function(stdout, stderr) {
	this.hideList = this.buildList(stdout);
	this.hideListComplete = true;
	this.renderByMode();// TODO
}

Tab.prototype.buildList = function(lsout) {
	var lines = lsout.split('\n'), i, buf, SZ = sz(lines), result = [], item;
	for (i = 0;i < SZ; i++) {
		item = this.createItem(lines[i]);
		if (item) {
			result.push(item);
		}
	}
	
	return result;
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

Tab.prototype.renderByMode = function() {
	// TODO посмотреть, что выводим, скрытые или нет
	
	// Пока выводим не скрытые
	var list = this.list, i, SZ = sz(list), item, s, block;
	this.contentBlock.innerHTML = '';
	console.log(list);
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
			'data-id': "f" + i
		});
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

