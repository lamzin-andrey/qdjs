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
	o.tBody = e("hTBody");
	o.bSelect.onclick = function(ev){o.onClickSelect(ev);}
	o.bInitSum.onclick = function(ev){o.onClickInitSum(ev);}
	o.bCheckSum.onclick = function(ev){o.onClickCheckSum(ev);}
	attr(o.bInitSum, "disabled", "disabled");
	attr(o.bCheckSum, "disabled", "disabled");
	o.restoreLastState();
}
CAppCheckSum.prototype.restoreLastState = function() {
	var o = this, lastPath, json = "", ls, z, i, shortName, lsDir = [],
		lsJson, sumJson, listIsEq = 1;
	lastPath = storage("lastPath");
	sumJson = lastPath + "/sum.json";
	if (lastPath) {
		o.setLastDirname(lastPath);
		o.bInitSum.removeAttribute("disabled");
		/*
		 *  3 Кнопкой "Сравнить суммы" можно сравнить суммы и получить отчет. 
		 * Доступна если есть файл sum.json и список файлов в нём совпадает со списком в каталоге.
		*/
		if (lastPath && FS.isDir(lastPath) && FS.fileExists(sumJson)) {
			json = FS.readfile();
			try {
				json = JSON.parse(json);
			}catch(err){
				json = {};
			}
			ls = scandir(lastPath);
			z = sz(ls);
			console.log(ls);
			for (i = 0; i < z; i++) {
				shortName = ls[i];
				if (!FS.isDir(lastPath + "/" + shortName) && shortName != "sum.json") {
					if (!json[shortName]) {
						listIsEq = 0;
						o.clearTable();
						break;
					} else {
						sum = FS.md5File(lastPath + "/" + shortName);
						o.addRow(shortName, sum);
					}
				}
			}
			
			if (listIsEq) {
				o.bCheckSum.removeAttribute("disabled");
			}
		}
	}
}

CAppCheckSum.prototype.addRow = function(name, sum1, sum2) {
	var o = this, tpl = '<td>' + (++o.nRows) + '</td><td>' + name + '</td><td>{sums}</td><td>{img}</td>',
		tr, h, sumH, imgH;
	sumH = '<div>' + sum1 + '</div>';
	imgH = 'fail';
	if (sum2) {
		sumH += '<div>' + sum2 + '</div>';
		if (sum1 == sum2) {
			imgH = 'success';
		}
	} else {
		imgH = 'help';
	}
	imgH = '<img src="./i/icons/' + imgH +  '.png">';
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
}

CAppCheckSum.prototype.onClickSelect = function() {
	var o = this;
	// TODO stop here
	// ПОчти как в 43, но без бреак.
	// И здесь и в 43 надо сделать через интервалы, чтобы рендерилось.
}
CAppCheckSum.prototype.onClickInitSum = function() {
}
CAppCheckSum.prototype.onClickCheckSum = function() {
	
}
