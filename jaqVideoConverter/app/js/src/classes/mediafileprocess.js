function MediaFileProcess() {
	this.procId = 0;
	this.outputFormat = 'avi';
	this.ffmpeg = new FFMpeg(Qt.appDir() + '/js/vendor/classes/ffmpeg');
}


MediaFileProcess.prototype.resetParams = function() {
	this.convertProcIsRun = 0;
	this.durationSetted = 0;
	this.isInterrupt = 0;
	this.filePath = '';
	this.outputFormat = 'avi';
}

/**
 * @return Boolean isRun
*/
MediaFileProcess.prototype.convert = function(outputFormat) {
	if (this.filePath && PHP.file_exists(this.filePath)) {
		this.outputFormat = outputFormat;
		this.actualizeName();
		var cmd = '', dir, name = '', outfile, o = this;
		
		PHP.file_put_contents(this.getLogFilename(), '');
		try {
			this.setPreview();
		} catch (sp) {
			alert(sp);
		}
		
		if ('avi' == outputFormat) {
			//ffmpeg -i 01.mp4 -c:v libx264 -pix_fmt yuv420p zapekanka_s_tvorogom.avi 1>/home/andrey/log.log 2>&1
			cmd = '#! /bin/bash\ncd ' + this.getDir() + ';\nrm -f "' + this.getOutfile() +
			'";\nffmpeg -i "'	+ this.getName() + '" -c:v libx264 -threads 3 -pix_fmt yuv420p "' +
			this.getOutfile() + '" 1>"' + this.getLogFilename() + '" 2>&1 \n' + this.getOnFinishSettingAction();
		}
		
		if ('mp3' == outputFormat) {
			//ffmpeg -i /media/andrey/Transcend/HBPVR/МАЯК-01092021-0937.mts -q:a 0 -map a /media/andrey/Transcend/HBPVR/new_year-09-01-2021.mp3
			cmd = '#! /bin/bash\ncd ' + this.getDir() + ';\nrm -f "' + this.getOutfile() +
			'";\nffmpeg -i "'	+ this.getName() + '" -q:a 0 -map a -threads 3  "' +
			this.getOutfile() + '" 1>"' + this.getLogFilename() + '" 2>&1 \n' + this.getOnFinishSettingAction();
		}
		
		
		// alert(cmd);
		name = Qt.appDir() + '/sh.sh';
		PHP.file_put_contents(name, cmd);
		
		
		
		// следить за изменением размера файла, если перестал увеличиваться, значит финиш
		this.ival = setInterval(function(){
			try {
				o.observe();
			} catch (ex) {
				if (window.debug) {
					log(ex);
				}
			}
		}, 500);
		
		// TODO здесь ничего пока не поделаешь... Хотя похоже что всё можно заменить на on
		this.procId = PHP.exec(name, 'jmp3cutOnFinish', 'jmp3cutOnStd', 'jmp3cutOnErr');
		this.sysId = PHP.getSysId(this.procId);
		this.convertProcIsRun = 1;
		
		return true;
	}
	
	return false;
}
MediaFileProcess.prototype.onObserve = function(std, err) {
	try {
		var a = std.split('\n'), i, b, n, found = false, j, result, f = 'on';
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
				if (this.sysId == n) {
					found = true;
					break;
				}
			}
		}

		if (found == false || this.percentsIsComplete) {
			if (this.percentsIsComplete && found) {
				var cmd = 'kill ' + this.sysId + '\n';
				// log(cmd);
				PHP.exec(cmd, f, f, f);
			}
			this.onComplete('from onObserve');
		}
		this.observeProcIsRun = 0;
		
	} catch (ex) {
		log(ex);
	}
	
}

MediaFileProcess.prototype.removeLogFileAndRunPostTriggers = function(std, err) {
	var cmd = '#! /bin/bash\nrm -f "' + this.getLogFilename() + '"', s = 'on', name;
	if (this.customOutfilename) {
		cmd += '\ncd ' + this.getDir() + '';
		cmd += '\nmv "' + this.getOutfile() + '" "' + this.getActualCustomOutfilename() + '"';
	}
	// log(cmd);
	name = Qt.appDir() + '/shr.sh';
	PHP.file_put_contents(name, cmd);
	PHP.exec(name, s, s, s);	
}

/**
 * actual output name on finish (for rename)
*/
MediaFileProcess.prototype.getActualCustomOutfilename = function() {
	var a = this.customOutfilename.split('.');
	a.pop();
	return a[0] + '.' + this.outputFormat;
}

/**
 * Actualize output filename on start convertation
*/
MediaFileProcess.prototype.actualizeName = function() {
	var a = this.nameView.innerHTML.split('.');
	a.pop();
	this.nameView.innerHTML = (a[0] + '.' + this.outputFormat);
}

