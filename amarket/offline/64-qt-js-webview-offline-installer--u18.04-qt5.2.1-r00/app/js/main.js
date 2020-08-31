var QT_VERSION  = '5.2.1';
var LIB_PATH    = '/usr/local/Trolltech/Qt-' + QT_VERSION + '/lib';
var EXEC_FOLDER = '/usr/local/fastxampp';
var EXEC_FILE   = 'fastxampp';
var EXEC_NULL = 'Main_defaultFinExecHandler';
var ZEND_EXT_DATE = '20190902';
var TARGZ_NAME = 'xampp-php74.tar.gz';

//TODO set depends from ubuntu modification
var USER_AUTORUN_FOLDER = '/home/[user]/.config/autostart';
var USER_MENU_FOLDER    = '/usr/share/applications';
var UNITY_FOLDER        = '/home/[user]/.local/shared/applications';//пока похоже что этот каталог есть только в unity окружении

$(main);
function main() {
	window.Exec = PHP;
	Exec.exec(Qt.appDir() + '/data/user.sh', 'Main_onGetUser');
}
function Main_onGetUser(stdout, stderr) {
	var userSection, xfceSection, kdeSection, mintSection, buf = stdout.split('isXfce');
	userSection = buf[0].split('user')[1];
	xfceSection = buf[1].split('isKde')[0];
	kdeSection  = buf[1].split('isKde')[1];
	mintSection = buf[1].split('isMint')[1];
	window.USER = $.trim(userSection);
	window.IS_KDE = window.IS_XFCE = window.IS_UNITY = window.IS_MINT = false;
	if (~xfceSection.indexOf('xfdesktop')) {
		window.IS_XFCE = true;
	} else 	if (~mintSection.toLowerCase().indexOf('mint') ) {
		window.IS_MINT = true;
	} else 	if (~kdeSection.indexOf('kwin') || ~kdeSection.indexOf('kwin_x11') || ~kdeSection.indexOf('kde5d') ) {
		window.IS_KDE = true;
		if ( ~kdeSection.indexOf('kded5') ) {
			window.IS_KDE5 = true;
		} else {
			USER_AUTORUN_FOLDER = '/home/[user]/.kde/Autostart';
        }
	} else {
		window.IS_UNITY = true;
	}
	USER_AUTORUN_FOLDER = USER_AUTORUN_FOLDER.replace('[user]', USER);
	Exec.exec('mkdir /home/' + USER + '/.config/fastxampp', 'Main_onConfigFolderCreate');
}

function Main_onConfigFolderCreate(stdout, stdin) {
	$('#btnOk').prop('disabled', false);
}
function Main_defaultFinExecHandler(o, e) {
}
