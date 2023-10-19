function CCompiler(ctx) {
	this.ctx = ctx;
}
CCompiler.prototype.compile = function() {
	// 0 Create folder. Or drop, if it exists
	// 1 Copy /data/tpls/first to folder
	try {
		if (!this.createFolder()) {
			return;
		}
	} catch(err) {
		alert(err);
	}
}


// Copy /data/tpls/first to folder
CCompiler.prototype.onRemoveFolder = function(out, err) {
	var cmd;
	
	try {
		cmd = this.getCmd(this.getCopy() + " " + App.dir() + "/data/tpls/first" + " " + this.targetCatalog);
		this.exec(cmd, [this, this.onCopyFolder], [this, this.onRemoveFolderStdOut],  [this, this.onFailRemoveFolder]);
	} catch(err) {
		alert(err);
	}
}
CCompiler.prototype.onCopyFolder = function(out, err) {
	var o;
	try {
		o = this;
		// 2 set macros in xdesktop.desktop
		this.processMacros('xdesktop.desktop');
		// 3  rename xdesktop.desktop
		setTimeout(function(){
			o.rename('xdesktop.desktop');
		}, 2000);
		// 4 (2-3) for shell.sh
		this.processMacros('shell.sh');
		setTimeout(function(){
			o.rename('shell.sh');
		}, 1000);
		
		// 5 (2) for app.index.html
		this.processMacros('app/index.html');
		this.copyIcon();
		alert(L('Done!'));
	} catch(err) {
		alert(err);
	}
}

CCompiler.prototype.rename = function(fileName) {
	// this.targetCatalog
	var path = this.targetCatalog + "/" + fileName, c, cmd, a = pathinfo(fileName);
	if (!FS.fileExists(path)) {
		alert("Rename: Unable find file " + path);
		return;
	}
	cmd = this.getCmd("mv " + path + " " + this.targetCatalog + "/" + this.catalog +  "." + a.extension);
	// alert(cmd);
	this.exec(cmd, [this, this.onRemoveFolderStdOut], [this, this.onRemoveFolderStdOut],  [this, this.onFailRemoveFolder]);
}

CCompiler.prototype.copyIcon = function() {
	// this.targetCatalog
	var path = attr('imgAppIcon', 'src'), c, cmd, a = pathinfo(path);
	if (!FS.fileExists(path)) {
		alert("Rename: Unable find file " + path);
		return;
	}
	cmd = this.getCmd("cp -f \"" + path + "\" " + this.targetCatalog + "/app/i/icons/32." + a.extension);
	this.exec(cmd, [this, this.onRemoveFolderStdOut], [this, this.onRemoveFolderStdOut],  [this, this.onFailRemoveFolder]);
}

CCompiler.prototype.exec = function(cmd, onF, onO, onE) {
	var sh = App.dir() + "/data/sh/c.sh";
	FS.writefile(sh, cmd);
	return jexec(sh, onF, onO, onE);
}

CCompiler.prototype.processMacros = function(fileName) {
	// this.targetCatalog
	var path = this.targetCatalog + "/" + fileName, c;
	if (!FS.fileExists(path)) {
		alert("processMacros: Unable find file " + path);
		return;
	}
	c = FS.readfile(path);
	c = c.replace(/{{Name}}/mig, v('applicationNameEn'));
	c = c.replace(/{{ruName}}/mig, v('applicationNameRu'));
	c = c.replace(/{{catalog}}/mig, this.catalog);
	c = c.replace(/{{wndBtns3}}/mig, this.getWndButtons());
	c = c.replace(/{{wndFlags}}/mig, this.getWndFlags());
	c = c.replace(/{{W}}/mig, v('hWndWidth'));
	c = c.replace(/{{H}}/mig, v('hWndHeight'));
	
	FS.writefile(path, c);
}


CCompiler.prototype.getWndFlags = function() {
	var s = "";
	s += e('hWndFixed').checked ? ' fixed' : '';
	s += e('hWndTop').checked ? ' onlyTop' : '';
	s += e('hWndSplash').checked ? ' noFrame' : '';
	// s += e('hWndFullScreen').checked ? ' fulScreen' : '';
	
	return s;
}

CCompiler.prototype.getWndButtons = function() {
	var s = "";
	s += e('hWndMin').checked ? '1' : '0';
	s += e('hWndMax').checked ? '1' : '0';
	s += e('hWndCls').checked ? '1' : '0';
	
	return s;
}

CCompiler.prototype.getCopy = function(fileName) {
	var h;
	if (FS.fileExists('/tmp')) {
		h = "cp -rf ";
	} else {
		h = "copy ";
	}
	
	return h;
}

CCompiler.prototype.createFolder = function() {
	var folderIsExists, sysPath, s, catalog, needConfirm, cmd, isConfirm;
	if (FS.fileExists('/tmp')) {
		sysPath = "/opt/qt-desktop-js/apps";
	} else {
		sysPath = "C://qt-desktop-js/apps";
	}
	if (!FS.fileExists(sysPath)) {
		alert(L('Something wrong, catalog') + ' "' + sysPath + '" ' + L('not found.'));
		return false;
	}
	catalog = v('hCatalogName');
	s = sysPath + "/" + catalog;
	
	this.targetCatalog = s;
	this.catalog = catalog;
	
	if (FS.fileExists(s)) {
		needConfirm = true;
	}
	if (needConfirm) {
		isConfirm = confirm(L('Catalog') + catalog + L('already exists') + '.\n' + L('Rewrite it?') + '\n' + L('All changes will loss!'));
	}
	if (needConfirm && isConfirm) {
		cmd = this.getCmd("rm -rf \"" + s + "\""); 
		// TODO
		this.exec(cmd, [this, this.onRemoveFolder], [this, this.onRemoveFolderStdOut],  [this, this.onFailRemoveFolder]);
	} else if (!needConfirm){
		this.onRemoveFolder('', '');
	}
	
	return true;
}


CCompiler.prototype.onRemoveFolderStdOut = function(out) {
	
}
CCompiler.prototype.onFailRemoveFolder = function(err) {
	alert(L("Fail rewrite target catalog!"));
}

CCompiler.prototype.getCmd = function(cmd) {
	var h;
	if (FS.fileExists('/tmp')) {
		h = "#!/bin/bash\n";
		
	} else {
		h = "";
	}
	
	return h + cmd + "\n";
}
