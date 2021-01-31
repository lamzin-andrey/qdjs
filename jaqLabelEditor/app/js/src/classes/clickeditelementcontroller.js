/**
 * Handlers:
 * onStartLoadDikList()
*/

function ClickEditElementController(view, value, item) {
	this.item = item;
	this.viewObj = new ClickEditElement(view, value);
	this.viewObj.onChange = {
		m: this.onChange,
		context: this
	};
}

ClickEditElementController.prototype.onChange = function (value) {
	// alert('Will change from ' + this.item.name + ' to ' + value);
	var cmd = PHP.file_get_contents(Qt.appDir() + '/shell/su/rename.tpl.sh'),
		newdir, buf;
	cmd = cmd.replace('{device}', this.item.device);
	cmd = cmd.replace('{device}', this.item.device);
	cmd = cmd.replace('{device}', this.item.device);
	cmd = cmd.replace('{dir}', this.item.dir);
	cmd = cmd.replace('{dir}', this.item.dir);
	cmd = cmd.replace('{newname}', value);
	
	buf = this.item.dir.split('/');
	buf[sz(buf) - 1] = value;
	newdir = buf.join('/');
	
	cmd = cmd.replace('{newdir}', newdir);
	cmd = cmd.replace('{newdir}', newdir);
	cmd = cmd.replace('{newdir}', newdir);
	cmd = cmd.replace('{newdir}', newdir);
	cmd = cmd.replace('{newdir}', newdir);
	
	if (!W.USER || !W.GROUP) {
		alert('Unknown user');
		return;
	}
	
	cmd = cmd.replace('{user}', W.USER);
	cmd = cmd.replace('{group}', W.GROUP);
	cmd = cmd.replace('{user}', W.USER);
	cmd = cmd.replace('{group}', W.GROUP);
	PHP.file_put_contents(Qt.appDir() + '/shell/su/rename.sh', cmd);
	PHP.file_put_contents(Qt.appDir() + '/shell/rename.sh', '#! /bin/bash\npkexec ' + Qt.appDir() + '/shell/su/rename.sh');
	
	PHP.exec(Qt.appDir() + '/shell/rename.sh', 'CLEConFinEdit', 'Null', 'Null');
}

function CLEConFinEdit(output, errors) {
	W.diskListController.onFinExecuteRename(output, errors);
}