// TODO тут поле для деятельности
MediaFileProcess.prototype.onComplete = function(std, err) {
	// log('Call onComplete');
	clearInterval(this.ival);
	this.removeLogFileAndRunPostTriggers();
	this.resetParams();
	this.progressStateLabel.innerHTML = (std == 'user_interrupt') ? L('Прервано пользователем') : L('Готово');
	
	try {
		this.onFinishOneFile.call(this.context, std, err);
	} catch (err) {
		alert(err);
	}
	
	/*var msg = 'Done!';
	if (this.isInterrupt) {
		msg = 'Прервано пользователем';
	}
	
	Qt.setTitle(msg);
	
	e('hFileList').innerHTML = '';
	alert(msg);//alert('procId = ' + procId + '\n sysId = ' + sysId);
	*/
}

MediaFileProcess.prototype.setOnCompleteOneFileListener = function(o, f) {
	this.context = o;
	this.onFinishOneFile = f;
}

/**
 * @decription call.f(o, this.order);
*/
MediaFileProcess.prototype.setOnInterruptOneFileListener = function(o, f) {
	this.interruptContext = o;
	this.onInterruptOneFile = f;
}

MediaFileProcess.prototype.observe = function() {
	if (this.procId && !this.sysId) {
		this.sysId = PHP.getSysId(this.procId);
	}
	if (!this.procId || !this.sysId) {
		return;
	}
	if (this.observeProcIsRun) {
		return;
	}
	this.observeProcIsRun = 1;
	// alert(this.sysId);
	// TODO тут пока ничего не попишешь
	PHP.exec('ps -Ac', 'jmp3cutOnObserveFinish', 'jmp3cutOnObserveStd', 'jmp3cutOnObserveErr');
	
	this.setDuration();
	this.setCurrentProgress();
	
}
MediaFileProcess.prototype.setDuration = function() {
	if (!this.durationSetted) {
		var s = PHP.file_get_contents( this.getLogFilename() ), sD = 'Duration:',
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
			this.view.getElementsByClassName('time')[0].innerHTML = sTime;
			this.durationInSeconds = this.parseTimestring(sTime);
			this.durationSetted = 1;
		}
	}
}

MediaFileProcess.prototype.setCurrentProgress = function() {
	if (parseInt(this.durationInSeconds)) {
		var s = PHP.file_get_contents( this.getLogFilename() ), sD = 'time=',
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
			nSeconds = this.parseTimestring(sTime);
			var oneP = this.durationInSeconds / 100;
			var current = Math.ceil(nSeconds / oneP);
			if (!isNaN(nSeconds)) {
				Qt.setTitle(nSeconds + ' / ' + this.durationInSeconds + ' (sTime = ' + sTime + ', start = ' + start + ')' + 'procId: ' + this.sysId);
				this.extractPBar.style.display = 'block';
				this.dompb.style.width = current + '%';
				this.progressState.innerHTML = nSeconds + ' / ' + this.durationInSeconds + ' (' + current + '%)';
				if (nSeconds == this.durationInSeconds && current == 100) {
					this.percentsIsComplete = true;
				} else {
					this.percentsIsComplete = false;
				}
			}
		}
	}
}
MediaFileProcess.prototype.parseTimestring = function(sTime) {
	var a = sTime.split(':'),
		n = parseInt(a[0]) * 3600 + parseInt(a[1]) * 60 + parseInt(a[2]);
	return n;
}


MediaFileProcess.prototype.getDir = function() {
	var a = this.filePath.split('/');
	a.pop();
	return "'" + a.join('/') + "'";
}

MediaFileProcess.prototype.getLogFilename = function() {
	return Qt.appDir() +  '/' + this.getOutfile() + '.log';
}

MediaFileProcess.prototype.setPreview = function() {
	var previewFilename =  Qt.appDir() +  '/' + this.getOutfile() + '.png';
	this.previewFilename = previewFilename;
	this.ffmpeg.getPreviewFromVideo(this.filePath, previewFilename, 15, {context:this, m:this.onGetPreview});
}

MediaFileProcess.prototype.onGetPreview = function(stdin, stdout) {
	/*
	 * $sz = getImageSize($srcPath);
	$srcW = $sz[0];
	$srcH = $sz[1];
	$isLandscape = $srcW > $srcH;
	
	$isSrcLgBg = $srcW > $nWidth || $srcH > $nHeight;
	$destX = 0;
	$destY = 0;
	$newW = $srcW;
	$newH = $srcH;
	
	//это случай, когда изображение больше фона
	if ($isSrcLgBg) {
		if ($isLandscape) {
			$nScale = $nWidth / $srcW;
		} else {
			$nScale = $nHeight / $srcH;
		}
		$newW = round($srcW * $nScale);
		$newH = round($srcH * $nScale);
	}
	 * */
	
	/*var png = this.previewFilename;
	if (PHP.file_exists(png)) {
		this.previewImgElement// TODO ufo
		utils_resizeImg(this.previewImgElement, png);// TODO
		
	}*/
}

