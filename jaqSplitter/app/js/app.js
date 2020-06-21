function e(i){return document.getElementById(i);}
function log(s) {
	e('log').innerHTML += '<div style="color:blue;">' + s + '</div>';
}
function onClickSelectTextFile() {
	var filepath = Qt.openFileDialog('Select text file utf-8 encoding', lastDir(), '*.txt'),
		s, i, q = '',
		//size source file
		sz, 
		suffix = 1,
		arr,
		//size readed file
		nCounter = 0,
		currentFile;
	if (filepath) {
		window.filepath = filepath;
		removeOutdir(filepath);
	}
	saveLastDir(filepath);
}
/**
 * @description Получить имя файла вида fole000Suffix.txt
 * @param filepath путь к исходному файлу
 * @param {Number} suffix цифровой суффикс
 * @param {Number}  sz размер исходного файла
 * @param {Number} limit размер части
 * @return String
*/

function getFilename(filepath, suffix, sz, limit)
{
	var nParts = Math.round(sz / limit),
		p = '0', prefix = '', i,
		dir = getTargetDir(filepath),
		out = '', shortname;
	shortname = getBasename(filepath);
	
	for (i = 0; i < (String(nParts).length - String(suffix).length); i++) {
		prefix += p;
	}
	
	if (dir) {
		out = dir + '/' + prefix + String(suffix) + shortname;
	}
	return out;
}

function removeOutdir(filepath) {
	var s = getTargetDir(filepath);
	if (s) {
		PHP.exec('rm -rf ' + s + '\n', 'onFin', 'onFin2', 'onFin2');
	}
}

function getTargetDir(filepath) {
	var catDir = getBasename(filepath).split('.')[0];
	var s = getDirByFilename(filepath) + '/' + catDir;
	return s;
}

function onFin(){
	var s = getTargetDir(window.filepath);
	if (s) {
		PHP.exec('mkdir ' + s, 'onFin3', 'onFin2', 'onFin2');
	}
}

function onFin3(stdin, stdout){
	
	var filepath = window.filepath;
	var sz = PHP.filesize(filepath);
	var s = '', i, q = '', nCounter = 0, suffix = 1, limit = 100*1024,
		arr = PHP.file_get_contents(filepath).split('\n'),
		currentFile;
	
	for (i = 0; i < arr.length; i++) {
		s = arr[i];
		q += s + '\n';
		nCounter += s.length + 1;
		if (nCounter > limit) {
			nCounter = 0;
			currentFile = getFilename(filepath, suffix, sz, limit);
			if (currentFile) {
				PHP.file_put_contents(currentFile, q);
			} else {
				alert('getFilename return false!');
			}
			q = '';
			suffix++;
		}
	}
	
	if (q != '') {
		currentFile = getFilename(filepath, suffix, sz, limit);
		if (currentFile) {
			PHP.file_put_contents(currentFile, q);
		} else {
			alert('getFilename return false!');
		}
	}
	alert('Done!');
}

function getBasename(filepath) {
	var arr = filepath.split('/');
	var shortname = arr[arr.length - 1];
	return shortname;
}

function onFin2(){}

function getDirByFilename(filepath) {
	var a, lastDir;
	a = filepath.split('/');
	a.splice(a.length - 1, 1);
	
	lastDir = a.join('/');
	if (PHP.file_exists(lastDir) && PHP.is_dir(lastDir)) {
		return lastDir;
	}
	alert('"' + lastDir + '" is not directory');
	return false;
}

function saveLastDir(filepath) {
	var s = Qt.appDir() + '/.data.txt', lastDir;
		lastDir = getDirByFilename(filepath)
	if (lastDir) {
		PHP.file_put_contents(s, lastDir);
		return true;
	}
	return false;
}

function lastDir() {
	var s = Qt.appDir() + '/.data.txt';
	if (PHP.file_exists(s)) {
		return PHP.file_get_contents(s);
	}
	return  Qt.appDir();
}

function initFileSplitterApp() {
	e('bSelectTxt').onclick = onClickSelectTextFile;
}

window.onload=initFileSplitterApp;
