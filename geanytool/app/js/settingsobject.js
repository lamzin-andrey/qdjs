/**
 * Инструмент взамен localStorage
*/
function SettingsObject(id) {
	if (!id) {
		id = 'settings.json';
	}
	this.file = Qt.appDir() + '/' + id;
}
/**
 * @description Сохранить или получить значение с ключем key
*/
SettingsObject.prototype.storage = function(key, data) {
	var L = this;
	if (L) {
		if (data === null) {
			L.removeItem(key);
		}
		/*if (!(data instanceof String)) {
			data = JSON.stringify(data);
		}*/
		if (!data) {
			data = L.getItem(key);
			if (data) {
				/*try {
					data = JSON.parse(data);
				} catch(e){;}*/
			}
		} else {
			L.setItem(key, data);
		}
		L.flush();
	}
	return data;
}
/**
 * @description Установить значение по ключу
*/
SettingsObject.prototype.removeItem = function(sKey, val) {
	this.load();
	delete this.data[sKey];
}
/**
 * @description Установить значение по ключу
*/
SettingsObject.prototype.setItem = function(sKey, val) {
	this.load();
	this.data[sKey] = val;
}
/**
 * @description Получить значение по ключу
*/
SettingsObject.prototype.getItem = function(sKey) {
	this.load();
	return this.data[sKey];
}
/**
 * @description Сохранить JSON в файл
*/
SettingsObject.prototype.flush = function() {
	PHP.file_put_contents( this.file, JSON.stringify(this.data) );
}
/**
 * @description Загрузить JSON из файла
*/
SettingsObject.prototype.load = function() {
	if (this.data) {
		return this.data;
	}
	var data = {};
	if (PHP.file_exists(this.file)) {
		try {
			data = JSON.parse( PHP.file_get_contents(this.file) );
		} catch(e){	;}
	}
	this.data = data;
}
