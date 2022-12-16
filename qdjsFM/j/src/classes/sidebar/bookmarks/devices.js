function Devices() {
	this.username = '';
	this.itemIdPrefix = 'dc';
	this.list = [];
	this.is_run = false;
	this.removableDevices = Settings.get('rds');
	if (!this.removableDevices) {
		this.removableDevices = {};
	}
}
extend(AbstractList, Devices);

Devices.prototype.run = function() {
	this.init('devicesBlock', L('Devices'));
	this.createList();
	// this.render();
	this.is_run = true;
	
	var o = this;
	/*setInterval(function() {
		o.createList();
	}, 3 * 1000);*/
	jexec('udisksctl monitor', DevNull, [o, o.onStdout], DevNull /*[o, o.onStderr]*/);
}

Devices.prototype.onStdout = function(s) {
	var o = this;
	if (~s.indexOf('Added /org/freedesktop/UDisks2/jobs/')) {
		this.createList();
		setTimeout(function() {
			o.createList();
		}, 3 * 1000);
	}
}


Devices.prototype.setUser = function(s) {
	this.username = s;
}

Devices.prototype.isRun = function() {
	return this.is_run;
}

Devices.prototype.onClick = function(event) {
	var trg = ctrg(event),
		n = str_replace(this.itemIdPrefix, '', trg.id),
		isMounted = false,
		o = this,
		cmd = "#!/bin/bash\nudisksctl mount -b /dev/",
		sh = App.dir() + "/sh/o.sh",
		path;
	if (this.list[n].path == '/') {
		isMounted = true;
	} else if (FS.fileExists(this.list[n].path) && FS.isDir(this.list[n].path)) {
		//alert(this.list[n].path + "/.qdjsfm");
		//FS.writefile(this.list[n].path + "/.qdjsfm", "Hello");
		//if (FS.fileExists(this.list[n].path + "/.qdjsfm")) {
			isMounted = true;
		//}
		//FS.unlink(this.list[n].path + "/.qdjsfm");
	}
	if (isMounted) {
		app.setActivePath(this.list[n].path, 'devicesManager');
	} else if (this.list[n].xdxN) {
		cmd += this.list[n].xdxN;
		FS.writefile(sh, cmd);
		jexec(sh, function(stdout, stderr){
			path = stdout.split(" at ");
			path = path[sz(path) - 1].replace(/[.]{1}/, '').trim();
			app.setActivePath(path, 'devicesManager');
		}, DevNull, [this, this.onErrMount]);
	}
}

Devices.prototype.onErrMount = function(stderr) {
	alert("Error mount device\n" + stderr);
}


Devices.prototype.createList = function() {
	this.unknownVolumeCounter = 0;
	this.list = [];
	this.listByLabel = {};
	this.listByUuid = {};
	this.listMount = {};
	this.listDisks = {};
	// Получить список 1 меток  -> /dev/sdxN из by-label
	// Получить список 2 меток  -> /dev/sdxN из by-uid
	// Исключить из списка 2 все sdxN присутствующие в списке 1
	// Каждый элемент списка два найти в выводе mount
	//   Заменить uid на K из on /A/B/K
	// Оставшиеся элементы списка 2 если нет записи в нашем конфиге для из uid помечаем Неизвестный том (1)
	//	Если запись в нашем конфиге есть пишем что-то вида Том 210 ГБ
	
	// Получить список 1 меток  -> /dev/sdxN из by-label
	jexec('ls -l /dev/disk/by-label', [this, this.onLabelList], DevNull, DevNull);
}
Devices.prototype.onLabelList = function(stdout, stderr) {
	// alert('onLabelList:' + stdout);
	this.listByLabel = this.parseLsOut(stdout);
	jexec('ls -l /dev/disk/by-uuid', [this, this.onUuidList], DevNull, DevNull);
}
Devices.prototype.onUuidList = function(stdout, stderr) {
	// alert('onUuidList:' + stdout);
	this.listByUuid = this.parseLsOut(stdout);
	jexec('mount', [this, this.onMountList], DevNull, DevNull);
}
Devices.prototype.onMountList = function(stdout, stderr) {
	this.listMount = this.parseMountListOut(stdout);
	jexec('df -h', [this, this.onDiskData], DevNull, DevNull);
	
}
Devices.prototype.onDiskData = function(stdout, stderr) {
	this.listDisks = this.parseDfhOut(stdout);
	this.buildList();
}

