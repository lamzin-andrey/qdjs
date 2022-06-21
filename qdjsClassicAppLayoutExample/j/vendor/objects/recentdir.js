/**
 * version 1.0
 * @description Запускает Qt.openFileDialog но при этом запоминает последнюю выбранную директорию
 * @param {String} sTitle - тайтл окна диалога
 * @param {String} sFileTypes  - @see Qt.openFileDialog filetypes (for example '*.sql' in Linux)
*/
function jqlOpenFileDialog(sTitle, sFileTypes) {
	s = Qt.openFileDialog(sTitle, RecentDir.jmp3cutLastDir(), sFileTypes);
	if (!s) {
		return '';
	}
	RecentDir.filePath = s;
	RecentDir.jmp3cutSaveSetting('lastDir', RecentDir.jmp3cutGetDir());
	return s;
}
/**
 * @description Запускает Qt.openDirectoryDialog но при этом запоминает последнюю выбранную директорию
 * @param {String} sTitle - тайтл окна диалога
 * @param {String} sFileTypes  - @see Qt.openFileDialog filetypes (for example '*.sql' in Linux)
*/
function jqlOpenDirectoryDialog(sTitle, sFileTypes) {
	s = Qt.openDirectoryDialog(sTitle, RecentDir.jmp3cutLastDir(), sFileTypes);
	if (!s) {
		return '';
	}
	RecentDir.filePath = s;
	RecentDir.jmp3cutSaveSetting('lastDir', RecentDir.jmp3cutGetDir(false));
	return s;
}
function jqlSaveFileDialog(sTitle, sFileTypes) {
	s = Qt.saveFileDialog(sTitle, RecentDir.jmp3cutLastDir(), sFileTypes);
	if (!s) {
		return '';
	}
	RecentDir.filePath = s;
	RecentDir.jmp3cutSaveSetting('lastDir', RecentDir.jmp3cutGetDir());
	return s;
}
window.RecentDir  = {
	jmp3cutLastDir: function () {
		var def = Qt.appDir(),
			s = this.jmp3cutGetSetting('lastDir', def);
			if (PHP.file_exists(s) && PHP.is_dir(s)) {
				return s;
			}
		return def;
	},
	jmp3cutGetSetting: function(k, def) {
		var s, obj = this.jmp3cutLoadSettings();
		s = obj[k] ? obj[k] : def;
		return s;
	},
	/**
	 * @return Object
	*/
	jmp3cutLoadSettings: function () {
		var file = this.jmp3cutGetConfFileName(), obj,
			s = '';
		if (PHP.file_exists(file)) {
			s = PHP.file_get_contents(file);
			try {
				obj = JSON.parse(s);
			} catch(e){
			    alert(e);
			}
		}
		obj = obj || {};
		return obj;
	},
	/**
	 * @return String
	*/
	jmp3cutGetConfFileName: function() {
		var def = Qt.appDir(), conf = def + '/config.json';
		return conf;
	},
	jmp3cutSaveSetting: function(k, v) {
		var s, obj = this.jmp3cutLoadSettings(), file;
		obj[k] = v;
		s = JSON.stringify(obj);
		file = this.jmp3cutGetConfFileName();
		PHP.file_put_contents(file, s);
	},
	jmp3cutRemoveSetting: function(k) {
	    var s, obj = this.jmp3cutLoadSettings(), file, r = false;
	    if (obj[k]) {
		delete obj[k];
		if (!obj[k]) {
		    r = true;
		}
	    }
	    s = JSON.stringify(obj);
	    file = this.jmp3cutGetConfFileName();
	    PHP.file_put_contents(file, s);
	    return r;
	},
	/**
	 * @param {Boolean} cutLast = true
	 */
	jmp3cutGetDir: function (cutLast) {
		cutLast = String(cutLast) == 'undefined' ? true : false;
		
		if (!cutLast) {
			return this.filePath;
		}
		
		var a = this.filePath.split('/');
		a.pop();
		return a.join('/');
	}
}
