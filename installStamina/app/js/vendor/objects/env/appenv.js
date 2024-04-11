function DevNull(){}
/**
 *  envObject.USER = window.USER;
    envObject.IS_KDE = window.IS_KDE;
    envObject.IS_KDE5 = window.IS_KDE5;
    envObject.IS_XFCE = window.IS_XFCE;
    envObject.IS_UNITY = window.IS_UNITY;
	envObject.IS_MINT = window.IS_MINT;
	envObject.USER_KDE_AUTORUN_FOLDER = window.USER_AUTORUN_FOLDER;
	envObject.XFCE_ICON_THEME = window.XFCE_ICON_THEME;
	envObject.QDJS_VERSION = window.QDJS_VERSION;
 * */
window.AppEnv = {
	init:function(aCallback, aPreCallback) {
		this.config = {};
		this.readLastSettings();
		if (this.config && this.config.USER && aPreCallback && (aPreCallback[1] instanceof Function)) {
			aPreCallback[1].apply(aPreCallback[0]);
		}
		this.aCallback = aCallback;
		jexec(App.dir() + '/js/vendor/objects/env/data/user.sh', [this, this.onUserData], DevNull, DevNull);
	},
	onUserData:function(stdout, stderr) {
		var userSection, xfceSection, kdeSection, mintSection, 
			xfceThemeSection, qdjsSection,
			buf = stdout.split('isXfce'),
			envObject = {};
		userSection = String(buf[0].split('user')[1]);
		xfceSection = String(buf[1].split('isKde')[0]);
		kdeSection  = String(buf[1].split('isKde')[1]);
		mintSection = String(buf[1].split('isMint')[1]);
		xfceThemeSection = String(buf[1].split('xfceThemeName')[1]);
		qdjsSection = String(buf[1].split('qdjsVersion')[1]);
		window.USER = userSection.trim();
		if (!FS.fileExists('/home/' + USER) && FS.fileExists('/home/' + USER + 'user') && FS.isDir('/home/' + USER + 'user')) {
			window.USER += 'user';
		}
		window.IS_KDE = window.IS_XFCE = window.IS_UNITY = window.IS_MINT = false;
		// Активная тема оформления xfce
		window.XFCE_ICON_THEME = '';
		window.USER_KDE_AUTORUN_FOLDER = '';
		
		
		
		if (~xfceSection.indexOf('xfdesktop')) {
			window.IS_XFCE = true;
		} else 	if (~mintSection.toLowerCase().indexOf('mint') ) {
			window.IS_MINT = true;
		} else 	if (~kdeSection.indexOf('kwin') || ~kdeSection.indexOf('kwin_x11') || ~kdeSection.indexOf('kde5d') ) {
			window.IS_KDE = true;
			if ( ~kdeSection.indexOf('kded5') ) {
				window.IS_KDE5 = true;
			} else {
				USER_KDE_AUTORUN_FOLDER = '/home/[user]/.kde/Autostart';
			}
		} else {
			window.IS_UNITY = true;
		}
		window.XFCE_ICON_THEME = (xfceThemeSection.replace('/Net/IconThemeName', '')).trim();
		window.XFCE_ICON_THEME = window.XFCE_ICON_THEME.split('\n')[0];
		window.QDJS_VERSION = qdjsSection.trim();
		USER_KDE_AUTORUN_FOLDER = USER_KDE_AUTORUN_FOLDER.replace('[user]', USER);
		
		
		envObject.USER = window.USER;
		envObject.IS_KDE = window.IS_KDE;
		envObject.IS_KDE5 = window.IS_KDE5;
		envObject.IS_XFCE = window.IS_XFCE;
		envObject.IS_UNITY = window.IS_UNITY;
		envObject.IS_MINT = window.IS_MINT;
		envObject.USER_KDE_AUTORUN_FOLDER = window.USER_KDE_AUTORUN_FOLDER;
		envObject.XFCE_ICON_THEME = window.XFCE_ICON_THEME;
		envObject.QDJS_VERSION = window.QDJS_VERSION;
		PHP.file_put_contents(Qt.appDir() + '/env.json', JSON.stringify(envObject));
		
		
		if (this.aCallback && this.aCallback[1] instanceof Function) {
			this.aCallback[1].apply(this.aCallback[0]);
		}
	},
	readLastSettings:function() {
		var s = FS.readfile(Qt.appDir() + '/env.json');
		try {
			this.config = JSON.parse(s);
		} catch (err) {
			this.config = {
				USER: '',
				IS_KDE: false,
				IS_KDE5: false,
				IS_XFCE: false,
				IS_UNITY: false,
				IS_MINT: false,
				USER_KDE_AUTORUN_FOLDER: '',
				XFCE_ICON_THEME: '',
				QDJS_VERSION : ''
			};
		}
	}
	
};

