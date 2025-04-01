function CAppCheckSum() {}
CAppCheckSum.prototype.init = function() {
	var o = this;
	o.nRows = 0;
	o.setListeners();	
}
CAppCheckSum.prototype.setListeners = function() {
	var o = this;
	o.bSelect = e("bSelectCalalog");
	o.bInitSum = e("bInitSum");
	o.bCheckSum = e("bCheckSum");
	o.displayDirname = e("hSelectedCatalogName");
	o.currentDir = 0;
	o.tBody = e("hTBody");
	o.hLdr = e("hLdr");
	o.bSelect.onclick = function(ev){o.onClickSelect(ev);}
	o.bInitSum.onclick = function(ev){o.onClickInitSum(ev);}
	o.bCheckSum.onclick = function(ev){o.onClickCheckSum(ev);}
	attr(o.bInitSum, "disabled", "disabled");
	attr(o.bCheckSum, "disabled", "disabled");
	attr("hLdr", "src", App.dir() + "/i/s.gif");
	o.restoreLastState();
}
CAppCheckSum.prototype.restoreLastState = function() {
	var o = this, lastPath, json = "", ls, z, i, shortName, lsDir = [],
		lsJson, sumJson, listIsEq = 1;
	lastPath = storage("lastPath");
	sumJson = lastPath + "/sum.json";
	if (lastPath) {
		o.currentDir = lastPath;
		o.setLastDirname(lastPath);
		/*
		 *  3 Кнопкой "Сравнить суммы" можно сравнить суммы и получить отчет. 
		 * Доступна если есть файл sum.json и список файлов в нём совпадает со списком в каталоге.
		*/
		if (lastPath && FS.isDir(lastPath) && FS.fileExists(sumJson)) {
			json = FS.readfile(lastPath + "/sum.json");
			try {
				json = JSON.parse(json);
			}catch(err){
				json = {};
			}
			ls = FS.scandir(lastPath);
			z = sz(ls);
			o.json = {};
			for (i = 0; i < z; i++) {
				shortName = ls[i];
				if (!FS.isDir(lastPath + "/" + shortName) && shortName != "sum.json") {
					if (!json[shortName]) {
						listIsEq = 0;
						o.clearTable();
						di(o.bCheckSum);
						break;
					} else {
						sum = json[shortName];
						o.addRow(shortName, sum);
						o.json[shortName] = sum;
					}
				}
			}
			
			if (listIsEq) {
				//o.bCheckSum.removeAttribute("disabled");
				ei(o.bCheckSum);
			}
		}
	}
}

CAppCheckSum.prototype.addRow = function(name, sum1, sum2) {
	var o = this, 
		nRows = o.nRows,
		tpl = '<td>' + (++o.nRows) + '</td><td>' + name + '</td><td>{sums}</td><td>{img}</td>',
		tr, h, sumH, imgH;
	sumH = '<div id="sumV' + nRows + '">' + sum1 + '</div>';
	imgH = 'fail';
	if (sum2) {
		sumH += '<div id="sum2V' + nRows + '">' + sum2 + '</div>';
		if (sum1 == sum2) {
			imgH = 'success';
		}
	} else {
		imgH = 'help';
		sumH += '<div id="sum2V' + nRows + '"></div>';
	}
	imgH = '<img id="status' + nRows + '" src="' + App.dir() + '/i/icons/' + imgH +  '.png">';
	h = tpl.replace('{sums}', sumH);
	h = h.replace('{img}', imgH);
	tr = appendChild(o.tBody, 'tr', h);
}

CAppCheckSum.prototype.clearTable = function() {
	this.nRows = 0;
	v(this.tBody, "");
}


CAppCheckSum.prototype.setLastDirname = function(s) {
	v(this.displayDirname, pathinfo(s)['basename']);
	this.clearTable();
	this.bInitSum.removeAttribute("disabled");
	
}

