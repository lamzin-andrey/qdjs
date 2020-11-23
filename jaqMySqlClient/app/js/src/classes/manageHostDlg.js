/** 
 * @depends objects/hostssaver.js
*/
function ManageHostDlg() {
    this.selHosts = e('selHosts');
    this.loadHosts();
    this.setListeners();
    this.selHosts.focus();
}

ManageHostDlg.prototype.setListeners = function () {
    //this.bHostSave.addEventListener('click', function(e) { return this.onClickBHostSave(e); });
}

ManageHostDlg.prototype.loadHosts = function () {
    var ls = W.HostsSaver.getAll(),
	i, s = '', q, a = '';
    //clear select
    this.selHosts.options.length = 0;
    for (i in ls) {
	//add option
	q = ls[i].dbname + ' ' + i;
	if (ls[i].active == 1) {
	    a = ' selected ';
	} else {
	    a = '';
	}
	s += '<option ' + a + ' value="' + i + '">' + q + '</option>';
    }
    this.selHosts.innerHTML = s;
}

ManageHostDlg.prototype.onClickBHostEdit = function (evt) {
    var id = this.selHosts.options[this.selHosts.selectedIndex].value,
	connection;
    
    var r = false;
    try {
	appWindow('hConfigServerParams', 'Добавить сервер', onClosePopup);
	W.addHostDlg = new AddHostDlg();
	connection = W.HostsSaver.loadHostData(id);
	iHost.value = connection.host;
	iPort.value = connection.port;
	iName.value = connection.dbname;
	iUser.value = connection.dbuser;
	iPassword.value = connection.dbpassword;
    } catch (e) {
	alert(e);
    }
}

ManageHostDlg.prototype.onClickBHostRemove = function (evt) {
    var id = this.selHosts.options[this.selHosts.selectedIndex].value, r;
    r = W.HostsSaver.remove(id);
    if (r) {
	this.loadHosts();
    }
}

ManageHostDlg.prototype.onClickBHostActivate = function (evt) {
    var id = this.selHosts.options[this.selHosts.selectedIndex].value,
	connection = W.HostsSaver.loadHostData(id);
    W.HostsSaver.savePhpConfig(connection.host, connection.port, connection.dbname, connection.dbuser, connection.dbpassword);
    W.HostsSaver.setHostAsActive(id);
    alert(L('Параметры соединения сохранены.'));
}

