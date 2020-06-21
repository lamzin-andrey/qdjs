/** 
 * @depends objects/hostssaver.js
*/
function AddHostDlg() {
    this.bHostSave = e('bHostSave');
    this.setListeners();
}

AddHostDlg.prototype.setListeners = function () {
    this.bHostSave.addEventListener('click', function(e) { return this.onClickBHostSave(e); });
}

AddHostDlg.prototype.onClickBHostSave = function (evt) {
    
}
