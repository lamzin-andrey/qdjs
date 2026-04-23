function CWinXpLogonJoke() {
	var o = this,
		aProc,
		ival;
	this.className = 'CWinXpLogonJoke';
	
	
	//constructor
	
	setTimeout(function(){
		var sh, cmd;
		//App.newWindow(App.dir() + '/dlg/app', ['']);
		cmd = "#!/bin/bash\n" + 
			"mplayer " + App.dir() + "/data/start.wav &\n" + 
			"qdjs " + App.dir() + '/dlg/app\n';
		sh = App.dir() + "/data/u.sh";
		FS.writefile(sh, cmd);
		aProc = jexec(sh, DevNull, DevNull, DevNull);
		ival = setInterval(onTick, 1000);
	}, 1000);
	
	function onTick() {
		if (!Env.isRun(aProc[1])) {
			Qt.quit();
		}
	}
}


function DevNull(){}
