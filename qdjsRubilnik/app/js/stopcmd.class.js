function StopCmdCommander(stopTimeCtrl) {
	stl("hPbarIn", "width", 0+ "%");
	this.stopTimeCtrl = stopTimeCtrl;
	
	this.isRun = false;
	this.isPause = false;
	this.SERVICE_NAME = "landautostopd.service";
	this.serviceEnabled = false;
	this.useShutdown = false;
	this.animateDirect = 1;
	
	var self = this;
	setInterval( function _onTick(){
		self.onTick();
	},  
	1000);
	
	
	this.setListeners();
	this.checkServiceStatus();
}


StopCmdCommander.prototype.setListeners = function() {
	var o = this;
	o.cnf = o.readCnf();
	e("bShutdown").checked = o.useShutdown = o.cnf.useShutdown;
	e("bShutdown").onchange = function(){o.onChangeShutdown()}
	e("bSound").checked = o.playSound = o.cnf.playSound;
	e("bSound").onchange = function(){o.onChangeSound()}
	e("btnStart").onclick = function (){o.onClickStart()}
	e("bHlp").onclick = function (){o.onClickHelp()}
}

StopCmdCommander.prototype.onClickHelp = function() {
	var text = L("OffTumbler 1.1") + "\n" + 
		L("A program for shutting down the computer on a timer.") + "\n\n" +
		L("Author: Andrey.") + "\n" +
		L("email: lamzin80@mail.ru") + "\n\n" +
		L("This program is inspired by \"Rubilnick\" for Windows—created by the author Fedor (zafedor@mail.ru) — and serves as its equivalent for Linux (Xubuntu 22.04–24.04).") + "\n"
		// +
		//L("") + "\n" +
		//L("") + "\n"
		;
	try {
		MessageBoxA([this, this.onHelpClose], text, "Информация", MB_OK);
	} catch(err) {
		alert(err);
	}
}

	
StopCmdCommander.prototype.onHelpClose = function(result) {
	//
}
	
	
StopCmdCommander.prototype.onChangeSound = function() {
	var o = this;
	if (e("bSound").checked != o.cnf.playSound) {
		o.cnf.playSound = e("bSound").checked;
		o.writeCnf(o.cnf);
	}
	if (e("bSound").checked) {
		//alert(L("One minute before the computer shuts down, the program will play a melodic sound. (You will hear an example once this window is closed.) The program requires \'mplayer\' to function."));
		MessageBoxA(
			[this, this.onCloseSoundInfo], 
			L("One minute before the computer shuts down, the program will play a melodic sound. (You will hear an example once this window is closed.) The program requires \'mplayer\' to function."),
			"Информация",
			MB_OK
		);
		//o.exec("mplayer " + App.dir() + "/s/shutdown.ogg");
	}
}


StopCmdCommander.prototype.onCloseSoundInfo = function() {
	this.exec("mplayer " + App.dir() + "/s/shutdown.ogg");
}

StopCmdCommander.prototype.onChangeShutdown = function() {
	var o = this;
	if (e("bShutdown").checked != o.cnf.useShutdown) {
		o.cnf.useShutdown = e("bShutdown").checked;
		o.writeCnf(o.cnf);
	}
	if (e("bShutdown").checked) {
		//alert(L("The command `shutdown -P` run as root will be used. To start the service, enter the superuser password."));
		MessageBoxA(
			[o, o.onCheckShutdownClose],
			L("The command `shutdown -P` run as root will be used. To start the service, enter the superuser password."),
			"Информация",
			MB_OK
		);
		// o.runProcess();
	} else {
		// alert("The `systemctl poweroff` command will be used, executed by the current user. To install or remove a service that runs `shutdown -P` with root privileges, please enter the superuser password.");
		MessageBoxA(
			[o, o.onUncheckShutdownClose],
			L("The `systemctl poweroff` command will be used, executed by the current user. To install or remove a service that runs `shutdown -P` with root privileges, please enter the superuser password."),
			"Информация",
			MB_OK
		);
		// o.stopProcess();
	}
}

StopCmdCommander.prototype.onUncheckShutdownClose = function() {
	this.stopProcess();
}

StopCmdCommander.prototype.onCheckShutdownClose = function() {
	this.runProcess();
}

StopCmdCommander.prototype.stopProcess = function() {
	var srv = new CSystemCtl();
	srv.suStopAndDisableService(this.SERVICE_NAME);
}

StopCmdCommander.prototype.readCnf = function() {
	var file, r;
	file = App.dir() + "/d/cnf.json";
	if (FS.fileExists(file)) {
		r = json_decode(FS.readfile(file));
	}
	if (!r) {
		r = {};
	}
	return r;
}

StopCmdCommander.prototype.writeCnf = function(o) {
	var file;
	file = App.dir() + "/d/cnf.json";
	FS.writefile(file, json_encode(o));
}