Devices.prototype.buildList = function() {
	var i, path, skip = In('/', '/home'), sPrev, sCurrent;
	// Исключить из списка 2 все sdxN присутствующие в списке 1
	this.excludeAllLabelsFromUuidList();
	
	// Каждый элемент списка два найти в выводе mount
	//   Заменить uuid на K из on /A/B/K
	// Оставшиеся элементы списка 2 если нет записи в нашем конфиге для из uid помечаем Неизвестный том (1)
	//	Если запись в нашем конфиге есть пишем что-то вида Том 210 ГБ
	this.setMountedInUuidList();
	
	// Добавить в this.list элемент Файловая система (он всегда есть)
	this.addItem(L('Filesystem'), '/');
	// Добавить в this.list элементы из listByLabel с учетом монтированости (есть в listMount значит монтирован)
	
	for (i in this.listByLabel) {
		this.addItem(this.listByLabel[i], this.listMount[i], i);
	}
	
	// Добавить в this.list элементы из listByUuid с учетом монтированости (есть в listMount значит монтирован)
	for (i in this.listByUuid) {
		if (!skip[this.listMount[i]]) {
			this.addItem(this.listByUuid[i], this.listMount[i], i);
		}
	}
	
	
	try {
		if (this.prevList && this.list) {
			sPrev = JSON.stringify(this.prevList);
			sCurrent = JSON.stringify(this.list);
			if (sPrev == sCurrent) {
				return;
			}
		}
	} catch (err) {
		alert(err);
	}
	
	this.prevList = JSON.stringify(this.list);
	this.prevList = JSON.parse(this.prevList);
	this.render();
}

/**
 * Каждый элемент списка Uuid найти в выводе mount
 * Заменить uuid на K из on /A/B/K
 * Оставшиеся элементы списка 2 если нет записи в нашем конфиге для из uid помечаем Неизвестный том (1)
 * Если запись в нашем конфиге есть пишем что-то вида Том 210 ГБ
*/
Devices.prototype.setMountedInUuidList = function() {
	var i, dataFromMem, unknownVolumeFound = {v: 0}, altVolumeLabel = '';
	for (i in this.listByUuid) {
		if (this.listMount[i]) {
			
			
			dataFromMem = this.listDisks[i];
			if (dataFromMem) {
				Settings.set(this.listByUuid[i], dataFromMem);
			}
			
			this.listByUuid[i] = this.getSdxFromLsOut(this.listMount[i]);
			altVolumeLabel = this.getUnknownVolume(this.listByUuid[i], unknownVolumeFound);
			
			if (1 == unknownVolumeFound.v) {
				this.listByUuid[i] = altVolumeLabel;
			} else {
				this.unknownVolumeCounter--;
			}
			
		} else {
			this.listByUuid[i] = this.getUnknownVolume(this.listByUuid[i], unknownVolumeFound);
		}
	}
}

Devices.prototype.findDiskPartByPath = function(path) {
	var i, SZ = sz(this.listDisks), mx = 0, j, len = 0, target;
	for (i in this.listDisks) {
		j = this.listDisks[i];
		if (path.indexOf(j.d) === 0) {
			if (sz(j.d) > len) {
				len = sz(j.d);
				target = j;
			}
		}
	}
	
	return target;
}

Devices.prototype.getPluralFreeSpaceOfDiskPartByPath = function(path) {
	var s = this.getFreeSpaceOfDiskPartByPath(path);
	if (!s) {
		return '';
	}
	
	return L('free') + ' ' + s;
}

Devices.prototype.getFreeSpaceOfDiskPartByPath = function(path) {
	var target = this.findDiskPartByPath(path);
	if (!target) {
		return '';
	}
	
	return this.pluralizeSize(target.f, 1);
}

