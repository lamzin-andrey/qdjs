/**
 * Handlers:
 * onStartLoadDikList()
*/
function AppController(id) {
	this.view = e(id);
    this.setListeners();
}

AppController.prototype.onStartLoadDisks = function () {
	this.view.innerHTML = 'Обновление..';
}

AppController.prototype.onEndLoadDisks = function () {
	this.view.innerHTML = '&nbsp;';
}


AppController.prototype.setListeners = function () {
	
}

