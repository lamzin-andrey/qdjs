'use strict'
var Multihost = {
	init:function(unpack) {
		copyFields(unpack, this);
		
	},
	createCommand : function(file) {
		var cmd = "\nmv /opt/lampp/etc/extra /opt/lampp/etc/__extra";
		cmd += "\ncp -rf " + this.dataDir + '/extra /opt/lampp/etc/extra';
		cmd += '\nchmod -R 777 /opt/lampp/etc/extra';
		cmd += '\nchmod  776 /etc/hosts';
		cmd += "\necho '" + __('copy_extra_complete') + "'";
		
		cmd += "\nmv /opt/lampp/etc/httpd.conf /opt/lampp/etc/__httpd.conf"
		cmd += "\ncp -f " + this.dataDir + '/httpd.conf /opt/lampp/etc/httpd.conf';
		cmd += "\nchmod 777 /opt/lampp/htdocs";
		
		cmd += "\nmkdir /opt/lampp/htdocs/localhost";
		cmd += "\nmkdir /opt/lampp/htdocs/localhost/www";
		cmd += "\nchmod 777 /opt/lampp/htdocs/localhost/www";
		cmd += this._getCopyCmd('dashboard');
		cmd += this._getCopyCmd('img');
		cmd += this._getCopyCmd('webalizer');
		cmd += this._getCopyCmd('applications.html', 0);
		cmd += this._getCopyCmd('bitnami.css', 0);
		cmd += this._getCopyCmd('favicon.ico', 0);
		cmd += this._getCopyCmd('index.php', 0);
		
		cmd += "\nmv /opt/lampp/etc/php.ini /opt/lampp/etc/__php.ini"
		cmd += "\ncp -f " + this.dataDir + '/php.ini /opt/lampp/etc/php.ini';
		cmd += "\nrm -r /opt/xampp.tar.gz";
		cmd += "\necho '" + __('copy_config_complete') + "'";
		
		PHP.file_put_contents(file, cmd, FILE_APPEND);
	},
	_getCopyCmd:function(s, recursive) {
		recursive = (recursive === undefined ? '-rf' : '-f');
		var cmd = ('\ncp ' + recursive + ' /opt/lampp/htdocs/' + s + ' /opt/lampp/htdocs/localhost/www/' + s);
		recursive = (recursive === '-f' ? '' : '-r');
		cmd += ('\nrm ' + recursive + ' /opt/lampp/htdocs/' + s);
		return cmd;
	},
	onProcessOut:function(s) {
		$('#' + this.labelId).text(s);
	}
};
