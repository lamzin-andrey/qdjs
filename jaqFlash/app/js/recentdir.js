/**
 * version 1.0
 * @description Запускает Qt.openFileDialog но при этом запоминает последнюю выбранную директорию
 * @param {String} sTitle - тайтл окна диалога
 * @param {String} sFileTypes  - @see Qt.openFileDialog filetypes
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
			} catch(e){;}
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
	jmp3cutGetDir: function () {
		var a = this.filePath.split('/');
		a.pop();
		return a.join('/');
	}
}
