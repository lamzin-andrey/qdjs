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
	
	this.render();
	this.is_run = true;
}

Bookmarks.prototype.onClick = function(event) {
	var trg = ctrg(event),
		n = str_replace(this.itemIdPrefix, '', trg.id);
	app.setActivePath(this.list[n].path, 'bookmarksManager');
}


Bookmarks.prototype.createList = function(locale, user) {
	this.list = [];
	this.addItem(user, '', locale);
	this.addItem(user, 'Downloads', locale);
	this.addItem(user, 'Desktop', locale);
	this.addItem(user, 'Documents', locale);
	this.addItem(user, 'Music', locale);
	this.addItem(user, 'Images', locale);
	this.addItem(user, 'Videos', locale);
	
	
	// this.addUserItems(user); // TODO
}
Bookmarks.prototype.addItem = function(user, name, locale) {
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
		if (!FS.fileExists(item.path)) {
			item.path = '';
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

