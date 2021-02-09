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
	this.view.style.position = 'relative';
	this.view.innerHTML = '';
	this.cursor = appendChild(this.view, 'div', '&nbsp;');
	this.cursor.style.position = 'absolute';
	this.cursor.style.width = '10px';
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
ColorTextAreaCursor.prototype.setCursorPosition = function() {
	var pos = this.getCaretPosition(this.textarea),
		ls, sZ, y = 0, x = 0;
	if (pos < 0 || isNaN(pos)) {
		return;
	}
	ls = ee(this.mirror, 'i');
	console.log('ls', ls);
	console.log('pos', pos);
	sZ = sz(ls);
	if (pos > sZ - 1) {
		pos = sZ - 1;
	}
	console.log('pos aft corr', pos);
	if (ls[pos]) {
		y = (ls[pos].offsetTop - this.container.offsetTop);
		x = (ls[pos].offsetLeft - this.container.offsetLeft);
		console.log('ls[pos].offsetTop', y);
		console.log('ls[pos].offsetLeft', x);
		this.cursor.style.top = y + 'px';
		this.cursor.style.left = x + 'px';
	} else {
		console.log('Danken');
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
		/*input.focus();
		var sel = document.selection.createRange();
		var n = sel.moveStart ('character', -1*input.value.length);
		sel.collapse(true);
		alert(n);
		pos = sel.text.length;
		alert(pos);*/
	}
	// Firefox support
	else if (input.selectionStart || input.selectionStart == '0'){
		pos = input.selectionStart;		
	}
	return pos;
}

