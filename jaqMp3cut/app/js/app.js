window.onload = init;
function init(){
	window.procId = 0;
	e('browse').onclick = jmp3cutOnBrowse;
	e('convert').onclick = jmp3cutOnConvertClick;
}
function jmp3cutOnConvertClick() {
	if (W.filePath && PHP.file_exists(W.filePath)) {
		var cmd = '', dir, name = '', outfile;
		cmd = '#! /bin/bash\ncd ' + jmp3cutGetDir() + ';\nffmpeg -i ' + jmp3cutGetName() + ' -ss ' + e('start').value + ' -t ' + e('duration').value + ' ' +
			jmp3cutGetOutfile() + '\n';
		name = Qt.appDir() + '/sh.sh';
		PHP.file_put_contents(name, cmd);
		
		//cmd = 'cd ' + jmp3cutGetDir() + ';\navconv -i ' + jmp3cutGetName() + ' -ss ' + e('start').value + ' -t ' + e('duration').value + ' ' +
			//jmp3cutGetOutfile();
		
		procId = PHP.exec(name, 'jmp3cutOnFinish', 'jmp3cutOnStd', 'jmp3cutOnErr');
		//TODO следить за изменением размера файла, если перестал увеличиваться, значит финиш
		window.ival = setInterval(jmp3Observe, 500);
	} else {
		alert('Вам надо выбрать mp3 файл');
	}
}
function jmp3Observe() {
	if (window.observeProcIsRun) {
		return;
	}
	observeProcIsRun = 1;
	window.sysId = PHP.getSysId(procId);
	PHP.exec('ps -Ac', 'jmp3cutOnObserveFinish', 'jmp3cutOnObserveStd', 'jmp3cutOnObserveErr');
}
function jmp3cutOnObserveStd(std) {
	//alert('Live std = ' + std);
}
function jmp3cutOnObserveErr(err) {
	//alert('Live err = ' + err);
}
function jmp3cutOnObserveFinish(std, err) {
	var a = std.split('\n'), i, b, n, found = false, j;
	for (i = 0; i < a.length; i++) {
		b = a[i].split(' ');
		n = parseInt(b[0].trim(), 10);
		j = 1;
		while (isNaN(n)) {
			n = parseInt(String(b[j]).trim(), 10);
			j++;
			if (j >= sz(b)) {
				break;
			}
		}
		if (!isNaN(n)) {
			if (sysId == n) {
				found = true;
				break;
			}
		}
	}

	if (found == false) {
		jmp3cutOnComplete();
	}
	window.observeProcIsRun = 0;
}

function jmp3cutOnStd(std) {}
function jmp3cutOnErr(err) {}
function jmp3cutOnFinish(std, err) {
	alert('Fin  std = ' + std);
	alert('Fin  err = ' + err);
}
function jmp3cutOnComplete() {
	clearInterval(window.ival);
	alert('done!'); //alert('procId = ' + procId + '\n sysId = ' + sysId);
}
/**
 * @description Обработка нажатия кнопки выбора mp3 файла. Сохраняет последнюю директорию.
*/
function jmp3cutOnBrowse() {
	W.filePath = Qt.openFileDialog('Выберите mp3 файл', jmp3cutLastDir(), '*.mp3');
	jmp3cutSaveSetting('lastDir', jmp3cutGetDir());
}

function jmp3cutLastDir() {
	var def = Qt.appDir(),
		s = jmp3cutGetSetting('lastDir', def);
		if (PHP.file_exists(s) && PHP.is_dir(s)) {
			return s;
		}
	return def;
}
function jmp3cutGetDir() {
	var a = W.filePath.split('/');
	a.pop();
	return a.join('/');
}
function jmp3cutGetName() {
	var a = W.filePath.split('/');
	return a.pop();
}
function jmp3cutGetOutfile() {
	var name = jmp3cutGetName(),
		a = name.split('.'),
		ext = a[sz(a) - 1],
		base;
	a.pop();
	base = a.join('.') + '-out.' + ext;
	return base;
}
//----

/**
 * @return String
*/
function jmp3cutGetConfFileName() {
	var def = Qt.appDir(), conf = def + '/jaqmp3conf.json';
	return conf;
}

function jmp3cutSaveSetting(k, v) {
	var s, obj = jmp3cutLoadSettings(), file;
	obj[k] = v;
	s = JSON.stringify(obj);
	file = jmp3cutGetConfFileName();
	PHP.file_put_contents(file, s);
}

function jmp3cutGetSetting(k, def) {
	var s, obj = jmp3cutLoadSettings();
	s = obj[k] ? obj[k] : def;
	return s;
}
/**
 * @return Object
*/
function jmp3cutLoadSettings() {
	var file = jmp3cutGetConfFileName(), obj,
		s = '';
	if (PHP.file_exists(file)) {
		s = PHP.file_get_contents(file);
		try {
			obj = JSON.parse(s);
		} catch(e){;}
	}
	obj = obj || {};
	return obj;
}
