function AddJ(){

//1.0.1
//location this file relative djs.exe: "default/tools/js/j.js"
window.QtBrige = {
	/**
	 * {String} callback
	 * {String} stdout
	 * {String} stderr
	*/
	onFinish:function(callback, stdout, stderr) {
		if (window[callback] instanceof Function) {
			var re = new RegExp(Qt.getLineDelimeter(), 'mg');
			var out = stdout.replace(re, '\n'),
				stderr = stderr.replace(re, '\n');
			window[callback](out, stderr);
		}
	}
};

PHP.scandir = function(path) {
	var re = new RegExp(Qt.getLineDelimeter(), 'mg');
	var arr = PHP._scandir(path).split(re), i, b = [];
	for (i = 0; i < arr.length; i++) {
		b.push(arr[i].replace(path + '/', ''));
	}
	return b;
}

window.FILE_APPEND = 1;

/** @class localize */
window.addEventListener('load', __jqtCreateLocalizator, false);
function __jqtCreateLocalizator()
{
	// Set xdg-open for all links
	__jqtSetXdgOpenForLinks();
	
	var locale = document.getElementsByTagName('html')[0].getAttribute('lang'),
		filePath = Qt.appDir() + '/js/ru.json', loc;
	if (PHP.file_exists(filePath)) {
		try {
			loc = JSON.parse( PHP.file_get_contents(filePath) );
			//TODO здесь будет локализация
		} catch(e) {;}
		if (!loc) {
			//alert('Unable parse JSON data');
			return;
		}
		//Локализуем все value в input[type=button] и весь label.innerHTML
	} else {
		//alert(filePath);
	}
}


// class jexec
function jExec() {}
/**
 * @description Run system command.
 * @param {String} command (command for call)
 * @param {Function|Object|Array} onFinish. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Function|Object|Array} onStdout. See onFinish format
 * @param {Function|Object|Array} onError. See onFinish format
 * @return Array [sysId, procId] sysId - system process id in linux; procId - handle for get sysId with PHP.getSysId(procId);
*/
jExec.prototype.run = function(command, onFinish, onStdout, onStderr) {
	var sOnFinishname = this.generateName('onFinish'),
		sOnOutname = this.generateName('onStdout'),
		sOnErrorname = this.generateName('onStderr'),
		o = this;
	
	window[sOnFinishname] = function(stdout, stderr) {
		o.apply(onFinish, [stdout, stderr]);
	}
	window[sOnOutname] = function(stdout) {
		o.apply(onStdout, [stdout]);
	}
	window[sOnErrorname] = function(stderr) {
		o.apply(onStderr, [stderr]);
	}
	
	var procId = PHP.exec(command, sOnFinishname, sOnOutname, sOnErrorname),
		sysId = parseInt(PHP.getSysId(procId));
	sysId = isNaN(sysId) ? 0 : sysId;
	
	return [sysId, procId];
}
/**
 * @param {Function|Object|Array} callable. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Array} args
*/
jExec.prototype.apply = function(callable, args) {
	var cback = callable,
		w = window,
		isF  = ( cback instanceof Function ),
		ctx, f;

	if(cback && isF) {
		ctx = w;
		f = cback;
	}
	  
	if (
		cback && cback.m instanceof Function
		&& (cback.context instanceof Object)
		){
			ctx = cback.context;
			f = cback.m;
	}
	  
	if (cback && cback[0] instanceof Object &&  cback[1] instanceof Function) {
		ctx = cback[0];
		f = cback[1];
	}
	  
	if (f instanceof Function){
		return f.apply(ctx, args);
	}
	  
	return null;
}
/**
 * @param {String}
*/
jExec.prototype.generateName = function(prefix) {
	var dt = new Date(), suffix = String(dt.getTime()) + String(Math.random()).replace('.', '_');
	return prefix + suffix;
}

/**
 * @see Jexec.run
*/
window.jexec = function(command, onFinish, onStdout, onStderr) {
	var o = new jExec();
	// return o.run(command, onFinish, onStdout, onStderr);
	if (command.indexOf('/user.sh') != -1) {
		onFinish[1].call(onFinish[1], `user
vasya
isXfce
PID
xfdesktop
isKde
PID
isMint
xfceThemeName
oxygen
qdjsVersion
3.1.1
		`);
		return 1;
	}
}

// end class jexec

// Set xdg-open for all links

function __jqtSetXdgOpenForLinks() {
	var ls = document.getElementsByTagName('a'), 
		i,
		lnk,
		ctx,
		isWindows = false,
		Null = new Function();
	if (OS.getTempFolderPath()[1] == ':') {
		isWindows = true;
	}
	for (i = 0; i < ls.length; i++) {
		lnk = ls[i].getAttribute('href');
		if (lnk.indexOf('http') === 0) {
			ctx = ls[i];
			ls[i].addEventListener('click', function(evt){
				evt.preventDefault();
				var link = this.getAttribute('href');
				if (!isWindows) {
					PHP.exec('xdg-open ' + link, Null, Null, Null);
				} else {
					try {
						OS.ShellExecuteQ('open', link, '', '', false);
					} catch(err) {
						alert(err);
					}
				}
				return false;
			}, false);
		}
	}
}

window.FS = {
	unlink:function(path) {
		return PHP.unlink(path);
	},
	isDir:function(path) {
		return PHP.is_dir(path);
	},
	readfile:function(path){
		return PHP.file_get_contents(path);
	},
	writefile:function(path, content, flags){
		return PHP.file_put_contents(path, content, flags);
	},
	fileExists:function(path){
		return PHP.file_exists(path);
	},
	scandir:function(path){
		return PHP.scandir(path);
	},
	filesize:function(path){
		return PHP.filesize(path);
	},
	savePng:function(path, base64Str, iQuality) {
		Qt.savePng(path, base64Str, iQuality);
	},
	saveJpeg:function(path, base64Str, iQuality) {
		Qt.saveJpeg(path, base64Str, iQuality);
	}
};

window.Env = {
    openFileDialog: function(caption, dir, filter){
		return Qt.openFileDialog(caption, dir, filter);
	},
	openFilesDialog: function(caption, dir, filter){
		return Qt.openFilesDialog(caption, dir, filter);
	},
	openDirectoryDialog: function(caption, dir) {
		return Qt.openDirectoryDialog(caption, dir, '');
	},
	saveFileDialog: function(caption, dir, filter) {
		return Qt.saveFileDialog(caption, dir, filter);
	},
	exec: function(command, onFinallyExecute, onStdOut, onStdErr) {
		return jexec(command, onFinallyExecute, onStdOut, onStdErr);
	},
	isRun: function(innerProcId) {
		return PHP.isRun(innerProcId);
	}
};

window.App = {
	dir: function(){
		return Qt.appDir();
	},
	getArgs: function(){
		return Qt.getArgs();
	},
	quit:function(){
		Qt.quit();
	}
};

window.MW = {
	getLastKeyChar: function(){
		return Qt.getLastKeyChar();
	},
	getLastKeyCode: function(){
		return Qt.getLastKeyCode();
	},
	moveTo: function(x, y) {
		Qt.moveTo(x, y);
	},
	resizeTo: function(w, h) {
		Qt.resizeTo(w, h);
	},
	showFullScreen: function() {
		Qt.showFullScreen();
	},
	showNormal: function() {
		Qt.showNormal();
	},
	minimize: function() {
		Qt.minimize();
	},
	maximize: function() {
		Qt.maximize();
	},
	showMainMenu: function() {
		Qt.showMainMenu();
	},
	setIconImage: function(path) {
		Qt.setWindowIconImage(path);
	},
	hideMainMenu: function() {
		Qt.hideMainMenu();
	},
	setTitle: function(s) {
		Qt.setTitle(s);
	},
	close: function() {
		Qt.quit();
	}
};
}
