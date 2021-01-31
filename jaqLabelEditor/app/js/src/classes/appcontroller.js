/**
 * Handlers:
 * onStartLoadDikList()
*/
function AppController(id) {
	this.view = e(id);
    this.setListeners();
}

AppController.prototype.onStartLoadDisks = function () {
	// alert('END 2!');
	this.view.innerHTML = 'Обновление..';
}

AppController.prototype.onEndLoadDisks = function () {
	// alert('END!');
	this.view.innerHTML = '&nbsp;';
}


AppController.prototype.setListeners = function () {
	
}

