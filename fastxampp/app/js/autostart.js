'use strict'
var Autorun = {
	init:function(unpack) {
		copyFields(unpack, this);
		
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
		PHP.file_put_contents(fastxamppFilesPath + '/fastxampp.sh', runCmd);
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxampp.sh ' + EXEC_FOLDER + '/fastxampp.sh';
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxamppd ' + EXEC_FOLDER + '/fastxamppd';
		cmd += "\ncp -f " + fastxamppFilesPath + '/' + langName + '/lang ' + EXEC_FOLDER + '/lang';
		
		//patch rc.local
		cmd += this.createRcCommand();
		//run daemon
		cmd += "\necho '" + __('create_virtual_filesystem') + "'";
		cmd += "\nmount -t tmpfs tmpfs /home/" + USER + "/.config/fastxampp -o size=1M\nsleep 2";
		cmd += "\necho '" + __('create_socket') + "'";
		cmd += "\necho '' > /home/" + USER + "/.config/fastxampp/.sock";
		cmd += "\nchown " + USER + ":" + USER + " /home/" + USER + "/.config/fastxampp/.sock";
		cmd += "\necho '" + __('run_fastxamppd') + "'";
		cmd += "\nkillall fastxamppd";
		cmd += "\n/usr/local/fastxampp/fastxamppd " + USER + ' &';
		//copy fastxampp.desktop
		Exec.exec('cp -f ' + fastxamppFilesPath + '/xampp.png ' + iconFolder + '/xampp.png', EXEC_NULL);
		var desktop = PHP.file_get_contents(fastxamppFilesPath + '/fastxampp.desktop.tpl');
		desktop = desktop.replace('[version]', QT_VERSION);
		PHP.file_put_contents(fastxamppFilesPath + '/fastxampp.desktop', desktop);
		Exec.exec('cp -f ' + fastxamppFilesPath + '/fastxampp.desktop ' + USER_AUTORUN_FOLDER + '/fastxampp.desktop', EXEC_NULL);
		
		//copy fastxampp.desktop to root folder
		cmd += "\ncp -f " + fastxamppFilesPath + '/fastxampp.desktop ' + USER_MENU_FOLDER + "/fastxampp.desktop\n"
		PHP.file_put_contents(file, cmd, FILE_APPEND);
	},
	/** */
	createRcCommand:function() {
		var rcTpl = '#fastxamppdaemon start\n\
mount -t tmpfs tmpfs /home/[USER]/.config/fastxampp -o size=1M\n\
echo "" > /home/[USER]/.config/fastxampp/.sock\n\
chown [USER]:[USER] /home/[USER]/.config/fastxampp/.sock\n\
/usr/local/fastxampp/fastxamppd [USER]\n\
# /fastxamppdaemon start',
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
	createFolderCommand: function(s) {
		var a = s.split('/'), buf = [], q = '', i, sBuf;
		for (i = 0; i < a.length; i++) {
			sBuf = a[i];
			if (sBuf.length) {
				buf.push(sBuf);
				sBuf = buf.join('/');
				if (sBuf.length > 1) {
					sBuf = '/' + sBuf;
					q += '\nmkdir ' + sBuf;
				}
			}
		}
		return q;
	}
};
