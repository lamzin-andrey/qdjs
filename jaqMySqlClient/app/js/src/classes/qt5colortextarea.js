
/**
 * @description  
 * @param {String} blockId id block, wrapped textarea element. For excample `<div id="test"><textarea></textarea></div>`
 * 	var rte = new ColorTextArea('test', sqlColorRules);
*/
function Qt5ColorTextArea(blockId, colorRule) {
	this.container = e(blockId);
	this.subjectTa = ee(this.container, 'textarea')[0];
	appendChild(this.container, 'div', '', {'class': 'mirror'});
	appendChild(this.container, 'div', '', {'class': 'cursor'});
	this.colorRule = colorRule;
	this.colorRule.setContext(this);
	this.selection = new ColorTextAreaSelection(this.subjectTa, this);
	this.initalizeView();
}
extend(ColorTextArea, Qt5ColorTextArea);

/** 
 * @description Мониторит вертикальную прокрутку
*/
Qt5ColorTextArea.prototype.onResize = function(evt) {
	var styles = getComputedStyle(this.subjectTa),
		mirror = this.mirror,
		cursorBlock = this.cursor;
	mirror.style.width = parseInt(styles.width) + 20 + 'px';
	cursorBlock.style.width = styles.width;
	mirror.style.height = styles.height;
	cursorBlock.style.height = styles.height;
}


/** 
 * @description Построить блоки в кучу
*/
Qt5ColorTextArea.prototype.buildLayout = function() {
	this.container.style.position = 'relative';
	this.subjectTa.style.position = 'absolute';
	this.mirror.style.position = 'absolute';
	this.cursor.style.position = 'absolute';
	
	this.subjectTa.style.zIndex = 3;
	this.mirror.style.zIndex = 2;
	this.cursor.style.zIndex = 1;
	
	this.subjectTa.style.left = 0;
	this.mirror.style.left = 0;
	this.cursor.style.left = 0;
	this.subjectTa.style.top = 0;
	this.mirror.style.top = 0;
	this.cursor.style.top = 0;
	
	this.subjectTa.style.opacity = 0.02;
}

/** 
 * @description Заворачивает каждый символ в <i> и добавляет классы подсветки символов
*/
Qt5ColorTextArea.prototype.onInput = function(evt) {
	if (this.inpProc) {
		return;
	}
	this.inpProc = 1;
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"'; //
	// this.colorRule.calc(s);
	this.setRules({});
	
	// console.log(this.colorRule);
	
	// return;
	// Переустановит (дополнит данными о позиции выделения текста) те же rules что и this.colorRule.calc
	this.selection.calc();
	// console.log(this.colorRules);
	// return;
	// ColorRule.context.setRules(rules);
	// rules: {cssClassName: [0,5, 12,14, ...], cssClassName2: [9,14, 20,28, ...]}
	
	// Всем переносам строк, которые без текста добавляем пробел
	var prevCh, lastEmptyBr = sz(s) - 1;
	for (i = sz(s) - 1; i > -1; i--) {
		ch = s.charAt(i);
		if (ch == '\n' && prevCh == '\n') {
			lastEmptyBr = i;
		} else {
			break;
		}
		prevCh = ch;
	}
	// alert(lastEmptyBr);
	
	for (i = 0; i < sz(s); i++) {
		ch = s.charAt(i);
		if (ch == ' ') {
			ch = '&nbsp;';
		}
		if (ch == '\n') {
			if (i < lastEmptyBr) {
				ch = '<i><br></i>';
			} else {
				ch = '<i><br>&nbsp;</i>';
			}
		} else {
			cls = this.getRule(i, s);
			ch = '<i ' + cls + '>' + ch + '</i>'
		}
		q += ch;
	}
	this.mirror.innerHTML = q;
	this.textCursor.setCursorPosition();
	this.inpProc = 0;
}