Devices.prototype.parseDfhOut = function(duhout) {
	var lines = duhout.split('\n'), i, list = {}, buf = [], s, SZ = sz(lines), key, val;
	for (i = 0; i < SZ; i++) {
		if (lines[i].indexOf('/') == -1) {
			continue;
		}
		buf = lines[i].split(/\s+/);
		key = this.getSdxFromLsOut(String(buf[0]));
		val = {
			sz: String(buf[1]).trim(),
			u: String(buf[2]).trim(),
			f: String(buf[3]).trim(),
			d: this.parseMountPoint(buf)
		};
		
		list[key] = val;
	}
	
	return list;
}

Devices.prototype.parseMountPoint = function(aLine) {
	var aR = [], i, SZ = sz(aLine);
	for (i = 5; i < SZ; i++) {
		aR.push(aLine[i])
	}
	
	return aR.join(' ').trim();
}

Devices.prototype.getUnknownVolume = function(uuid, oFound) {
	// TODO сгонять в конфиг, который будет заполняться при монтировании и извлечь оттуда размер
	var data = Settings.get(uuid);
	
	
	if (data) {
		oFound.v = 1;
		return L('Volume') + ' ' + this.pluralizeSize(data.sz);
	}
	oFound.v = 0;
	this.unknownVolumeCounter++;
	return L('Unknown Vol. (') + this.unknownVolumeCounter + ')';
}


Devices.prototype.pluralizeSize = function(sz, noRound) {
	var m = L('Bytes'), buf;
	sz = String(sz);
	if (sz.indexOf('G') != -1) {
		m = L('GB');
	}
	if (sz.indexOf('M') != -1) {
		m = L('MB');
	}
	if (sz.indexOf('K') != -1) {
		m = L('KB');
	}
	
	buf = sz.split(',');
	if (!noRound) {
		sz = buf[0].replace(/[\D]/mig, '');
	} else {
		if (buf[1]) {
			sz = buf[0].replace(/[\D]/mig, '') + ',' + buf[1].replace(/[\D]/mig, '');
		} else {
			sz = buf[0].replace(/[\D]/mig, '');
		}
	}
	
	return sz + ' ' + m;
}

Devices.prototype.excludeAllLabelsFromUuidList = function() {
	var i, result = {};
	
	for (i in this.listByLabel) {
		if (this.listByUuid[i]) {
			delete this.listByUuid[i];
		}
	}
}

/**
 * @return {
 * 	"xdxN" => "/media/user/KINGSTON",
 * 	"xdxN" => "/home",
 * 	"xdxN" => "/"
 * } 
 * */
Devices.prototype.parseMountListOut = function(mountout) {
	var lines = mountout.split('\n'), i, list = {}, buf = [], s, SZ = sz(lines), key, val;
	for (i = 0; i < SZ; i++) {
		buf = lines[i].split('type');
		buf = buf[0].split(' on ');
		key = String(buf[0]);
		val = String(buf[1]).trim();
		if (key.indexOf('/dev/') != -1) {
			key = this.getSdxFromLsOut(key);
			list[key] = val;
		}
	}
	
	return list;
}

Devices.prototype.parseLsOut = function(lsout) {
	var lines = lsout.split('\n'), i, list = {}, buf = [], s, SZ = sz(lines), key, val;
	for (i = 0; i < SZ; i++) {
		if (lines[i].indexOf('->') == -1) {
			continue;
		}
		buf = lines[i].split('->');
		key = this.getSdxFromLsOut(String(buf[1]));
		val = String(buf[0]).trim();
		buf = val.split(' ');
		val = buf[sz(buf) - 1];
		list[key] = val;
	}
	
	return list;
}

Devices.prototype.getSdxFromLsOut = function(rawSdxN) {
	var a = rawSdxN.split('/');
	return a[sz(a) - 1];
}

