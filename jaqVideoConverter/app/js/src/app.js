window.onload = init;
function init(){
	Qt.setWindowIconImage(Qt.appDir() + '/img/ffmpeg24.png');
	W.app = new App();
}

function jmp3cutOnObserveStd(std) {
	//alert('Live std = ' + std);
}
function jmp3cutOnObserveErr(err) {
	//alert('Live err = ' + err);
}
// Safe forever
function jmp3cutOnObserveFinish(std, err) {
	W.app.onObserveOneFile(std, err);
}

function jmp3cutOnStd(std) {}
function jmp3cutOnErr(err) {}
// TODO safe it forever
function jmp3cutOnFinish(std, err) {
	//alert('Fin  std = ' + std);
	//alert('Fin  err = ' + err);
}



//----

// TOOD - не выбрасывай!
function on() {}

// Это просто для демонстрации
function jmp4convSetProgressView() {
	jmp4convSetDuration();
	jmp4convSetCurrentProgress();
}

function log(m) {return;
	var dt = new Date(),
		s = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + '.' + dt.getMilliseconds();
	PHP.file_put_contents(Qt.appDir() + '/log.log', m + ' ' + s + '\n', 1);
}



