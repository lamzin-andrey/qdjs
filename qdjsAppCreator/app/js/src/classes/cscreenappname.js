function CScreenAppName() {}
CScreenAppName.prototype.init = function() {
	this.allow = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	this.setListeners();
}

CScreenAppName.prototype.setListeners = function() {
	var o = this;
	e('applicationClassName').onkeydown = function(e) {
		o.inputMask(e);
	}
}

CScreenAppName.prototype.validate = function() {
	var appNameEnErr = e('applicationNameEnErr'), appNameEnVal = e('applicationNameEn').value.trim(), i, SZ, ch,
		classErr = e('applicationClassNameErr'),
		classNameVal = e('applicationClassName').value.trim()
		;
	v(classErr, SP);
	v(appNameEnErr, SP);
	if(appNameEnVal === '') {
		v(appNameEnErr, L('Application name required!'));
		return false;
	}
	
	if(classNameVal === '') {
		v(classErr, L('Application class name required!'));
		return false;
	}
	
	
	SZ = sz(classNameVal);
	
	for (i = 0; i < SZ; i++) {
		ch = classNameVal.charAt(i);
		if (this.allow.indexOf(ch) == -1) {
			v(classErr, L('Application class name containts unallow symbols!'));
			return false;
		}
	}
	
	
	
	return true;
}

/**
 * @description Устанавливает маску ввода на текстовое поле ввода 
 * @param {Event} e onkeydown
*/
CScreenAppName.prototype.inputMask = function(e) {
	//FF
	var key = e.key || Qt.getLastKeyChar(),
		keyCode = e.keyCode || Qt.getLastKeyCode();
	var allow = this.allow, codes = {8:1,37:1, 39:1, 16:1, 46:1, 36:1, 35:1, 9:1};
	if ( !~allow.indexOf(key) && !codes[keyCode]) {
		console.log('Exit 1');
		e.preventDefault();
	}
	
	//cross
	//allow codes: 0123456789-, arrowR, arrowL, home , end, shift, delete, backspace
	var codes = {8:1,37:1, 39:1, 16:1, 46:1, 36:1, 35:1, 109:1, 188:1, 191:1, 108:1, 9:1},
		i,
		//,-
		o2 = {109:1, 189:1, 188:1, 191:1, 108:1};
	for (i = 96; i < 105; i++) {
		codes[i] = 1;
	}
	for (i = 48; i < 58; i++) {
		codes[i] = 1;
	}
	/*if (!codes[e.keyCode] || (e.keyCode == 191 && !e.shiftKey) ) {
		console.log('Exit 2');
		e.preventDefault();
	}*/
	
	return true;
}
