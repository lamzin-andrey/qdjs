/**
 * @description  
 * 
 * @param {HtmlDiv} htmlDiv - контейнер, в котором располагается "текстовый курсор"
 * @param {TextArea} textarea - реальное поле ввода
 * @param {HtmlDiv} mirror "цветное" представление текста из textarea
 * @param {HtmlDiv} container блок, в котором находятся htmlDiv, textarea и mirror
 * 
 * @return 
*/
function ColorTextAreaCursor(htmlDiv, textarea, mirror, container) {
	this.textarea = textarea;
	this.view = htmlDiv;
	this.mirror = mirror;
	this.initalizeView();
	this.container = container;
}


/**
 * 
 * @description  
*/
ColorTextAreaCursor.prototype.initalizeView = function() {
	var styles = getComputedStyle(this.textarea);
	this.view.style.position = 'relative';
	this.view.innerHTML = '';
	this.cursor = appendChild(this.view, 'div', '&nbsp;');
	this.cursor.style.position = 'absolute';
	this.cursor.style.width = '10px';
	this.cursor.style['max-height'] = (parseInt(styles.lineHeight) - 0) + 'px';
	this.cursor.style['height'] = (parseInt(styles.lineHeight) - 0) + 'px';
	this.cursor.style.backgroundColor = '#85F0BC';
	this.cursor.style.top = '0px';
	this.cursor.style.left = '0px';
	this.cursor.style.zIndex = 2;
	this.setListeners();
}

/** 
 * @description Установка слушателей событий
*/
ColorTextAreaCursor.prototype.setListeners = function() {
	var self = this;
	this.textarea.addEventListener('keydown', function(evt){
		setTimeout(function(){
			self.setCursorPosition();
		}, 100);
		
	});
	this.textarea.addEventListener('click', function(evt){
		setTimeout(function(){
			self.setCursorPosition();
		}, 100);
		
	});
}
/** 
 * @description Устанавливает курсор в блоке соответственно реальному курсору в реальном поле ввода 
*/
ColorTextAreaCursor.prototype.setCursorPositionV3 = function() {
	var pos = this.getCaretPosition(this.textarea),
		ls, sZ, y = 0, x = 0;
	if (pos < 0 || isNaN(pos)) {
		// console.log('Exit here');
		return;
	}
	/*pos--;
	if (pos < 0) {
		pos = 0;
	}*/
	ls = ee(this.mirror, 'i');
	// console.log('ls', ls);
	// console.log('pos', pos);
	sZ = sz(ls);
	if (pos > sZ - 1) {
		pos = sZ - 1;
	}
	// console.log('pos aft corr', pos);
	if (ls[pos]) {
		console.log('Set pos' + pos);
		
		y = (ls[pos].offsetTop /*- this.container.offsetTop*/ - this.textarea.scrollTop);
		x = (ls[pos].offsetLeft /*- this.container.offsetLeft*/);
		if (y > this.mirror.offsetHeight || y < -1) {
			this.cursor.style.opacity = 0;
		} else {
			this.cursor.style.opacity = 1;
		}
		// console.log('ls[pos].offsetTop', y);
		// console.log('ls[pos].offsetLeft', x);
		this.cursor.style.top = y + 'px';
		this.cursor.style.left = x + 'px';
	}
}
/** 
 * @description Устанавливает курсор в блоке соответственно реальному курсору в реальном поле ввода 
*/
ColorTextAreaCursor.prototype.setCursorPosition = function() {
	var pos = this.getCaretPosition(this.textarea),
		ls, sZ, y = 0, x = 0;
	if (pos < 0 || isNaN(pos)) {
		// console.log('Exit here');
		return;
	}
	ls = ee(this.mirror, 'i');
	// console.log('ls', ls);
	// console.log('pos', pos);
	sZ = sz(ls);
	if (pos > sZ - 1) {
		pos = sZ - 1;
	}
	// console.log('pos aft corr', pos);
	if (ls[pos]) {
		y = (ls[pos].offsetTop /*- this.container.offsetTop*/ - this.textarea.scrollTop);
		x = (ls[pos].offsetLeft /*- this.container.offsetLeft*/);
		if (y > this.mirror.offsetHeight || y < -1) {
			this.cursor.style.opacity = 0;
		} else {
			this.cursor.style.opacity = 1;
		}
		// console.log('ls[pos].offsetTop', y);
		// console.log('ls[pos].offsetLeft', x);
		this.cursor.style.top = y + 'px';
		this.cursor.style.left = x + 'px';
	}
}


/** 
 * @description Получение позиции курсора в текстовом поле
 * @param {TextArea} ta
 * @return Number
*/
ColorTextAreaCursor.prototype.getCaretPosition = function(ta) {
	var input = ta;
	var pos = 0;
	// IE Support
	if (document.selection) {		
		if (input.value.length == 0) return 0;
		ta.focus();
		var sel = document.selection.createRange();
		var clone  = sel.duplicate();
		sel.collapse(true);
		clone.moveToElementText(ta);
		clone.setEndPoint('EndToEnd', sel);
		return (clone.text.length);
	}
	// Firefox support
	else if (input.selectionStart || input.selectionStart == '0'){
		if (input.selectionEnd && input.selectionEnd > input.selectionStart) {
			pos = input.selectionEnd;
		} else {
			pos = input.selectionStart;
		}
	}
	return pos;
}

/** 
 * @description Получение номера строки курсора (нумеруем с 0)
 * @param {TextArea} ta
 * @return {line, column}
*/
ColorTextAreaCursor.prototype.getCoord = function() {
	var ta = this.textarea,
		s = ta.value,
		r = {},
		arr,
		pos = this.getCaretPosition(ta);
	this.lastGetPos = pos;
	if (pos <= 0) {
		r.line = 0;
		r.column = 0;
		
		return r;
	}
	s = s.substring(0, pos);
	a = s.split('\n');
	r.line = a.length - 1;
	r.column = a[r.line].length;
	
	return r;
}