MediaFileProcess.prototype.addFileInfoBlock = function(parentId, filePath) {
	this.filePath = filePath;
	
	var s = this.getFileTpl().replace('{name}', this.getOutfile()),
		view, o = this;
	s = s.replace('{duration}', '00:00:00');
	view = appendChild(parentId, 'div', s);
	view.getElementsByClassName('close')[0].onclick = function(evt) {
		o.onClickRemoveBtn(evt);
	};
	this.view = view;
	this.extractPBar = view.getElementsByClassName('extractPBar')[0];
	this.dompb = view.getElementsByClassName('dompb')[0];
	this.progressState = view.getElementsByClassName('progressState')[0];
	this.progressStateLabel = view.getElementsByClassName('progressStateLabel')[0];
	this.nameView = view.getElementsByClassName('name')[0];
	this.bEditOutputFileName = view.getElementsByClassName('fileListMetadataIcon')[0];
	this.bEditOutputFileName.onclick = function(evt) {
		o.onClickEditFileNameBtn(evt);
	};
	this.nameView.onclick = function(evt) {
		o.onClickEditFileNameBtn(evt);
	};
	// setOneDivLocale('hConvertationInProcess');
	setLocaleByClassName('progressStateLabel', 'hConvertationInProcess');
}

MediaFileProcess.prototype.onClickRemoveBtn = function() {
	if (this.convertProcIsRun) {
		this.isInterrupt = 1;
		var cmd = 'kill ' + this.sysId;
		// PHP.exec(cmd + '\n', 'on');
		// TODO тут что-то придумать надо
		PHP.exec('killall ffmpeg' + '\n', 'on');
		this.onComplete('user_interrupt', '');
		var o = this;
		setTimeout(function(){
			o.view.parentNode.removeChild(o.view);
		}, 2000);
	} else {
		// e('hFileList').innerHTML = '';
		this.view.parentNode.removeChild(this.view);
		this.onInterruptOneFile.call(this.interruptContext, this.order);
	}
}

MediaFileProcess.prototype.getOutfile = function() {
	var name = this.getName(),
		a = name.split('.'),
		ext = a[sz(a) - 1],
		base;
	a.pop();
	base = a.join('.') + '-out.' + this.outputFormat;
	return base;
}

MediaFileProcess.prototype.getName = function() {
	var a = this.filePath.split('/');
	return a.pop();
}

MediaFileProcess.prototype.getOnFinishSettingAction = function() {
	var shortName = this.getName(),
		sets = this.context.settingDlg.loadSettings(),
		cmd;
	if (sets.actions == 'bNothingSource') {
		return '';
	}
	
	if (sets.actions == 'bRemoveSource') {
		cmd = '\nrm -f "' + shortName + '"\n';
		if (sets.removeMeta) {
			// cmd += 'rm -f "' + shortName + '.meta"\n';
			cmd += 'rm -f *.meta\n';
		}
		return cmd;
	}
	
	if (sets.actions == 'bMoveSource') {
		cmd = '\nmkdir "' + sets.catalogName + '"\n' + 
		'\nmv "' + shortName + '" "' + sets.catalogName + '/' + shortName + '"\n';
		if (sets.removeMeta) {
			// cmd += 'mv "' + shortName + '.meta" "' + sets.catalogName + '/' + shortName + '.meta"\n';
			cmd += 'mv *.meta ' + sets.catalogName + '\n';
		}
		return cmd;
	}
}

MediaFileProcess.prototype.onClickEditFileNameBtn = function(evt) {
	evt.preventDefault();
	var s = this.customOutfilename ?  this.customOutfilename : this.getOutfile();
	this.context.outfileDlg.show(this, s);
}

MediaFileProcess.prototype.setOutputFileName = function(fileName) {
	this.customOutfilename = fileName + '.' + this.outputFormat;
	this.nameView.innerHTML = this.customOutfilename;
}

MediaFileProcess.prototype.getFileTpl = function() {
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
							<div class="extractPBar" style="display:none;">\
								 <div class="text-center progressStateLabel" i id="hConvertationInProcess">\
									Выполняется конвертация...\
								 </div>\
								 <div style="line-height:28px;">\
									 <!-- #1A772C -->\
									 <div style="width:100%; border:1px solid #252526; border-radius:4px; height:10px;background-color:white;">\
										 <!--/* background-image: -webkit-linear-gradient(top, #049cdb, #0064cd); */-->\
										 \
										<div style="width:0%;  height:10px;" class="dompb">&nbsp;</div>\
									 </div>\
								 </div>\
								 <div class="text-center progressState">\
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
