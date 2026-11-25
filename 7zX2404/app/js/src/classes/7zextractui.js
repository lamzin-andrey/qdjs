function C7ZExtractor() {
	var o = this, N = "\n", d = "disabled", file;
	
	this.init = function() {		
		e("bExtract").onclick = onClick;
		e("iPassword").onkeydown = onKD;
		file = App.getArgs()[0];
	}
	
	
	function onKD(ev){
		if (ev.keyCode == 13) {
			onClick();
		}
	}
	
	function onClick(){
		var cmd, sh;
		cmd = "#!/bin/bash" + N;
		cmd += "7z e -p" +  v("iPassword") + " \"" + file + "\"" + N;
		sh = App.dir() + "/data/u.sh";
		FS.writefile(sh, cmd);
		//alert(cmd);
		attr("iPassword", d, d);
		attr("bExtract", d, d);
		
		jexec(sh, onFinish, onStart, onStart);
	}
	
	function onStart(s) {
		FS.writefile(App.dir() + "/data/u.sh", "#!/bin/bash\n");
	}
	
	function onFinish(out, err) {
		var err, path, status = true;
		rm("iPassword", d);
		rm("bExtract", d);
		
		if (err.indexOf("Cannot open encrypted archive") != -1) {
			alert(L("Wrong Password"));
			status = false;
		}
		
		
		if (status) {
			App.quit();
		}
	}
	
	
	function DevNull(){}
}