CAppCheckSum.prototype.onClickSelect = function() {
	var o = this, s;
	s = jqlOpenDirectoryDialog(L("Select catalog"));
	if (s) {
		storage("lastPath", s);
		/*di(o.bCheckSum);
		ei(o.bInitSum);
		this.currentDir = s;
		this.setLastDirname(s);*/
		o.restoreLastState();
	}
}
CAppCheckSum.prototype.onClickInitSum = function() {
	var o = this, a, i, z;
	if (!o.currentDir || !FS.fileExists(o.currentDir) || !FS.isDir(o.currentDir)) {
		o.showError(L("Need select catalog"));
		return;
	}
	show(o.hLdr, "inline-block");
	o.clearTable();
	a = FS.scandir(o.currentDir);
	z = sz(a);
	o.ls = [];
	o.I = 0;
	o.json = {};
	for (i = 0; i < z; i++) {
		if (a[i] == "." || a[i] == "..") {
			continue;
		}
		if (a[i] != "sum.json" && !FS.isDir(o.currentDir + "/" + a[i])) {
			o.ls.push(a[i]);
		}
	}
	o.z = sz(o.ls);
	di(o.bInitSum);
	di(o.bCheckSum);
	di(o.bSelect);
	o.initSumOneFile();
}
CAppCheckSum.prototype.initSumOneFile = function() {
	var s, o = this;
	s = o.currentDir + "/" + o.ls[o.I];
	o.addRow(o.ls[o.I], "");
	st(100, o.onTimeGetSum, o);
}
CAppCheckSum.prototype.onTimeGetSum = function() {
	var o = this, sum, i, file;
	sum = FS.md5File(o.currentDir + "/" + o.ls[o.I]);
	o.json[o.ls[o.I]] = sum;
	v("sumV" + o.I, sum);
	o.I++;
	if (o.I < o.z) {
		o.initSumOneFile();
	} else {
		ei(o.bCheckSum);
		ei(o.bInitSum);
		ei(o.bSelect);
		file = o.currentDir + "/sum.json";
		FS.writefile(file, JSON.stringify(o.json));
		hide(o.hLdr);
	}
}

CAppCheckSum.prototype.onClickCheckSum = function() {
	var o = this, a, i, z;
	if (!o.currentDir || !FS.fileExists(o.currentDir) || !FS.isDir(o.currentDir)) {
		o.showError(L("Need select catalog"));
		return;
	}
	show(o.hLdr, "inline-block");
	a = FS.scandir(o.currentDir);
	z = sz(a);
	o.ls = [];
	o.I = 0;
	o.needFinalAlert = 0;
	for (i = 0; i < z; i++) {
		if (a[i] == "." || a[i] == "..") {
			continue;
		}
		if (a[i] != "sum.json" && !FS.isDir(o.currentDir + "/" + a[i])) {
			o.ls.push(a[i]);
		}
	}
	o.z = sz(o.ls);
	di(o.bInitSum);
	di(o.bCheckSum);
	di(o.bSelect);
	o.checkSumOneFile();
}
CAppCheckSum.prototype.checkSumOneFile = function() {
	var o = this;
	st(100, o.onTimeCheckSum, o);
}
CAppCheckSum.prototype.onTimeCheckSum = function() {
	var o = this, sum, i, file, img = 'fail';
	try {
		sum = FS.md5File(o.currentDir + "/" + o.ls[o.I]);
		if (o.json[o.ls[o.I]] == sum) {
			img = 'success';
		} else {
			o.needFinalAlert = 1;
		}
		v("sum2V" + o.I, sum);
		attr("status" + o.I, "src", App.dir() + "/i/icons/" + img + ".png");
		o.I++;
		if (o.I < o.z) {
			o.checkSumOneFile();
		} else {
			ei(o.bInitSum);
			ei(o.bCheckSum);
			ei(o.bSelect);
			hide(o.hLdr);
			if (o.needFinalAlert) {
				o.showMessage(L("File changed!"));
			}
		}
	} catch(err) {
		alert(err);
	}
}

CAppCheckSum.prototype.showMessage = function(s) {
	alert(s);
}
CAppCheckSum.prototype.showError = function(s) {
	alert(s);
}
