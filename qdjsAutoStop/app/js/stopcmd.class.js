function StopCmdCommander(stopTimeCtrl) {
	this.stopTimeCtrl = stopTimeCtrl;
	
	this.isRun = false;
	this.isPause = false;
	this.SERVICE_NAME = "landautostopd.service";
	this.serviceEnabled = false;
	
	var self = this;
	setInterval( function _onTick(){
		self.onTick();
	},  
	1000);
	
	
	this.setListeners();
	this.checkServiceStatus();
}


StopCmdCommander.prototype.setListeners = function() {
	var self = this;
	$("#btnStart")[0].onclick = function (){self.onClickStart()}
}


StopCmdCommander.prototype.onClickStart = function() {
	if (!this.isRun) {
		this.runProcess();
	} else {
		this.sendCancelCmd();
	}
	
}

StopCmdCommander.prototype.runProcess = function() {
	this.checkService();
}

StopCmdCommander.prototype.checkService = function() {
	this._checkService([this, this.onCheckService]);
}

StopCmdCommander.prototype.checkServiceStatus = function() {
	this._checkService([this, this.onCheckServiceStatus]);
}

StopCmdCommander.prototype.onCheckServiceStatus = function(out, err) {
	var srv, o = this;
	out = trim(out);
	// alert("`" + out + "`");
	if (!o,srvIsActive(out)) {
		v("log", L("Service not run. Press 'Stop after' and enter superuser password"));
		this.serviceEnabled = false;
		return;
	}
	this.serviceEnabled = true;
}

StopCmdCommander.prototype._checkService = function(listener) {
	var cmd, sh, out;
	sh = App.dir() + "/d/u.sh";
	cmd = makeCmd();
	cmd +="systemctl is-active " + this.SERVICE_NAME + "\n";
	FS.writefile(sh, cmd);
	jexec(sh, listener, DevNull, DevNull);
}

StopCmdCommander.prototype.onCheckService = function(out, err) {
	var srv, o = this;
	out = trim(out);
	// alert("`" + out + "`");
	if (!o.srvIsActive(out)) {
		srv = new CSystemCtl();
		srv.suCreateAndRunService(App.dir() + "/d/landautostopd.sh", o.SERVICE_NAME, "shutdown UI tool daemon");
	} else {
		this.serviceEnabled = true;
	}
	o.sendRunCmd();
}

StopCmdCommander.prototype.srvIsActive = function(out) {
	return true;
	return out == 'failed' || out == 'inactive';
}

StopCmdCommander.prototype.sendRunCmd = function() {
	var currH, currM, trgH, trgM, currTs, trgTs, tm;
	currH = intval(date('H') );
	currM = intval(date('i') );
	
	trgH = intval(this.stopTimeCtrl.targetH)
	trgM = intval(this.stopTimeCtrl.targetM);
	
	// Не наступит ли указанное время через 6 секунд или меньше
	currTs = time();
	trgTs = currTs + (trgH * 3600 + trgM * 60);
	
	if (trgTs - currTs < 7) {
		// увеличить время на контроле на 1
		this.stopTimeCtrl.targetM = trgM + 1;
		this.stopTimeCtrl.onTick();
		trgTs += 60;
	}
	
	trgH = date("H", trgTs);
	trgM = date("i", trgTs);
	tm = (String(trgH) + String(trgM));
	FS.writefile(App.dir() + "/d/time.sock", tm);
	FS.writefile(App.dir() + "/d/last.txt", tm);
	this.isRun = true;
}

StopCmdCommander.prototype.sendCancelCmd = function() {
	var tm;
	tm = 'c000';
	FS.writefile(App.dir() + "/d/time.sock", tm);
	FS.writefile(App.dir() + "/d/last.txt", tm);
	this.isRun = false;
}

StopCmdCommander.prototype.onTick = function() {
	// мониторим запущен ли сервис, если нет, останавливать процесс и писать предупреждение в поле
	if (this.isRun) {
		if (!this.serviceEnabled) {
			alert("Сервис не доступен!");
			this.isRun = false;
			return this.sendCancelCmd();
		}
		// set wait view
		if (v("btnStart") != L("Cancel")) {
			v("btnStart", L("Cancel"));
		}
		this.setCountDownTime();
	} else {
		// set init view
		if (v("btnStart") != L("Stop after")) {
			v("btnStart", L("Stop after"));
		}
	}
}

StopCmdCommander.prototype.setCountDownTime = function(cmd) {
	var c, h, m, trgDate, trgTs, diff;
	c = FS.readfile(App.dir() + "/d/last.txt");
	if (c == "c000") {
		return;
	}
	h = c.substring(0, 2);
	m = c.substring(2);
	trgDate = date("Y-m-d " + h + ":" + m + ":00");
	// log("setCountDownTime: trgDate = " + trgDate);
	trgTs = strtotime(trgDate);
	
	diff = trgTs - time();
	diff = diff < 0 ? 0 : diff;
	h = Math.floor(diff / 3600);
	//h = h < 0 ? h : h;
	m = Math.ceil( (diff - h * 3600) / 60);
	this.stopTimeCtrl.targetH = h;
	this.stopTimeCtrl.targetM = m;
	this.stopTimeCtrl.onTick();
	if (intval(h) == 0 && intval(m) == 0) {
		this.exec("systemctl poweroff");
	}
}


StopCmdCommander.prototype.exec = function(cmd) {
	var f = App.dir() + "/d/u.sh";
	FS.writefile(f, "#!/bin/bash\n" + cmd + "\n");
	jexec(f, DevNull, DevNull, DevNull);
}


