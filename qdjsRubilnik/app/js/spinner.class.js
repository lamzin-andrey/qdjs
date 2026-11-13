function Spinner(wrapperId, legend, fileSettingPath, limit) {
	this.wrapperId = wrapperId;
	this.legend = legend;
	this.fileSettingPath = fileSettingPath;
	this.LIM = limit;
	this.onLoad();
}

Spinner.prototype.setDisabled = function(n) {
	var o = this;
	o.disabled = n;
	if (n) {
		o.bSetPlus.src = App.dir() + "/i/topd.jpg"
		o.bSetMinus.src = App.dir() + "/i/btmd.jpg"
	} else {
		o.bSetPlus.src = App.dir() + "/i/top.jpg"
		o.bSetMinus.src = App.dir() + "/i/btm.jpg"
	}
}

Spinner.prototype.setListeners = function() {
	var o = this;
	o.bSetPlus.onclick = function(e) {o.onClickSetPlus(e);}
	o.bSetMinus.onclick = function(e) {o.onClickSetMinus(e);}
}

Spinner.prototype.onClickSetPlus = function() {
	var o = this;
	if (o.disabled) {
		return;
	}
	o.value++;
	if (o.value > o.LIM) {
		o.value = 0;
	}
	o.onTick();
	o.storeTarget();
}

Spinner.prototype.onClickSetMinus = function() {
	var o = this;
	if (o.disabled) {
		return;
	}
	o.value--;
	if (o.value < 0) {
		o.value = o.LIM;
	}
	o.onTick();
	o.storeTarget();
}
Spinner.prototype.storeTarget = function() {
	FS.writefile(this.getFileSettingsPath(), z(this.value));
}



Spinner.prototype.createView = function() {
	var el, o = this, html = '<div class="lbl">' + o.legend + '</div>\
							<img src="./i/top.jpg">\
							<div class="numv">0</div>\
							<img src="./i/btm.jpg">';
	
	el = appendChild(e(o.wrapperId), 'div', html, {});
	
	o.bSetPlus = ee(el, 'img')[0];
	o.bSetMinus = ee(el, 'img')[1];
	o.hVal = cs(el, 'numv')[0];
}

Spinner.prototype.onLoad = function() {
	var data, o = this, file = o.getFileSettingsPath();
	o.n = 1;
	o.value = 1;
	
	if (PHP.file_exists(file)) {
		data = intval(FS.readfile(file));
		o.value = data;
	}
	
	o.createView();
	o.setListeners();
	o.onTick();
}

Spinner.prototype.getFileSettingsPath = function() {
	return Qt.appDir() + '/' + this.fileSettingPath + '.txt';
}

Spinner.prototype.onTick = function() {
	this.hVal.innerHTML = z(this.value);
}




