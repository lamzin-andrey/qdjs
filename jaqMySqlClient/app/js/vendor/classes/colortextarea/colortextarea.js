
/**
 * @description  
 * @param {String} blockId id block, wrapped textarea element. For excample `<div id="test"><textarea></textarea></div>`
 * 	var rte = new ColorTextArea('test', sqlColorRules);
*/
function ColorTextArea(blockId, colorRule) {
	this.container = e(blockId);
	this.subjectTa = ee(this.container, 'textarea')[0];
	appendChild(this.container, 'div', '', {'class': 'mirror'});
	appendChild(this.container, 'div', '', {'class': 'cursor'});
	this.colorRule = colorRule;
	this.colorRule.setContext(this);
	this.selection = new ColorTextAreaSelection(this.subjectTa, this);
	this.initalizeView();
}


/**
 * 
 * @description  
*/
ColorTextArea.prototype.initalizeView = function() {
	// Get mirror
	// Get Cursor Layer
	var parentNode = this.container,
		mirror = cs(parentNode, 'mirror')[0],
		cursorBlock = cs(parentNode, 'cursor')[0],
		styles,
		self = this;
	// this.startTimer(); // inputV3
	if (mirror) {
		this.mirror = mirror;
	}
	if (cursorBlock) {
		this.cursor = cursorBlock;
	}
	
	if (!this.mirror || !this.cursor) {
		alert('1');
		return;
	}
	// Set css for mirror from textarea
	this.onResize();
	styles = getComputedStyle(this.subjectTa);
	
	addClass(this.container, 'ctaBgColor');
	
	mirror.style['line-height'] = styles.lineHeight;
	mirror.style.padding = styles.padding;
	mirror.style.margin = styles.margin;
	//mirror.style.marginTop = styles.marginTop; // это от pre
	//mirror.style.marginBottom = styles.marginBottom;
	mirror.style['font-size'] = styles.fontSize;
	mirror.style.fontFamily = styles.fontFamily;
	mirror.style.wordBreak = 'break-all'; // break-all TODO тут может быть косяк с поддержкой?В FF с pre не работает
	this.subjectTa.style.wordBreak = 'break-all';
	mirror.style['overflow-y'] = 'scroll';
	
	// console.log('styles.wordBreak:', 'break-word');// break-all
	// console.log('styles.fontFamily:', styles.fontFamily);
	// Set listeners input, resize, scroll
	this.setListeners();
	this.buildLayout();
	// Set color rule class
	// 	this.colorRule.setContext(this);
	this.textCursor = new ColorTextAreaCursor(cursorBlock, this.subjectTa, mirror, this.container);
	this.onInput();
	/*setTimeout(function() {
		self.textCursor.setCursorPosition();
	}, 100);*/
}

