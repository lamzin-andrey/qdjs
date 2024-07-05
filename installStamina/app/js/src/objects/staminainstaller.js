function CStaminaInstaller() {}
CStaminaInstaller.prototype.init = function() {
	var o = this;
	hide('bPrev');
	e('bNext').disabled = true;
	o.screen = 1;
	e('bNext').onclick = function() {
		o.onClickNext();
	}
	e('bPrev').onclick = function() {
		o.onClickPrev();
	}
	e('bCancel').onclick = function() {
		App.quit();
	}
}
CStaminaInstaller.prototype.onEnvData = function() {
	e('bNext').disabled = false;
}
CStaminaInstaller.prototype.onClickNext = function(ev) {
	var o = this;
	switch(o.screen) {
		case 1:
			o.onClickNextScr1(ev);
			break;
		case 2:
		case 3:
			o.onClickNextScr2(ev);
			break;
		case 5:
			o.onClickNextScr5(ev);
			break;
	}
}

CStaminaInstaller.prototype.onClickPrev = function(ev) {
	var o = this;
	switch(o.screen) {
		case 1:
			o.onClickNextScr1(ev);
			break;
		case 2:
		case 3:
		case 5:
			o.onClickPrevScr2(ev);
			break;
	}
}

CStaminaInstaller.prototype.onClickPrevScr2 = function(ev) {
	this.screen = 1;
	hide("bPrev");
	showScreen("hScreen1");
}

CStaminaInstaller.prototype.onClickNextScr2 = function(ev) {
	var cmd = "#!/bin/bash\nwine " + App.dir()
		+ "/data/staminasetup_1208754395.exe",
		
		o = this;
	FS.writefile(App.dir() + "/data/cmd.sh", cmd);
	cmd = App.dir() + "/data/cmd.sh";
	jexec(cmd, DevNull, DevNull, DevNull);	
	setTimeout(function(){
		App.quit();
	}, 1*1000);
}


CStaminaInstaller.prototype.onClickNextScr5 = function(ev) {
	var cmd = "#!/bin/bash\nxfce4-terminal -e " + App.dir()
		+ "/data/installwine.sh",
		
		o = this;
	FS.writefile(App.dir() + "/data/cmd.sh", cmd);
	cmd = App.dir() + "/data/cmd.sh";
	jexec(cmd, DevNull, DevNull, DevNull);	
	setTimeout(function(){
		App.quit();
	}, 1*1000);
	
}

CStaminaInstaller.prototype.onClickNextScr1 = function(ev) {
	// 1 Search .wine catalog
	var o = this;
	if (!o.wineCatalogExists()) {
		o.showInstallWineScreen();
		return;
	}
	// 2 Copy dll
	o.copyDll();
}


CStaminaInstaller.prototype.copyDll = function() {
	var cmd = "#!/bin/bash\ncp " + App.dir() + "/data/mfc42.dll " + 
		this.Sys32Catalog + "/mfc42.dll\n", o = this;
	cmd += "cp " + App.dir() + "/data/mfc42.dll " + o.Sys64Catalog +
		"/mfc42.dll\n";
	FS.writefile(App.dir() + "/data/cmd.sh", cmd);
	cmd = App.dir() + "/data/cmd.sh";
	jexec(cmd, [o, o.showBeforeRunStaminaScreen], DevNull, DevNull);
}

CStaminaInstaller.prototype.showBeforeRunStaminaScreen = function() {
	var o = this,
		s64 = o.Sys64Catalog + "/mfc42.dll",
		s32 = o.Sys32Catalog + "/mfc42.dll";
	show("bPrev", "inline-block");
	if (FS.fileExists(s64) && FS.fileExists(s32)) {
		o.screen = 2;
		showScreen("hScreen2");
		return;
	}
	if (FS.fileExists(s32)) {
		o.screen = 3;
		v("hSysPath", o.Sys64Catalog);
		showScreen("hScreen3Sys32");
		return;
	}
	o.screen = 4;
	hide("bNext");
	v("hSysPath2", o.Sys64Catalog);
	showScreen("hScreen4Sorry");
}

CStaminaInstaller.prototype.showInstallWineScreen = function() {
	var o = this;
	o.screen = 5;
	show("bPrev", "inline-block");
	v("hSysPath3", o.Sys64Catalog);
	showScreen("hScreen5NeedWine");
}

CStaminaInstaller.prototype.wineCatalogExists = function() {
	var o = this, catalog = "/home/" + USER + "/.wine/drive_c/windows/system32";
	o.Sys32Catalog = catalog;
	o.Sys64Catalog = "/home/" + USER + "/.wine/drive_c/windows/syswow64";
	
	
	return (FS.fileExists(catalog) && FS.isDir(catalog));
}
