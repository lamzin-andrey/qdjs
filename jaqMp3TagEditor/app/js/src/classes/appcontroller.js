/**
*/
function AppController(statusTextId, bBrowseId, ffmpeg) {
	this.hStatusText = e(statusTextId);
	this.bBrowse = e(bBrowseId);
	this.bConvertNow = e('bConvertNow');
	this.list = [];
	this.ffmpeg = ffmpeg;
	this.pBar = new PBar();
	e('iNumber').value = 1;
	e('iYear').value = new Date().getFullYear();
	this.setListeners();
}

AppController.prototype.setListeners = function() {
	var self = this;
	this.bBrowse.onclick = function(evt) {
		try {
			return self.onBrowse(evt);
		} catch(E) {
			alert(E);
		}
	}
	this.bConvertNow.onclick = function(evt) {
		return self.onConvertNow(evt);
	}
}
/**
 * @return 
*/
AppController.prototype.onConvertNow = function(evt) {
	this.bConvertNow.disabled = true;
	var i;
	this.iterator = -1;
	this.convertNextFile();
	// this.ffmpeg.setMetadata(this.list
}
/**
 * @description Convert one mp3 file from list
*/
AppController.prototype.convertNextFile = function() {
	this.iterator++;
	if (this.iterator < sz(this.list)) {
		try {
			// alert(this.dir + '/' + this.list[this.iterator]);
			var title = this.getTitle(this.list[this.iterator], e('iTitle').value),// TODO 
				n = this.getNumber(e('iNumber').value);// TODO
			this.ffmpeg.setMetadata(this.dir + '/' + this.list[this.iterator], e('iGenre').value, title,
				n,
				e('iArtist').value,
				e('iAlbum').value,
				e('iComment').value,
				e('iYear').value,
				'',
				'',
				{context:this, m: this.onConvertFile}
				);
		} catch (E) {
			alert(E);
		}
	} else {
		this.bConvertNow.disabled = false;
		this.nextN = 'undefined';
		this.ffmpeg.clearMetadataFile();
		alert(L('Готово!'));
	}	
}

/**
 * @description 
*/
AppController.prototype.getNumber = function(defaultNumber) {
	if (e('cbAutoincrement').checked) {
		if (isU(this.nextN)) {
			this.nextN = parseInt(defaultNumber, 10);
			this.nextN = isNaN(this.nextN) ? 0 : this.nextN;
		} else {
			this.nextN++;
		}
		
		return this.nextN;
	}	
	return defaultNumber;
}
/**
 * @description 
*/
AppController.prototype.getTitle = function(fileShortname, defaultTitle) {
	if (e('cbTitle').checked) {
		var ls = fileShortname.split('.'), i, res = [];
		for (i = 0; i < sz(ls) - 1; i++) {
			res.push(ls[i]);
		}
		return res.join('.');
	}
	
	return defaultTitle;
}
/**
 * @description 
*/
AppController.prototype.onConvertFile = function(stdin, stderr) {
	// alert('Call onConvertFile');
	/*if (stderr) {
		this.bConvertNow.disabled = false;
		alert(stderr);
		return;
	}*/
	this.pBar.set(this.iterator + 1, sz(this.list));
	this.convertNextFile();
}
/**
 * @return 
*/
AppController.prototype.onBrowse = function(evt) {
	var dir = jqlOpenDirectoryDialog('Select folder with mp3 files', ''), // *.mp3
		ls = PHP.scandir(dir), i, res = [], aPath, sZ;
	for (i = 0; i < sz(ls); i++) {
		aPath = ls[i].split('.');
		if (aPath[sz(aPath) - 1] == 'mp3') {
			res.push(ls[i]);
		}
	}
	res.sort();
	this.dir = dir;
	this.list = res;
	sZ = sz(res);
	if (!sZ) {
		this.hStatusText.innerHTML = L('В каталоге не найдено mp3 файлов');
		stl(e('extractPBar'), 'display', 'none');
		e('progressStateLabel').innerHTML = L('Нажмите кнопку ниже');
		e('progressState').innerHTML = '0%';
	} else {
		// TODO pluralize
		this.hStatusText.innerHTML = L('В каталоге найдено ') + sZ + ' ' + L('mp3 файлa');
		stl(e('extractPBar'), 'display', 'block');
		e('progressStateLabel').innerHTML = L('Нажмите кнопку ниже');
		e('progressState').innerHTML = '0 / ' + sZ + ' (0%)';
	}
}
