'use strict'
var Autorun = {
	init:function(unpack) {
		copyFields(unpack, this);
		this.rcTpl = '#fastxamppdaemon start\n\
mount -t tmpfs tmpfs /home/[USER]/.config/fastxampp -o size=1M\n\
echo "" > /home/[USER]/.config/fastxampp/.sock\n\
chown [USER]:[USER] /home/[USER]/.config/fastxampp/.sock\n\
/usr/local/fastxampp/fastxamppd [USER]\n\
# /fastxamppdaemon start';
		
	},
	createCommand : function(file) {
		//create fastxampp files
		var cmd = "\necho '" + __('create_fastxampp_folder') + "'" + this.createFolderCommand(LIB_PATH),
			iconFolder = '/usr/share/icons/Faenza/apps/64';
		cmd += this.createFolderCommand(EXEC_FOLDER);
		cmd += this.createFolderCommand(iconFolder);
		//copy qt files
		var libFilesPath = Qt.appDir() + '/data/lib';
		var targetLibDir = LIB_PATH.replace(/\/lib$/, '');
		cmd += "\ncp -rf " + libFilesPath + ' ' + targetLibDir;
		var pluginFilesPath = Qt.appDir() + '/data/plugins';
		cmd += "\ncp -rf " + pluginFilesPath + ' ' + targetLibDir;
		//copy fastxampp files
		var fastxamppFilesPath = Qt.appDir() + '/data/bin';
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxampp ' + EXEC_FOLDER + '/fastxampp';
		var runCmd = PHP.file_get_contents(fastxamppFilesPath +  '/fastxampp.tpl.sh');
		runCmd = runCmd.replace('[version]', QT_VERSION).replace('[version]', QT_VERSION);
		var arg = '';
		//if (window.IS_MINT || window.IS_XFCE) {
			arg = '--force-tray';
		//}
		runCmd = runCmd.replace('[arg]', arg);
		PHP.file_put_contents(fastxamppFilesPath + '/fastxampp.sh', runCmd);
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxampp.sh ' + EXEC_FOLDER + '/fastxampp.sh';
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxamppd ' + EXEC_FOLDER + '/fastxamppd';
		cmd += "\ncp -f " + fastxamppFilesPath + '/' + langName + '/lang ' + EXEC_FOLDER + '/lang';
		cmd += "\ncp -f " + fastxamppFilesPath + '/phv ' + EXEC_FOLDER + '/phv';
		
		
		
		//patch rc.local
		if (!this.systemCtlIsEnable()) {
			cmd += this.createRcCommand();
		} else {
			cmd +=  this.createSystemCtlCommand();
		}
		//run daemon
		cmd += "\necho '" + __('create_virtual_filesystem') + "'";
		cmd += "\nmount -t tmpfs tmpfs /home/" + USER + "/.config/fastxampp -o size=1M\nsleep 2";
		cmd += "\necho '" + __('create_socket') + "'";
		cmd += "\necho '' > /home/" + USER + "/.config/fastxampp/.sock";
		cmd += "\nchown " + USER + ":" + USER + " /home/" + USER + "/.config/fastxampp/.sock";
		cmd += this.createFolderCommand(iconFolder);
		cmd += '\ncp -f ' + fastxamppFilesPath + '/xampp.png ' + iconFolder + '/fastxampp.png';
		
		cmd += "\necho '" + __('run_fastxamppd') + "'";
		cmd += "\nkillall fastxamppd";
		cmd += "\n/usr/local/fastxampp/fastxamppd " + USER + ' &';
		
		//copy fastxampp.desktop
		
		//copy fastxampp autolauncher
		//подготовить скрипт запуска, переписать в нем версию qt
		var launcherFolder = Qt.appDir() + '/data/bin/launcher';
		var launchShell = PHP.file_get_contents(launcherFolder + '/launch-fastxampp.sh.tpl');
		launchShell = launchShell.replace('[version]', QT_VERSION).replace('[version]', QT_VERSION);
		PHP.file_put_contents(launcherFolder + '/launch-fastxampp.sh', launchShell);
		//Скопировать фалы лаунчера, его запуск - с экспортом.
		cmd += "\nmkdir /usr/local/fastxampp/launcher";
		cmd += "\necho '" + __('copy_launcher') + "'";
		cmd += "\ncp -rf " + launcherFolder + "/app /usr/local/fastxampp/launcher";
		cmd += "\ncp -rf " + launcherFolder + "/default /usr/local/fastxampp/launcher";
		cmd += "\necho '" + __('copy_launcher_files') + "'";
		cmd += "\ncp -f " + launcherFolder + "/launch-fastxampp.sh /usr/local/fastxampp/launcher/launch-fastxampp.sh";
		cmd += "\ncp -f " + launcherFolder + "/qdjs /usr/local/fastxampp/launcher/qdjs";
		
		//Для авторана использовать desktop запускающий лаунчер
		//alert('Before createAutorunDesktopFile');
		var isUnity = this.isUnityEnv();
		if (!isUnity) {//для юнити автозапуска не будет, будет значок в левом меню
			this.createAutorunDesktopFile(fastxamppFilesPath);
		}
		//after('Before createAutorunDesktopFile');
		//copy fastxampp.desktop to menu folder
		var desktop = PHP.file_get_contents(fastxamppFilesPath + '/fastxampp.desktop.tpl');
		desktop = desktop.replace('[version]', QT_VERSION);
		PHP.file_put_contents(fastxamppFilesPath + '/fastxampp.desktop', desktop);
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxampp.desktop ' + USER_MENU_FOLDER + "/fastxampp.desktop\n";
		
		if (window.IS_KDE5) {
			/*cmd += "\nadd-apt-repository ppa:tehnick/xembed-sni-proxy";
			cmd += "\napt-get update";
			cmd += "\napt-get install -y plasma-systray-legacy";*/
		}
		
		PHP.file_put_contents(file, cmd, FILE_APPEND);
		
	},
	/**
	 * * TODO в main сделать детект kde 5 иначе лажа также можно осторожно использовать  UNITY_FOLDER
	 * @return {Boolean} true если существует UNITY_FOLDER и установлена IS_UNITY
	*/
	isUnityEnv:function() {
		return IS_UNITY;
	},
	/**
	 * TODO canonical favorites add fastxampp.desktop 
	*/
	createUnityLauncherItem:function() {
		Exec.exec("gsettings get com.canonical.Unity.Launcher favorites", 'Autostart_OnFinishGetUnityPanelItems');
	},
	/**
	 * 
	*/
	createSystemCtlCommand:function() {
		var rcTpl = this.rcTpl,
			file = '/usr/local/fastxampp/fastxamppd.sh', //daemon file
			result = '';
		//write daemon file instruction
		result = '\ncp -f ' + Qt.appDir() + '/data/systemctl/fastxamppd.sh ' + file;
		result += '\nchmod 766 ' + file;
		result += "\necho '#! /bin/sh' >> " + file;
		var cmd = rcTpl.replace(/\[USER\]/mg, USER);
		var a = cmd.split('\n');
		for (var i = 0; i < a.length; i++) {
			result += "\necho '" + a[i] + "' >> " + file;
		}
		//copy .service file
		result += '\ncp -f ' + Qt.appDir() + '/data/systemctl/fastxampp.service ' + '/etc/systemd/system/fastxampp.service';
		//enable service
		result += '\nsystemctl enable fastxampp.service';
		return result;
	},
	/**
	 * @return {Boolean} true if systemctl enabled
	*/
	systemCtlIsEnable:function() {
		return PHP.file_exists('/bin/systemctl');
	},
	/**
	 * В зависимости от типа операционной системы добавить в автостарт правильный значок запуска
	*/
	createAutorunDesktopFile:function(fastxamppFilesPath) {
		var cfc = this.createFolderCommand(USER_AUTORUN_FOLDER);
		var a = cfc.split('\n');
		for (var i = 0; i < a.length; i++) {
			cfc = $.trim(a[i]);
			if (cfc) {
				Exec.exec(cfc, EXEC_NULL);
			}
		}
		
		var desktopTemplate = '/fastxampprun.desktop.tpl',
			targetFile = '/fastxampprun.desktop';
		if (IS_UNITY) {
			desktopTemplate = '/fastxampp.desktop.tpl';
			targetFile      = '/fastxampp.desktop';
		}
		
		var desktop = PHP.file_get_contents(fastxamppFilesPath + desktopTemplate);
		desktop = desktop.replace('[version]', QT_VERSION);
		PHP.file_put_contents(fastxamppFilesPath + targetFile, desktop);
		PHP.file_put_contents(fastxamppFilesPath + '/launcher/app/data/locale', langName);
		setTimeout(function() {
			Exec.exec('cp -f ' + fastxamppFilesPath + targetFile + ' ' + USER_AUTORUN_FOLDER + targetFile, EXEC_NULL);
		}, 2000);
	},
	/** */
	createRcCommand:function() {
		var rcTpl = this.rcTpl,
			file = '/etc/init.d/rc.local',
			result = '';
		if (PHP.file_exists(file)
		) {
			var s = PHP.file_get_contents(file);
			if (s.indexOf('#fastxamppdaemon start') == -1) {
				var cmd = rcTpl.replace(/\[USER\]/mg, USER);
				var a = cmd.split('\n');
				for (var i = 0; i < a.length; i++) {
					result += "\necho '" + a[i] + "' >> " + file;
				}
				return result;
			}
		} else {
			alert(__('Sorry, file ') + file + __(' not found, autorun is disable'));
		}
		return '';
	},
	/***/
	createFolderCommand: function(s) {
		var a = s.split('/'), buf = [], q = '', i, sBuf;
		for (i = 0; i < a.length; i++) {
			sBuf = a[i];
			if (sBuf.length) {
				buf.push(sBuf);
				sBuf = buf.join('/');
				if (sBuf.length > 1) {
					sBuf = '/' + sBuf;
					if (!PHP.file_exists(sBuf)) {
						q += '\nmkdir ' + sBuf;
					}
				}
			}
		}
		return q;
	}
};


function Autostart_OnFinishGetUnityPanelItems(out, err) {
	var i, qIsStart = false, ch, buf = '', arr = [], target = 'application://fastxampp.desktop', targetExists = 0;

	for (i = 0; i < out.length; i++) {
		ch = out.charAt(i);
		if (ch == "'") {
			qIsStart = !qIsStart;
			continue;
		}
		if (qIsStart) {
			buf += ch;
		} else if(buf.length){
			if (buf == target) {
				targetExists = true;
			}
			arr.push("'" + buf + "'");
			buf = '';
		}
	}
	
	if (!targetExists) {
		arr.push("'" + target + "'");
	}
	var command = '#! /bin/bash\n gsettings set com.canonical.Unity.Launcher favorites "[' + arr.join(', ') + ']"';
	
	PHP.file_put_contents(Qt.appDir() + '/data/unpack.sh', command);
	Exec.exec(Qt.appDir() + '/data/unpack.sh', 'F');
}

