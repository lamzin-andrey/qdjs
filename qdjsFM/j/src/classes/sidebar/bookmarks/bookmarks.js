function Bookmarks() {
	this.username = '';
	this.itemIdPrefix = 'bm';
	this.list = [];
	this.is_run = false;
}
extend(AbstractList, Bookmarks);
Bookmarks.prototype.setUser = function(s) {
	this.username = s;
}

Bookmarks.prototype.isRun = function() {
	return this.is_run;
}
Bookmarks.prototype.run = function() {
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
	try {
		this.render();
		this.is_run = true;
	} catch (err) {
		alert(err);
	}
}

Bookmarks.prototype.onClick = function(event) {
	var trg = ctrg(event),
		n = str_replace(this.itemIdPrefix, '', trg.id);
	app.setActivePath(this.list[n].path, 'bookmarksManager');
}


Bookmarks.prototype.createList = function(locale, user) {
	var userBookmarks = [], i, SZ = 0;
	this.list = [];
	this.addItem(user, '', locale);
	// this.addItem(user, 'tmp/00/05', locale);
	// this.addItem(user, 'tmp/00/04/cannibball', locale);
	// this.addItem(user, 'hdata/programs/my/qdjs/qdjsFM', locale);
	this.addItem(user, 'Downloads', locale);
	this.addItem(user, 'Desktop', locale);
	this.addItem(user, 'Documents', locale);
	this.addItem(user, 'Music', locale);
	this.addItem(user, 'Images', locale);
	this.addItem(user, 'Videos', locale);
	
	userBookmarks = this.readUserBookmarks();
	// alert(JSON.stringify(userBookmarks));
	if (userBookmarks) {
		SZ = sz(userBookmarks);
	}
	for (i = 0; i < SZ; i++) {
		this.addItem(user, userBookmarks[i].path.trim(), locale, userBookmarks[i].displayName, 'cmBmMenu');
	}
	
	// this.addUserItems(user); // TODO
}
// sysCmId - задействуем потом
Bookmarks.prototype.addItem = function(user, name, locale, displayName, userCmId, sysCmId) {
	var item = {
			displayName : '',
			icon: App.dir() + '/i/folder32.png',
			path: ''
		}, 
		srcName = name;
	if (!name) {
		item.displayName = user;
		item.icon = App.dir() + '/i/home32.png';
		item.path = '/home/' + user;
	} else {
		name = this.getLocaleFolderName(name, locale);
		item.displayName = name;
		item.path = '/home/' + user + '/' + name;
		if (!FS.fileExists(item.path)) {
			item.path = '/home/' + user + '/' + srcName;
		}
		if (srcName.indexOf('/') == 0) {
			item.path = srcName.trim();
			if (userCmId) {
				item.cmId = userCmId;
			}
		}
		if (!FS.fileExists(item.path)) {
			item.path = '';
		}
		if (displayName) {
			item.displayName = displayName;
		}
	}
	
	if (item.path != '') {
		item.icon = this.getIconByName(srcName);
		this.list.push(item);
	}
}
Bookmarks.prototype.getIconByName = function(name) {
	switch (name) {
		case 'Desktop':
			return App.dir() + '/i/desktop32.png';
		case 'Documents':
			return App.dir() + '/i/documents32.png';
		case 'Music':
			return App.dir() + '/i/music32.png';
		case 'Images':
			return App.dir() + '/i/images32.png';
		case 'Videos':
			return App.dir() + '/i/videos32.png';
		case 'Downloads':
			return App.dir() + '/i/downArrow32.png';
	}
	return App.dir() + '/i/folder32.png';
}

Bookmarks.prototype.getLocaleFolderName = function(name, locale) {
	var pathInfo;
	if ('ru' != locale) {
		return name;
	}
	switch (name) {
		case 'Desktop':
			return 'Рабочий стол';
		case 'Documents':
			return 'Документы';
		case 'Music':
			return 'Музыка';
		case 'Images':
			return 'Изображения';
		case 'Videos':
			return 'Видео';
		case 'Downloads':
			return 'Загрузки';
	}
	pathInfo = pathinfo(name);
	return pathInfo.basename;
	
}

