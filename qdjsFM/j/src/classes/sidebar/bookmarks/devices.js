function Devices() {
	this.username = '';
	this.itemIdPrefix = 'dc';
	this.list = [];
	this.is_run = false;
}
extend(AbstractList, Devices);

Devices.prototype.run = function() {
	console.log('Devices is run');
	this.init('devicesBlock', L('Devices'));
	this.createList();
	this.render();
	this.is_run = true;
}

Devices.prototype.setUser = function(s) {
	this.username = s;
}

Devices.prototype.isRun = function() {
	return this.is_run;
}
/*Devices.prototype.run = function() {
	// console.log('Bookmarks run');
	var user = this.username,
		locale, title;
	if (!user && window.USER) {
		user = window.USER;
	}
	
	if (!user) {
		return;
	}
	this.init('bookmarksBlock', L('Bookmarks'));
	
	locale = this.getLocale(user);
	title = L('Bookmarks');
	this.createList(locale, user);
	
	this.render();
	this.is_run = true;
}*/

Devices.prototype.onClick = function(event) {
	var trg = ctrg(event),
		n = str_replace(this.itemIdPrefix, '', trg.id);
	app.setActivePath(this.list[n].path, 'devicesManager');
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
	// alert('onMountList:' + stdout);
	var i, path, skip = In('/', '/home');
	this.listDisks = this.parseDfhOut(stdout);
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
		this.addItem(this.listByLabel[i], this.listMount[i]);
	}
	
	// Добавить в this.list элементы из listByUuid с учетом монтированости (есть в listMount значит монтирован)
	console.log('skip', skip);
	for (i in this.listByUuid) {
		if (!skip[this.listMount[i]]) {
			this.addItem(this.listByUuid[i], this.listMount[i]);
		}
	}
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
			f: String(buf[3]).trim()
		};
		
		list[key] = val;
	}
	
	console.log('parseDfhOut: ', list);
	
	return list;
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


Devices.prototype.pluralizeSize = function(sz) {
	console.log(sz);
	var m = '';
	sz = String(sz);
	if (sz.indexOf('G') != -1) {
		m = L('GB');
		console.log('Set GB!');
	}
	if (sz.indexOf('M') != -1) {
		m = L('MB');
		console.log('Set MB!');
	}
	
	sz = sz.split(',')[0];
	sz = sz.replace(/[\D]/mig, '');
	
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

Devices.prototype.addItem = function(name, path) {
	var item = {
			displayName : '',
			icon: App.dir() + '/i/hdd_mount32.png',
			path: ''
		};
	
	item.displayName = name;
	item.path = path;
	if (!path) {
		item.icon = App.dir() + '/i/disk32.png';
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

