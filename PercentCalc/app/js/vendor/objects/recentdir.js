/**
 * version 1.1
 * @description Запускает Env.openFileDialog но при этом запоминает последнюю выбранную директорию
 * @param {String} sTitle - тайтл окна диалога
 * @param {String} sFileTypes  - @see Env.openFileDialog filetypes (for example '*.sql' in Linux)
*/
function jqlOpenFileDialog(sTitle, sFileTypes) {
	s = Env.openFileDialog(sTitle, RecentDir.jmp3cutLastDir(), sFileTypes);
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
 * @param {String} sFileTypes  - @see Env.openFileDialog filetypes (for example '*.sql' in Linux)
*/
function jqlOpenDirectoryDialog(sTitle, sFileTypes) {
	s = Env.openDirectoryDialog(sTitle, RecentDir.jmp3cutLastDir(), sFileTypes);
	if (!s) {
		return '';
	}
	RecentDir.filePath = s;
	RecentDir.jmp3cutSaveSetting('lastDir', RecentDir.jmp3cutGetDir(false));
	return s;
}
window.RecentDir  = {
	get:function(){
		return this.jmp3cutLastDir();
	},
	jmp3cutLastDir: function () {
		var def = App.dir(),
			s = this.jmp3cutGetSetting('lastDir', def);
			if (FS.fileExists(s) && FS.isDir(s)) {
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
		if (FS.fileExists(file)) {
			s = FS.readfile(file);
			try {
				//obj = JSON.parse(s);
				obj = $.parseJSON(s);
			} catch(e){
			    alert(e.message);
			}
		}
		obj = obj || {};
		return obj;
	},
	/**
	 * @return String
	*/
	jmp3cutGetConfFileName: function() {
		var def = App.dir(), conf = def + '/config.json';
		return conf;
	},
	jmp3cutSaveSetting: function(k, v) {
		var s, obj = this.jmp3cutLoadSettings(), file
			, i;
		obj[k] = v;
		//s = JSON.stringify(obj);
		s = jts(obj);
		file = this.jmp3cutGetConfFileName();
		FS.writefile(file, s);
	},
	jmp3cutRemoveSetting: function(k) {
	    var s, obj = this.jmp3cutLoadSettings(), file, r = false;
	    if (obj[k]) {
		delete obj[k];
		if (!obj[k]) {
		    r = true;
		}
	    }
	    //s = JSON.stringify(obj);
	    jts(obj);
	    file = this.jmp3cutGetConfFileName();
	    FS.writefile(file, s);
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
