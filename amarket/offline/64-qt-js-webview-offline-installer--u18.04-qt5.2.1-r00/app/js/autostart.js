'use strict';
var Autorun = {
	init:function(unpack) {
		copyFields(unpack, this);
		this.rcTpl = '#mount1MbRAM start\n\
mount -t tmpfs tmpfs /home/[USER]/.config/fastxampp -o size=1M\n\
# /mount1MbRAM';
	},
	createCommand : function(file) {
		
		// Здесь только создание линки на qdjs
		// и старт монтирования ФС в оперативу.
		
		var cmd = "\necho '" + __('create_fastxampp_folder') + "'\n" + this.createFolderCommand(LIB_PATH),
			iconFolder = '/usr/share/icons/Faenza/apps/64',
			installFilesPath = Qt.appDir() + '/data/icons';
		cmd += this.createFolderCommand(EXEC_FOLDER);
		cmd += this.createFolderCommand(iconFolder);
		cmd += this.createQdjsSymlink();
		//patch rc.local
		if (!this.systemCtlIsEnable()) {
			cmd += this.createRcCommand();
		} else {
			cmd +=  this.createSystemCtlCommand();
		}
		//run daemon
		cmd += "\necho '" + __('create_virtual_filesystem') + "'";
		cmd += "\nmount -t tmpfs tmpfs /home/" + USER + "/.config/" + APP_NAME + " -o size=1M\nsleep 2";
		cmd += "\necho '" + __('create_socket') + "'";
		cmd += "\necho '' > /home/" + USER + "/.config/" + APP_NAME + "/.sock";
		cmd += "\nchown " + USER + ":" + USER + " /home/" + USER + "/.config/" + APP_NAME + "/.sock";
		//cmd += this.createFolderCommand(iconFolder); ?? double?
		
		//Копируем иконку инсталлятора для GUI установщиков приложений
		cmd += '\ncp -f -v ' + installFilesPath + '/exec.png ' + iconFolder + '/exec.png';
		cmd += '\ncp -f -v ' + installFilesPath + '/applications-other-64.png ' + iconFolder + '/applications-other-64.png';
		cmd += '\ncp -f -v ' + installFilesPath + '/applications-other-128.png ' + iconFolder + '/applications-other-128.png';
		cmd += '\ncp -f -v ' + installFilesPath + '/applications-other-256.png ' + iconFolder + '/applications-other-256.png';
		
		
		//Для авторана использовать desktop запускающий лаунчер
		//alert('Before createAutorunDesktopFile');
		var isUnity = this.isUnityEnv();
		if (!isUnity) {//для юнити автозапуска не будет, будет значок в левом меню
			// Здесь нечего запускать при старте this.createAutorunDesktopFile(fastxamppFilesPath);//TODO arg и вообще подумать
		}
		//Тут ещё раз внимательно почитать и подумать, зщачем это всё,
		// но скорее всег просто создать значок для меню разработка, там должен default открываться.
		
		//after('Before createAutorunDesktopFile');
		//copy fastxampp.desktop to menu folder
		
		//Создаём ссылку на справку  для разработчиков
		//I stop - createMenuItem не работает!
		cmd += this.createMenuItem('qt-desktop-js');
		PHP.file_put_contents(file, cmd, FILE_APPEND);
		
	},
	/**
	 * @description 
	 * @return {String} команду копирования файла запуска из меню программ
	*/
	createMenuItem:function(shortcutName) {
		var dir = Qt.appDir() + '/data/shortcuts';
		var desktop = PHP.file_get_contents(dir + '/' + shortcutName + '.desktop.tpl');
		// desktop = desktop.replace('[version]', QT_VERSION);
		PHP.file_put_contents(dir + '/' + shortcutName + '.desktop', desktop);
		var cmd = "\ncp -f " + dir + '/' + shortcutName + '.desktop ' + USER_MENU_FOLDER + "/" + shortcutName + ".desktop\n";
		
		if (window.IS_KDE5) {
			/*cmd += "\nadd-apt-repository ppa:tehnick/xembed-sni-proxy";
			cmd += "\napt-get update";
			cmd += "\napt-get install -y plasma-systray-legacy";*/
		}
		
		return cmd;
	},
	/**
	 * @return {String} команду создания ссылки /usr/bin/qdjs
	*/
	createQdjsSymlink:function() {
		var cmd = '\nrm -f /usr/local/bin/' + APP_NAME;
		cmd += "\nln -s " + EXEC_FOLDER + '/run.sh' + ' /usr/local/bin/' + APP_NAME;
		return cmd;
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
	 * Команда создания файлов сервиса и регистрации сервиса
	*/
	createSystemCtlCommand:function() {
		var rcTpl = this.rcTpl,
			file = EXEC_FOLDER + '/mountfs.sh', //daemon file
			result = '';
		//write daemon file instruction
		result = '\ncp -f -v ' + Qt.appDir() + '/data/systemctl/mountfs.sh ' + file;
		result += '\nchmod 766 ' + file;
		result += "\necho '#! /bin/sh' >> " + file;
		var cmd = rcTpl.replace(/\[USER\]/mg, USER);
		var a = cmd.split('\n');
		for (var i = 0; i < a.length; i++) {
			result += "\necho '" + a[i] + "' >> " + file;
		}
		//copy .service file
		result += '\ncp -f -v ' + Qt.appDir() + '/data/systemctl/' + APP_NAME + '.service ' + '/etc/systemd/system/' + APP_NAME + '.service';
		//enable service
		result += '\nsystemctl enable ' + APP_NAME + '.service';
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

