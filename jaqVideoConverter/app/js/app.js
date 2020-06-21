window.onload = init;
function init(){
	window.procId = 0;
	e('bPlusFile').onclick = jmp3cutOnBrowse;
	e('bConvert').onclick = jmp3cutOnConvertClick;
}
function jmp3cutOnConvertClick() {
	if (W.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	if (W.filePath && PHP.file_exists(W.filePath)) {
		var cmd = '', dir, name = '', outfile;
		PHP.file_put_contents(jmp4convGetLogFilename(), '');
		//ffmpeg -i 01.mp4 -c:v libx264 -pix_fmt yuv420p zapekanka_s_tvorogom.avi 1>/home/andrey/log.log 2>&1
		cmd = '#! /bin/bash\ncd ' + jmp3cutGetDir() + ';\nrm -f ' + jmp3cutGetOutfile() +
			';\nffmpeg -i '	+ jmp3cutGetName() + ' -c:v libx264 -threads 3 -pix_fmt yuv420p ' +
			jmp3cutGetOutfile() + ' 1>' + jmp4convGetLogFilename() + ' 2>&1 \n';
		name = Qt.appDir() + '/sh.sh';
		PHP.file_put_contents(name, cmd);
		
		//cmd = 'cd ' + jmp3cutGetDir() + ';\navconv -i ' + jmp3cutGetName() + ' -ss ' + e('start').value + ' -t ' + e('duration').value + ' ' +
			//jmp3cutGetOutfile();
		
		procId = PHP.exec(name, 'jmp3cutOnFinish', 'jmp3cutOnStd', 'jmp3cutOnErr');
		W.convertProcIsRun = 1;
		//TODO следить за изменением размера файла, если перестал увеличиваться, значит финиш
		window.ival = setInterval(jmp3Observe, 500);
	} else {
		alert('Вам надо выбрать mp4 или mts файл');
	}
}
function jmp3Observe() {
	if (window.observeProcIsRun) {
		return;
	}
	observeProcIsRun = 1;
	window.sysId = PHP.getSysId(procId);
	PHP.exec('ps -Ac', 'jmp3cutOnObserveFinish', 'jmp3cutOnObserveStd', 'jmp3cutOnObserveErr');
	jmp4convSetProgressView();
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
	//alert('Fin  std = ' + std);
	//alert('Fin  err = ' + err);
}
function jmp3cutOnComplete() {
	clearInterval(window.ival);
	var msg = 'Done!';
	if (W.isInterrupt) {
		msg = 'Прервано пользователем';
	}
	jmp4convResetParams();
	e('hFileList').innerHTML = '';
	Qt.setTitle(msg);
	alert(msg);//alert('procId = ' + procId + '\n sysId = ' + sysId);
}
function jmp4convResetParams() {
	W.convertProcIsRun = 0;
	W.durationSetted = 0;
	W.isInterrupt = 0;
	W.filePath = '';
}
/**
 * @description Обработка нажатия кнопки выбора mp3 файла. Сохраняет последнюю директорию.
*/
function jmp3cutOnBrowse() {
	if (W.convertProcIsRun == 1) {
		alert('Уже выполняется конвертация');
		return;
	}
	W.filePath = Qt.openFileDialog('Выберите mp4 или mts файл', jmp3cutLastDir(), '*.mp4 *.mts');
	jmp3cutSaveSetting('lastDir', jmp3cutGetDir());
	//Set filename in view
	if (W.filePath) {
		jmp4convAddFileInfoBlock();
	}
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
	return "'" + a.join('/') + "'";
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
	base = a.join('.') + '-out.avi';
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

function jmp4convAddFileInfoBlock() {
	var s = jmp4convGetFileTpl().replace('{name}', jmp3cutGetOutfile());
	s = s.replace('{duration}', '00:00:00');
	appendChild('hFileList', 'div', s);
	e('hFileList').getElementsByClassName('close')[0].onclick = jmp4convOnClickRemoveBtn;
}

function jmp4convOnClickRemoveBtn() {
	if (W.convertProcIsRun) {
		W.isInterrupt = 1;
		var cmd = 'kill ' + sysId;
		PHP.exec(cmd + '\n', 'on');
		PHP.exec('killall ffmpeg' + '\n', 'on');
	} else {
		e('hFileList').innerHTML = '';
		jmp4convResetParams();
	}
}
function on() {}

function jmp4convSetProgressView() {
	jmp4convSetDuration();
	jmp4convSetCurrentProgress();
}
function jmp4convSetCurrentProgress() {
	if (parseInt(W.durationInSeconds)) {
		var s = PHP.file_get_contents( jmp4convGetLogFilename() ), sD = 'time=',
			start = s.lastIndexOf(sD) + sD.length, i, sTime = '', sAllow = '0123456789:', ch,
			nSeconds;
		if (start != -1) {
			for (i = start; i < s.length; i++) {
				ch = s.charAt(i);
				if (ch == '.') {
					break;
				}
				if (sAllow.indexOf(ch) != -1) {
					sTime += ch;
				}
			}
			//e('hFileList').getElementsByClassName('time')[0].innerHTML = sTime;
			nSeconds = jaqmp4convParseTimestring(sTime);
			var oneP = W.durationInSeconds / 100;
			var current = Math.ceil(nSeconds / oneP);
			if (!isNaN(nSeconds)) {
				Qt.setTitle(nSeconds + ' / ' + W.durationInSeconds + '(sTime = ' + sTime + ', start = ' + start + ')');
				e('extractPBar').style.display = 'block';
				e('dompb').style.width = current + '%';
				e('progressState').innerHTML = nSeconds + ' / ' + W.durationInSeconds + '(' + current + '%)';
			}
		}
	}
}
function jmp4convSetDuration() {
	if (!W.durationSetted) {
		var s = PHP.file_get_contents( jmp4convGetLogFilename() ), sD = 'Duration:',
			start = s.indexOf(sD) + sD.length, i, sTime = '', sAllow = '0123456789:', ch;
		if (start != -1) {
			for (i = start; i < s.length; i++) {
				ch = s.charAt(i);
				if (ch == '.') {
					break;
				}
				if (sAllow.indexOf(ch) != -1) {
					sTime += ch;
				}
			}
			e('hFileList').getElementsByClassName('time')[0].innerHTML = sTime;
			W.durationInSeconds = jaqmp4convParseTimestring(sTime);
			W.durationSetted = 1;
		}
	}
}

function jaqmp4convParseTimestring(sTime) {
	var a = sTime.split(':'),
		n = parseInt(a[0]) * 3600 + parseInt(a[1]) * 60 + parseInt(a[2]);
	return n;
}

function jmp4convGetFileTpl() {
	var tpl = '<div class="file">' +
				'<div class="fileBgLeft">&nbsp;</div>' + 
				'<div class="fileBgCenter">' + 
					'<img class="ufo" src="./img/ufo.png">' + 
					
					'<div class="fileListMetadata">' +
						'<div class="row firstStr">' + 
							'<img class="fileListMetadataIcon" src="./img/pen.png">' + 
							'<span class="name">{name}</span>' + 
						'</div>' + 
						'<div class="row secondStr">' + 
							'<img class="fileListMetadataIcon" src="./img/clock.png">' +
							'<span class="time">{duration}</span>' +
							'<img class="fileListMetadataIcon" src="./img/frame.png">' +
							'<span class="codec">H264</span>' +
						'</div>' +
					'</div>\
					<div class="fileListProgressView">\
						<div class="row pbar">\
							\
							<div id="extractPBar" style="display:none;">\
								 <div class="text-center" id="progressStateLabel">\
									Выполняется конвертация...\
								 </div>\
								 <div style="line-height:28px;">\
									 <!-- #1A772C -->\
									 <div style="width:100%; border:1px solid #252526; border-radius:4px; height:10px;background-color:white;">\
										 <!--/* background-image: -webkit-linear-gradient(top, #049cdb, #0064cd); */-->\
										 \
										<div style="width:0%;  height:10px;" id="dompb">&nbsp;</div>\
									 </div>\
								 </div>\
								 <div class="text-center" id="progressState">\
									10200 / 8821848 (50%)\
								 </div>\
							 </div>\
							\
						</div>\
					</div>' + 
				'</div>' + 
				'<div class="fileBgRight">' + 
					'<img class="close" src="./img/close.png">' + 
				'</div>' + 
				'<div class="clear"></div>' +
			'</div>';
	return tpl;
}

function jmp4convGetLogFilename() {
	return Qt.appDir() +  '/' + jmp3cutGetOutfile() + '.log';
}
