__FILE__ = '/opt/qt-desktop-js/lib/web/js/mbox';


function DevNull(){}

function MessageBoxA(handle, text, caption, flags) {
	// TODO parse flags
	// Пока хардкодим, см doc.txt
	var o, proc, ival, file, cmd, sh, message = "0\n" +  // MB_OK
		"40\n" +           // MB_INFORMATION
		"0\n" +			   // MB_DEFBUTTON1
		"48976\n";		   // MB_SETFOREGROUND|MB_TOPMOST
		
	this.onFinish = function(){
		var r;
		if (handle instanceof Function) {
			r = FS.readfile(__FILE__ + "/app/d/result.txt");
			clearInterval(ival);
			handle(r);
			return;
		}
		if ((handle instanceof Array) && (handle[1] instanceof Function) && (handle[0] instanceof Object)) {
			r = FS.readfile(__FILE__ + "/app/d/result.txt");
			clearInterval(ival);
			handle[1].call(handle[0], r);
			return;
		}
		if ((handle instanceof Object) && (handle.method instanceof Function) && (handle.context instanceof Object)) {
			r = FS.readfile(__FILE__ + "/app/d/result.txt");
			clearInterval(ival);
			handle.method.call(handle.context, r);
			return;
		}
	}

	message += caption.trim() + "\n";
	message += text;
	
	file = __FILE__ + "/app/d/params.txt";
	FS.writefile(file, message);
	
	cmd = "#!/bin/bash\nqdjs " + __FILE__ + "/app\n";
	sh = App.dir() + "/p/u.sh";
	if (!FS.fileExists(sh)) {
		alert("File `" + sh + "` not found!");
		return;
	}
	FS.writefile(sh, cmd);	
	proc = jexec(sh, [this, this.onFinish], DevNull, DevNull);
	o = self;
	ival = setInterval(onTick, 100);
	
	function onTick(){
		if (+proc[1] > 0) {
			if (!env.isRun(proc[1])) {
				clearInterval(ival);
				o.onFinish();
			}
		}
	}
}


//MessageBoxA(hWnd, "Текст", "Заголовок", MB_EXAMPLE)
