function TimeControl(wrapperId, legend, fileSettingPath) {
	this.wrapperId = wrapperId;
	this.legend = legend;
	this.fileSettingPath = fileSettingPath;
	this.onLoad();
}


TimeControl.prototype.setListeners = function() {
	var self = this;
	this.bSetH.onclick = function(e) {self.onClickSetH(e);}
	this.bSetM.onclick = function(e) {self.onClickSetM(e);}
	this.bSetPlus.onclick = function(e) {self.onClickSetPlus(e);}
	this.bSetMinus.onclick = function(e) {self.onClickSetMinus(e);}
}
TimeControl.prototype.onClickSetH = function() {
	this.setMode = 'h';
	this.bSetH.style.backgroundColor = '#6BA4D7';
	this.bSetM.style.backgroundColor = '#000';
}
TimeControl.prototype.onClickSetM = function() {
	this.setMode = 'm';
	this.bSetH.style.backgroundColor = '#000';
	this.bSetM.style.backgroundColor = '#6BA4D7';
	this.onTick();
}
TimeControl.prototype.onClickSetPlus = function() {
	if (this.setMode == 'h') {
		this.targetH++;
		if (this.targetH > 23) {
			this.targetH = 0;
		}
	} else {
		this.targetM++;
		if (this.targetM > 59) {
			this.targetM = 0;
		}
	}
	this.onTick();
	this.storeTarget();
}
TimeControl.prototype.onClickSetMinus = function() {
	if (this.setMode == 'h') {
		this.targetH--;
		if (this.targetH < 0) {
			this.targetH = 23;
		}
	} else {
		this.targetM--;
		if (this.targetM < 0) {
			this.targetM = 59;
		}
	}
	this.onTick();
	this.storeTarget();
}
TimeControl.prototype.storeTarget = function() {
	var file = this.getFileSettingsPath();
	PHP.file_put_contents(file, z(this.targetH) + ':' + z(this.targetM));
}



TimeControl.prototype.createView = function() {
	// TODO clear id=""
	var html = '<i class="timeCtrlLegend fleft">' + this.legend + '</i>\
	<div class="set rf">\
		<i class="btn">H</i>\
		<i class="btn">M</i>\
		<i class="btn">+</i>\
		<i class="setnum">19</i><i>:</i>\
		<i class="setnum">00</i>\
		<i class="btn">-</i>\
	</div>\
	<div class="clear"></div>';
	var el = $(html);
	$('#' + this.wrapperId).append(el);
	var ls = $(el).find('.btn');
	
	this.bSetH = $(ls[0])[0];
	this.bSetM = $(ls[1])[0];
	this.bSetPlus = $(ls[2])[0];
	this.bSetMinus = $(ls[3])[0];
	
	ls = $(el).find('.setnum');
	this.hSetTime = $(ls[0])[0];
	this.hSetMinute = $(ls[1])[0];
}

TimeControl.prototype.onLoad = function() {
	this.n = 1;
	this.targetH = 19;
	this.targetM = 0;
	var file = this.getFileSettingsPath();//TODO explore it!
	if (PHP.file_exists(file)) {
		var data = PHP.file_get_contents(file);
		var a = data.split(':');
		if (a.length == 2) {
			this.targetH = intval(a[0]);
			this.targetM = intval(a[1]);
		}
	}
	
	this.setMode = 'h';
	var self = this;
	/*setInterval( function(){
		self.onTick();
	},  
	1000);
	
	
	setInterval( function(){
		self.onHalfTick();
	},  
	900);
	
	
	setInterval( function(){
		self.onCall();
	},  
	5 * 1000);*/
	
	this.createView();
	this.setListeners();
	this.bSetH.style.backgroundColor = '#6BA4D7';
	this.bSetM.style.backgroundColor = '#000';
	this.onTick();
}

TimeControl.prototype.getFileSettingsPath = function() {
	return Qt.appDir() + '/' + this.fileSettingPath + '.txt';
}

TimeControl.prototype.onTick = function() {
	// this.hTime.innerHTML = date('H');
	// this.hMinute.innerHTML = date('i');
	this.hSetTime.innerHTML = z(this.targetH);
	this.hSetMinute.innerHTML = z(this.targetM);
}

TimeControl.prototype.onCall = function() {
	if (intval(date('H')) == this.targetH && 
		intval(date('i')) == this.targetM
		) {
			//PHP.exec('rhythmbox /home/andrey/2019-01-08-16-02-00.mp3', 'onNull', 'onNull', 'onNull');
			// PHP.exec('mplayer ' + Qt.appDir() + '/call.ogg', 'onNull', 'onNull', 'onNull');
			//PHP.exec('gnome-sound-recorder ' + Qt.appDir() + '/call.ogg', 'onNull', 'onNull', 'onNull');
			
	}
}

TimeControl.prototype.onHalfTick = function() {
	var n = this.n,
		clr = '#39D749',
		sClr = clr;
	if (n == 1) {
		n = 2;
	} else {
		n = 1;
	}
	
	if (n == 2) {
		clr = '#000';
	} else {
		clr = sClr;
	}
	// this.hDots.style.color = clr;
	this.n = n;
}


