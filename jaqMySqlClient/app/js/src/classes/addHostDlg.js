/** 
 * @depends objects/hostssaver.js
*/
function AddHostDlg() {
    this.bHostSave = e('bHostSave');
    this.setListeners();
}

AddHostDlg.prototype.setListeners = function () {
    //this.bHostSave.addEventListener('click', function(e) { return this.onClickBHostSave(e); });
}

AddHostDlg.prototype.onClickBHostSave = function (evt) {
    var r = false;
    try {
	r = W.HostsSaver.addHost(iHost.value, iPort.value, iName.value, iUser.value, iPassword.value);
    } catch (e) {
	alert(e);
    }
    if (r ) {
	alert(L('Параметры соединения сохранены и установлены как текущие'));
    } else {
	alert(L('Все поля обязательны для заполнения!'));
    }
    
}