StopCmdCommander.prototype.onClickStart = function() {
	if (!this.isRun) {
		// this.runProcess();
		this.sendRunCmd();
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
	//alert("`" + out + "`");
	out = trim(out);
	
	if (!o.srvIsActive(out) && e("bShutdown").checked) {
		alert(L("Service not run. Press 'Stop after' and enter superuser password"));
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
		this.serviceEnabled = true;
	} else {
		this.serviceEnabled = true;
	}
}

StopCmdCommander.prototype.srvIsActive = function(out) {
	// return true;
	//return out == 'failed' || out == 'inactive';
	//alert("`" + out + "`");
	return out.trim() == 'activating';
}

StopCmdCommander.prototype.sendRunCmd = function() {
	var currH, currM, trgH, trgM, currTs, trgTs, tm, ctrlTrgTs;
	currH = intval(date('H') );
	currM = intval(date('i') );
	
	trgH = intval(this.stopTimeCtrl.targetH)
	trgM = intval(this.stopTimeCtrl.targetM);
	
	// Не наступит ли указанное время через 6 секунд или меньше
	currTs = time();
	trgTs = currTs + (trgH * 3600 + trgM * 60);
	//alert(trgTs);
	if (trgTs - currTs < 6) {
		// увеличить время на контроле на 1
		this.stopTimeCtrl.targetM = trgM + 1;
		this.stopTimeCtrl.onTick();
		trgTs += 60;
	}
	
	trgH = date("H", trgTs);
	trgM = date("i", trgTs);
	
	trgDate = date("Y-m-d " + trgH + ":" + trgM + ":00");
	ctrlTrgTs = strtotime(trgDate);
	this.correct = trgTs - ctrlTrgTs;
	
	
	tm = (String(trgH) + String(trgM));
	FS.writefile(App.dir() + "/d/time.sock", tm);
	FS.writefile(App.dir() + "/d/last.txt", tm);
	this.srcTs = time();
	FS.writefile(App.dir() + "/d/start.txt", this.srcTs);
	this.stopTimeCtrl.setDisabled(1);
	stl("btnStart", "background-color", "#FF8080");
	e("bShutdown").disabled = true;
	e("bSound").disabled = true;
	this.isRun = true;
}

StopCmdCommander.prototype.sendCancelCmd = function() {
	var tm, s;
	tm = 'c000';
	FS.writefile(App.dir() + "/d/time.sock", tm);
	FS.writefile(App.dir() + "/d/last.txt", tm);
	if (e("bSound").checked) {
		this.cnf.playSound = true;
	}
	this.isRun = false;
}

StopCmdCommander.prototype.onTick = function() {
	// мониторим запущен ли сервис, если нет, останавливать процесс и писать предупреждение в поле
	if (this.isRun) {
		if (!this.serviceEnabled && e("bShutdown").checked) {
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
			
			this.animateState = 0;
			this.animateDirect = 1;
			s = '&gt;&gt;&gt;';
			v("hAnim", s);
			stl("hAnim", 'color', '#FFF');
			stl("hPbarIn", "width", 0+ "%");
			this.stopTimeCtrl.setDisabled(0);
			e("bShutdown").disabled = false;
			e("bSound").disabled = false;
			stl("btnStart", "background-color", "#80FF80");
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
	//alert(c + "\n" + h + "\n" + m);
	trgDate = date("Y-m-d " + h + ":" + m + ":00");
	// log("setCountDownTime: trgDate = " + trgDate);
	trgTs = strtotime(trgDate) + this.correct;
	//alert(trgTs);
	
	diff = trgTs - time();
	// alert(trgTs + "\n" + diff);
	diff = diff < 0 ? 0 : diff;
	this.animate(diff, trgTs);
	h = Math.floor(diff / 3600);
	//h = h < 0 ? h : h;
	m = Math.ceil( (diff - h * 3600) / 60);
	this.stopTimeCtrl.targetH = h;
	this.stopTimeCtrl.targetM = m;
	this.stopTimeCtrl.onTick();

	if (intval(h) == 0 && intval(m) == 1) {	
		if (this.cnf.playSound) {
			this.exec("mplayer " + App.dir() + "/s/shutdown.ogg");
			this.cnf.playSound = 0;
		}
	}
	
	if (intval(h) == 0 && intval(m) == 0) {
		if (!e("bShutdown").checked) {
			this.exec("systemctl poweroff");
			// alert("systemctl poweroff");
		}
	}
}


StopCmdCommander.prototype.exec = function(cmd) {
	var f = App.dir() + "/d/u.sh";
	FS.writefile(f, "#!/bin/bash\n" + cmd + "\n");
	jexec(f, DevNull, DevNull, DevNull);
}

/**
 * @param tsDiff - сколько секунд осталось до выключения
 * @param trgTs - момент выключения
*/
StopCmdCommander.prototype.animate = function(tsDiff, trgTs) {
	var o = this, oneP, srcTs, file, percTime;
	o.animState = o.animState || 1;
	switch (o.animState) {
		case 1:
			o.setAnimView(1, 'FFFFFF');
			o.animateDirect = 1;
			o.animState++;
			break;
		case 2:
			o.setAnimView(2, 'FFFF00');
			o.animState += o.animateDirect;
			break;
		case 3:
			o.setAnimView(3, '06F711');
			o.animateDirect = -1;
			o.animState--;
			break;
	}
	file = App.dir() + "/d/start.txt";
	if (!o.srcTs && FS.fileExists(file)) {
		o.srcTs = intval(FS.readfile(file));
	}
	// в какой момент включили таймер
	srcTs = o.srcTs;
	oneP = (trgTs - srcTs) / 100;
	percTime = round( ((trgTs - srcTs) - tsDiff) / oneP, 0);
	
	stl("hPbarIn", "width", (percTime + "%"));
}

StopCmdCommander.prototype.setAnimView = function(n, clr) {
	var i, lt = '&lt;', gt = '&gt;', s = '', h = '', t = '';
	for (i = 0; i < n; i++) {
		h += gt;
		t += lt;
	}
	s = h + ' ' + L("Timer is run") + ' ' + t;
	v("hAnim", s);
	stl("hAnim", 'color', '#' + clr);
}