/**
 * Поддерживаем только ru и en
*/
Bookmarks.prototype.getLocale = function(user) {
	if (FS.fileExists('/home/' + user + '/Загрузки')) {
		return 'ru';
	}
	
	return 'en';
}

Bookmarks.prototype.addNewBm = function(path, name) {
	var uaBm;
	try {
		uaBm = this.readUserBookmarks();
	
	
		uaBm.splice(0, 0, {
			path:path,
			name: name,
			displayName: name
		});
		
		this.saveBookmarks(uaBm); // TODO
	} catch (er) {
		alert(er);
	}
}

Bookmarks.prototype.readUserBookmarks = function() {
	var bookmarksKey,
		bookmarks = Settings.get('bms') || {},
		uaBmData,
		uaBm;
	if (!window.USER) {
		return;
	}
	uaBmData = bookmarks[USER] || {};
	bookmarksKey = uaBmData['k'] || 'def';
	uaBm = uaBmData['L'] || {};
	uaBm = uaBm[bookmarksKey] || [];
	return uaBm;
}

Bookmarks.prototype.writeUserBookmarks = function(list, newKey) {
	var bookmarksKey,
		bookmarks = Settings.get('bms') || {},
		uaBmData,
		uaBm;
	if (!window.USER) {
		return;
	}
	uaBmData = bookmarks[USER] || {};
	bookmarksKey = uaBmData['k'] || 'def';
	uaBm = uaBmData['L'] || {};
	// uaBm = uaBm[bookmarksKey] || [];
	if (newKey) {
		bookmarksKey = newKey;
	}
	uaBm[bookmarksKey] = list;
	uaBmData['L'] = uaBm;
	bookmarks[USER] = uaBmData;
	Settings.set('bms', bookmarks);
}

Bookmarks.prototype.saveBookmarks = function(uaBm) {
	this.writeUserBookmarks(uaBm);
	this.createList(this.getLocale(USER), USER);
	this.render();
	app.setSidebarScrollbar();
}

Bookmarks.prototype.onClickRename = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, newName;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			newName = prompt(L("Enter new name"), data.displayName);
			if (newName) {
				ls[i].displayName = newName;
				this.saveBookmarks(ls);
			}
			break;
		}
	}
}

Bookmarks.prototype.onClickRemove = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, newName;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			if (confirm(L("Are you sure remove bookmark") + " " + data.displayName + '?')) {
				ls.splice(i, 1);
				this.saveBookmarks(ls);
			}
			break;
		}
	}
}

Bookmarks.prototype.onClickUp = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, buf;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			if (i - 1 > -1) {
				buf = ls[i - 1];
				ls[i - 1] = ls[i];
				ls[i] = buf;
				this.saveBookmarks(ls);
			}
			break;
		}
	}
}

Bookmarks.prototype.onClickDown = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, buf;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			if (i + 1 < SZ) {
				buf = ls[i + 1];
				ls[i + 1] = ls[i];
				ls[i] = buf;
				this.saveBookmarks(ls);
			}
			break;
		}
	}
}

Bookmarks.prototype.onClickOpen = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, buf;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			app.setActivePath(data.path, ['']);
			break;
		}
	}
}

Bookmarks.prototype.onClickOpenInTerm = function() {
	var id = 'bm' + currentCmTargetId, i, data = this.list[currentCmTargetId], SZ, ls, cmd,
			sh = App.dir() + "/sh/o.sh"
			;
	if (!e(id) || !data) {
		return;
	}
	ls = this.readUserBookmarks();
	SZ = sz(ls);
	for (i = 0; i < SZ; i++) {
		if (ls[i].displayName == data.displayName && ls[i].path == data.path) {
			cmd = app.tab.createOpenTermCommand(data.path);
			FS.writefile(sh, cmd);
			jexec(sh, DevNull, DevNull, DevNull);
			break;
		}
	}
}