/** 
 * @description Построить блоки в кучу
*/
ColorTextArea.prototype.buildLayout = function() {
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
 * @description Установка слушателей событий
*/
ColorTextArea.prototype.setListeners = function() {
	var self = this;
	this.subjectTa.oninput = function(evt) {
		evt.char = Qt.getLastKeyChar();
		if(evt.ctrlKey) {
			evt.char = '';
		}
		self.onInput(evt);
	}
	this.subjectTa.addEventListener('keydown',function(evt) {
		evt.char = Qt.getLastKeyChar();
		if(evt.ctrlKey) {
			evt.char = '';
		}
		setTimeout(function() {
			self.onInput(evt);
		}, 10);
	}, false);
	this.subjectTa.onmousedown = function(evt) {
		self.onMouseDown(evt);
	}
	this.subjectTa.onmouseup = function(evt) {
		self.onMouseUp(evt);
	}
	window.addEventListener('mouseup',function(evt) {
		self.onMouseUp(evt);
	}, false);
	this.subjectTa.onmousemove = function(evt) {
		self.onMouseMove(evt);
	}
	this.subjectTa.onscroll = function(evt) {
		self.onScroll(evt);
	}
	/*this.subjectTa.onmousewheel = function(evt) {
		self.onScroll(evt);
	}*/
	this.mirror.onscroll = function(evt) {
		evt.preventDefault();
	}
	/*this.subjectTa.addEventListener('resize', function(evt) {
		self.onResize(evt);
	}, false);*/
}
/** 
 * @description Мониторит вертикальную прокрутку
*/
ColorTextArea.prototype.onResize = function(evt) {
	var styles = getComputedStyle(this.subjectTa),
		mirror = this.mirror,
		cursorBlock = this.cursor;
	mirror.style.width = styles.width;
	// mirror.style.maxWidth = styles.width;
	cursorBlock.style.width = styles.width;
	mirror.style.height = styles.height;
	cursorBlock.style.height = styles.height;
}
/** 
 * @description Мониторит вертикальную прокрутку
*/
ColorTextArea.prototype.onScroll = function(evt) {
	/*if (!W.DDD) {
		alert(this.subjectTa.scrollTop);
		W.DDD = true;
	}*/
	// this.mirror.scrollTo(0, this.subjectTa.scrollTop);
	this.mirror.scrollTop = this.subjectTa.scrollTop;
	this.textCursor.setCursorPosition();
}
/** 
 * @description Мониторит вертикальную прокрутку, эмуляция нормального слушателя onmousewheel
 *  Удалось не использовать  за счет ta.opacity = 0.01
*/
ColorTextArea.prototype.emulateOnScroll = function(evt) {
	if (isU(this.prevScrollTop) || this.prevScrollTop != this.subjectTa.scrollTop) {
		this.prevScrollTop = this.subjectTa.scrollTop;
		this.onScroll(evt);
	}
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseDown = function(evt) {
	if (this.modalActive) {
		return true;
	}
	this.mouseIsDown = true;
	if (this.colorRules && this.colorRules['sl']) {
		this.colorRules['sl'] = null;
		delete this.colorRules['sl'];
		var x = this.textCursor.getCaretPosition(this.subjectTa);
		this.subjectTa.setSelectionRange(x, x);
		this.onInput();
	}
	
	return true;
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseUp = function(evt) {
	if (this.modalActive) {
		return true;
	}
	this.mouseIsDown = false;
	
	return true;
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseMove = function(evt) {
	if (this.modalActive) {
		return true;
	}
	if (this.mouseIsDown) {
		this.onResize();
		this.onInput();
	}
}

/** 
 * @description Заворачивает каждый символ в <i> и добавляет классы подсветки символов
*/
ColorTextArea.prototype.onInputV3 = function(evt) {
	var coord;
	if (evt && !evt.char && evt.key) {
		evt.char = evt.key;
	}
	if (this.inpProc) {
		return;
	}
	this.inpProc = 1;
	
	
	this.setRules({});
	// Переустановит (дополнит данными о позиции выделения текста) те же rules что и this.colorRule.calc
	this.selection.calc();
	
	if (this.hasLineNumber()) {
		coord = this.textCursor.getCoord();
		this.priorityLineN = coord.line;
		this.onColorTick();
		// this.doColorLine(coord.line);
	} else {
		this.buildText();
	}
	
	
	
	this.inpProc = 0;
	
	if (this.onChangeCursorPosition instanceof Function) {
		this.onChangeCursorPosition.call(this.onChangeCursorPositionContext, this.textCursor.getCoord());
	}
}

/** 
 * @description 
*/
ColorTextArea.prototype.hasLineNumber = function() {
	var lineN = parseInt(this.textCursor.getCoord().line),
		o = e(this.lineIdPrefix + lineN);
		
	return !isNaN(lineN) && o;
}

/** 
 * @description 
*/
ColorTextArea.prototype.buildText = function() {
	this.lineIdPrefix = 'ColorTextArea_';
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"',
		closeDiv = '</div>',
		n = 0,
		openDiv,
		allClosed = 0;
	openDiv = '<div id="' + this.lineIdPrefix + n + '">';
	q = openDiv;
	/*
	this.setRules({});
	
	// Переустановит (дополнит данными о позиции выделения текста) те же rules что и this.colorRule.calc
	this.selection.calc();*/
	
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
			n++;
			openDiv = '<div id="' + this.lineIdPrefix + n + '">'
			if (i < lastEmptyBr) {
				ch = '<i>&nbsp;</i>' + closeDiv + openDiv;
			} else {
				//ch = '<i><br></i><i><br></i>';
				ch = '<i>&nbsp;</i>' + closeDiv + openDiv;
				n++;
				openDiv = '<div id="' + this.lineIdPrefix + n + '">'
				ch += '<i>&nbsp;</i>' + closeDiv;
			}
		} else {
			cls = '';
			ch = '<i ' + cls + '>' + ch + '</i>'
		}
		q += ch;
	}
	this.mirror.innerHTML = q;
	this.textCursor.setCursorPosition();
}



/** 
 * @description Запускает таймер, красящий строки
*/
ColorTextArea.prototype.startTimer = function() {
	var o = this;
	o.priorityLineN = 'U';
	o.currentColorLine = 0;
	this.ival = setInterval(function(){
		o.onColorTick();
	}, 100);
}

/** 
 * @description Красим очередную строку
*/
ColorTextArea.prototype.onColorTick = function() {
	var total, i;
	
	if (this.colorProc) {
		return;
	}
	this.colorProc = 1;
	
	if (this.priorityLineN != 'U') {
		this.doColorLine(this.priorityLineN);
		this.priorityLineN = 'U';
	}
	this.grayLines = this.subjectTa.value.split('\n');
	total = this.grayLines.length;
	for (i = 0; i < 100; i++) {
		if (this.currentColorLine < total) {
			this.doColorLine(this.currentColorLine);
			this.currentColorLine++;
		} else {
			this.currentColorLine = 0;
		}
	}
	
	this.colorProc = 0;
}


/**
 * @description Заполняем текстом одну строку
*/
ColorTextArea.prototype.updateLineText = function(n) {
	var grayLines = this.subjectTa.value.split('\n'), s,
		div = e(this.lineIdPrefix + n);
	s = grayLines[n];
	if (!s) {
		s = '';
	}
	if (div) {
		div.innerHTML = s.replace(/ /mig, '&nbsp;');
	}
}

/**
 * @description Красим одну строку
*/
ColorTextArea.prototype.doColorLine = function(n) {
	if (!this.grayLines) {
		return;
	}
	var div = e(this.lineIdPrefix + n), s , q = '', 
		cls, i, SZ, ch;
	s = this.grayLines[n]
	if (!div) {
		return;
	}
	if (!s) {
		s = '';
	}
	if (s == '') {
		q = '<i class="br">&nbsp;</i>';
	} else {
		SZ = sz(s);
		for (i = 0; i < SZ; i++) {
			ch = s.charAt(i);
			if (ch == ' ') {
				ch = '&nbsp;';
			}
			cls = this.getRule(i, s);
			ch = '<i ' + cls + '>' + ch + '</i>';
			q += ch;
		}
	}
	
	div.innerHTML = q + '<i class="br">&nbsp;</i>';
}

/** 
 * Отличное решение, но хочется большего.
 * Если вернешься к нему, выкини таймер
 *  - Вернулся, в initalizeView отключил таймер
 * @description Заворачивает каждый символ в <i> и добавляет классы подсветки символов
*/
ColorTextArea.prototype.onInput = function(evt) {
	if (this.inpProc) {
		return;
	}
	this.inpProc = 1;
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"'; //
	this.setRules({});
	
	// Переустановит (дополнит данными о позиции выделения текста) те же rules что и this.colorRule.calc
	this.selection.calc();
	
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
				// ch = '<i><br>&nbsp;</i>';
				ch = '<i><br></i><i><br></i>';
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
	if (this.onChangeCursorPosition instanceof Function) {
		this.onChangeCursorPosition.call(this.onChangeCursorPositionContext, this.textCursor.getCoord());
	}
}



/** 
 * @description Этот метод определяет, надо ли подсвечивать очередной символ, и каким цветом
 * @param {Number} i
 * @param {String} s
 * @return String 'class="kw" ' or ''
*/
ColorTextArea.prototype.getRule = function(i, s) {
	var wrd = this.getWordByPos(s, i), q = '"', selectionCss = 'sl';
	
	if (this.colorRules && this.colorRules[selectionCss] && this.colorRule.isInDiapason(i, this.colorRules[selectionCss])) {
		return 'class=' + q + selectionCss + q;
	}
	
	if (this.colorRule.isInComm(s, i)) {
		return 'class=' + q + this.colorRule.cssComments + q;
	}
	if (this.colorRule.isKW(wrd)) {
		return 'class=' + q + this.colorRule.cssKeywords + q;
	}
	if (this.colorRule.isNum(wrd)) {
		return 'class=' + q + this.colorRule.cssNums + q;
	}
	
	if (this.colorRule.isInStr(s, i)) {
		return 'class=' + q + this.colorRule.cssString + q;
	}
	if (this.colorRule.isInSingleStr(s, i)) {
		return 'class=' + q + this.colorRule.cssSingleString + q;
	}
	if (this.colorRule.isInRE(s, i)) {
		return 'class=' + q + this.colorRule.cssRE + q;
	}
	
	/*var r = this.colorRules, k, j, q = '"',
		selectionCss = 'sl';
	
	for (k in r) {
		if (this.colorRule.isInDiapason(i, r[k])) {
			if (r[selectionCss] && this.colorRule.isInDiapason(i, r[selectionCss])) {
				return 'class=' + q + selectionCss + q;
			}
			return 'class=' + q + k + q;
		}
	}*/
	return '';
}

/** 
 * @description Этот метод вызывает ColorRuleBase или его наследник и передаёт объект с данными о символах,
 * 	которые необходимо раскрасить
*/
ColorTextArea.prototype.setRules = function(rules) {
	this.colorRules = rules;
}


/** 
 * @description Получить слово в строке s в позиции курсора i
 * Если в позиции не буква, вернет ''
*/
ColorTextArea.prototype.getWordByPos = function(s, i) {
	var ch, pStartWrd, pEndWrd, breaks = [' ', '\t', '\n', '\r'];
	if (!s) {
		
		return '';
	}
	s = String(s);
	ch = s.charAt(i);
	if (ch in In(breaks)) {
		
		return '';
	}
	pStartWrd = this.getNearBreak(s, i, breaks, 'lastIndexOf');
	pEndWrd = this.getNearBreak(s, i, breaks, 'indexOf');
	pEndWrd = pEndWrd == -1 ? sz(s) : pEndWrd;
	pStartWrd++;
	ch = s.substring(pStartWrd, pEndWrd).toLowerCase();
	
	return ch;
}
/** 
 * @description Получить ближайшее вхождение символа из breaks в s начиная от позиции i
*/
ColorTextArea.prototype.getNearBreak = function(s, i, breaks, fn) {
	var j, SZ = sz(breaks), m = 1000000, p, L, search = -1;
	for (j = 0; j < SZ; j++) {
		p = s[fn](breaks[j], i);
		if (p > -1) {
			L = Math.abs(i - p);
			if (L < m) {
				m = L;
				search = p;
			}
		}
	}
	
	return search;
}