Devices.prototype.addItem = function(name, path, xdxN) {
	var item = {
			displayName : '',
			icon: App.dir() + '/i/hdd_mount32.png',
			path: '',
			xdxN: xdxN
		}, i, foundInPrev = 1, SZ;
	
	item.displayName = name;
	item.path = path;
	item.cmId = "cmDiskMenu";
	if (!path) {
		item.icon = App.dir() + '/i/disk32.png';
	}
	
	if (this.prevList) {
		SZ = sz(this.prevList);
		foundInPrev = 0;
		for (i = 0; i < SZ; i++) {
			if (this.prevList[i].displayName == name || name.indexOf(L('Volume')) != -1) {
				foundInPrev = 1;
				break;
			}
		}
	}
	
	if (!foundInPrev || this.removableDevices[name]) {
		item.icon = App.dir() + '/i/usb32.png';
		item.cmId = "cmUsbMenu";
		this.removableDevices[name] = 1;
		Settings.set('rds', this.removableDevices);
	}
	
	this.list.push(item);
	
}



/**
 * Поддерживаем только ru и en
*/
Devices.prototype.getLocale = function(user) {
	if (FS.fileExists('/home/' + user + '/Загрузки')) {
		return 'ru';
	}
	
	return 'en';
}

Devices.prototype.onClickOpen = function() {
	this.onClick({currentTarget: e(this.itemIdPrefix + window.currentCmTargetId)});
}

Devices.prototype.onClickMount = function() {
	var n = window.currentCmTargetId,
		isMounted = false,
		cmd = "#!/bin/bash\nudisksctl mount -b /dev/",
		sh = App.dir() + "/sh/o.sh",
		path;
	if (FS.fileExists(this.list[n].path) && FS.isDir(this.list[n].path)) {
		// FS.writefile(this.list[n].path + "/.qdjsfm", "Hello");
		// if (FS.fileExists(this.list[n].path + "/.qdjsfm")) {
			isMounted = true;
		// }
		// FS.unlink(this.list[n].path + "/.qdjsfm");
	}
	if (!isMounted && this.list[n].xdxN) {
		cmd += this.list[n].xdxN;
		FS.writefile(sh, cmd);
		jexec(sh, DevNull, DevNull, [this, this.onErrMount]);
	}
}

Devices.prototype.onClickUnmount = function() {
	var n = window.currentCmTargetId,
		isMounted = false,
		cmd = "#!/bin/bash\nudisksctl unmount -b /dev/",
		sh = App.dir() + "/sh/o.sh";
	if (!isMounted && this.list[n].xdxN) {
		cmd += this.list[n].xdxN;
		FS.writefile(sh, cmd);
		jexec(sh, function(){
			app.setActivePath('/home/' + USER, 'devicesManager');
		}, DevNull, [this, this.onErrMount]);
	}
}

Devices.prototype.onClickEject = function() {
	var n = window.currentCmTargetId,
		isMounted = false,
		o = this,
		cmd = "#!/bin/bash\nudisksctl unmount -b /dev/",
		sh = App.dir() + "/sh/o.sh",
		path;
	if (FS.fileExists(this.list[n].path) && FS.isDir(this.list[n].path)) {
		FS.writefile(this.list[n].path + "/.qdjsfm", "Hello");
		if (FS.fileExists(this.list[n].path + "/.qdjsfm")) {
			isMounted = true;
		}
		FS.unlink(this.list[n].path + "/.qdjsfm");
	}
	if (isMounted && this.list[n].xdxN) {
		cmd += this.list[n].xdxN;
		FS.writefile(sh, cmd);
		jexec(sh, function(){
			app.setActivePath('/home/' + USER, 'devicesManager');
			cmd = "#!/bin/bash\nudisksctl power-off -b /dev/" + o.list[n].xdxN;
			sh = App.dir() + "/sh/o.sh";
			FS.writefile(sh, cmd);
			jexec(sh, DevNull, DevNull, [this, this.onErrMount]);
		}, DevNull, [this, this.onErrMount]);
	} else if (this.list[n].xdxN){
		cmd = "#!/bin/bash\nudisksctl power-off -b /dev/" + this.list[n].xdxN;
		sh = App.dir() + "/sh/o.sh";
		FS.writefile(sh, cmd);
		jexec(sh, DevNull, DevNull, [this, this.onErrMount]);
	}
}

