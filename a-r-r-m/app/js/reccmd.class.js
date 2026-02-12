function RecordCommander(startTimeCtrl, stopTimeCtrl) {
	this.startTimeCtrl = startTimeCtrl;
	this.stopTimeCtrl = stopTimeCtrl;
	
	this.isRun = false;
	this.isPause = false;
	
	var self = this;
	setInterval( function(){
		self.onTick();
	},  
	1000);
	
	
	
	this.setListeners();
}


RecordCommander.prototype.setListeners = function() {
	var self = this;
}




RecordCommander.prototype.onTick = function() {
	var h, m;
	h = intval(date('H') );
	m = intval(date('i') );
	this.karl(h, m, intval(this.startTimeCtrl.targetH), intval(this.stopTimeCtrl.targetH), intval(this.startTimeCtrl.targetM), intval(this.stopTimeCtrl.targetM));
}

RecordCommander.prototype.karl = function($h, $m, $startH, $endH, startM, endM) {
	if ($endH == 0) {
		$endH = 24;
	}
	if ($h == 0) {
		$h = 24;
	}
	if (!this.isRun) {
		if (this.isTimeToPlay($h, $m, $startH, $endH, startM, endM)) {
			this.isRun = 1;
			this.exec('audio-recorder -c start &');
			this._echo("Start recording in " + $h + " " + $m);
		}
	} else {
		if (this.isTimeToStop($h, $m, $startH, $endH, startM, endM)) {// TODO func $h >= $endH
			this.isRun = 0;
			this.isPause = 0;
			this._echo("Stop in " + $h + " " + $m);
			this.exec('audio-recorder -c stop &');
			return;
		}
		
		if ($m == 32 && !this.isPause) {//33
			this._echo("Pause " + $h + " " + $m);
			this.isPause = 1;
			this.exec('audio-recorder -c stop &');
		}
		if ($m == 35 && this.isPause) {//37
			this.isPause = 0;
			this._echo ("Continue " + $h + " " + $m + "\n");
			this.exec('audio-recorder -c start &');
		}
		if ($m == 1 && !this.isPause) {
			this._echo("Pause " + $h + " " +$m + "\n");
			this.isPause = 1;
			this.exec('audio-recorder -c stop &');
			return;
		}
		if ($m == 2 && this.isPause) {
			this._echo ("Continue " + $h + " " + $m);
			this.isPause = 0;
			this.exec('audio-recorder -c start &');
			return;
		}
	}
}

RecordCommander.prototype.isTimeToPlay = function(currH, currM, startH, endH, startM, endM) {
	//return currH == startH;
	//this._echo("currH " + currH + " currM " + currM + " startH " +  startH + 
	// " endH " + endH + " startM " + startM + " endM " +  endM);
	return (currH == startH && currM >= startM) && !this.isTimeToStop(currH, currM, startH, endH, startM, endM);
}

//$h >= $endH
RecordCommander.prototype.isTimeToStop = function(currH, currM, startH, endH, startM, endM) {
	//return $h >= $endH;
	
	//this._echo(currM + ", eM = " + endM);
	
	if (currH > endH) {
		return true;
	}
	
	if (currH == endH) {
		return currM >= endM;
	}
	
	return false;
}


RecordCommander.prototype._echo = function(m) {
	var s = $('#log')[0].innerHTML;
	s += '<div>' + m + '</div>';
	$('#log')[0].innerHTML = s;
}

RecordCommander.prototype.exec = function(cmd) {
	PHP.exec(cmd, onNull, onNull, onNull);
}


