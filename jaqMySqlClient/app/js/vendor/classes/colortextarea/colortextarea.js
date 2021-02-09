function ColorTextArea(blockId, colorRule) {
	this.container = e(blockId);
	this.subjectTa = ee(this.container, 'textarea')[0];
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
		styles;
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
	
	mirror.style['line-height'] = styles.lineHeight;
	mirror.style.padding = styles.padding;
	mirror.style.margin = styles.margin;
	//mirror.style.marginTop = styles.marginTop; // это от pre
	//mirror.style.marginBottom = styles.marginBottom;
	mirror.style['font-size'] = styles.fontSize;
	mirror.style.fontFamily = styles.fontFamily;
	mirror.style.wordBreak = 'break-all'; // TODO тут может быть косяк с поддержкой?В FF с pre не работает
	mirror.style['overflow-y'] = 'scroll';
	// mirror.style['overflow-x'] = 'none'; // TODO возможна засада
	console.log('styles.wordBreak:', 'break-word');// break-all
	console.log('styles.fontFamily:', styles.fontFamily);
	// Set listeners input, resize, scroll
	this.setListeners();
	// Set color rule class
	// 	this.colorRule.setContext(this);
	this.textCursor = new ColorTextAreaCursor(cursorBlock, this.subjectTa, mirror, this.container);
	this.onInput();
}

/** 
 * @description Установка слушателей событий
*/
ColorTextArea.prototype.setListeners = function() {
	var self = this;
	this.subjectTa.oninput = function(evt) {
		self.onInput(evt);
	}
	this.subjectTa.addEventListener('keydown',function(evt) {
		setTimeout(function() {
			self.onInput(evt);
		}, 100);
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
	this.subjectTa.addEventListener('resize', function(evt) {
		self.onResize(evt);
	}, false);
}
/** 
 * @description Мониторит вертикальную прокрутку
*/
ColorTextArea.prototype.onResize = function(evt) {
	console.log('I Call');
	var styles = getComputedStyle(this.subjectTa),
		mirror = this.mirror,
		cursorBlock = this.cursor;
	mirror.style.width = styles.width;
	// mirror.style.maxWidth = styles.width;
	cursorBlock.style.width = styles.width;
	mirror.style.height = styles.height;
	cursorBlock.style.height = styles.height;
	
	console.log(styles.height);
	// this.mirror.scrollTo(0, this.subjectTa.scrollTop);
}
/** 
 * @description Мониторит вертикальную прокрутку
*/
ColorTextArea.prototype.onScroll = function(evt) {
	// console.log(this.subjectTa.scrollTop);
	this.mirror.scrollTo(0, this.subjectTa.scrollTop);
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseDown = function(evt) {
	this.mouseIsDown = true;
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseUp = function(evt) {
	this.mouseIsDown = false;
}
/** 
 * @description Мониторит выделение
*/
ColorTextArea.prototype.onMouseMove = function(evt) {
	if (this.mouseIsDown) {
		this.onResize();// TODO попробуй, вдруг Qt лучше! А если не лучше, удали из setListeners
		this.onInput();
	}
}
/** 
 * @description Заворачивает каждый символ в <i> и добавляет классы подсветки символов
*/
ColorTextArea.prototype.onInput = function(evt) {
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"'; //
	this.colorRule.calc(s);
	// Переустановит (дополнит данными о позиции выделения текста) те же rules что и this.colorRule.calc
	this.selection.calc();
	// console.log(this.colorRules);
	// return;
	// ColorRule.context.setRules(rules);
	// rules: {cssClassName: [0,5, 12,14, ...], cssClassName2: [9,14, 20,28, ...]}
	for (i = 0; i < sz(s); i++) {
		ch = s.charAt(i);
		if (ch == '\n') {
			ch = '<i><br></i>';
		} else {
			cls = this.getRule(i);
			ch = '<i ' + cls + '>' + ch + '</i>'
		}
		q += ch;
	}
	this.mirror.innerHTML = q;
	this.textCursor.setCursorPosition();
}
/** 
 * @description Этот метод определяет, надо ли подсвечивать очередной символ, и каким цветом
 * @param {Number} i
 * @return String 'class="kw" ' or ''
*/
ColorTextArea.prototype.getRule = function(i) {
	var r = this.colorRules, k, j, q = '"',
		selectionCss = 'sl';
	for (k in r) {
		if (this.colorRule.isInDiapason(i, r[k])) {
			if (r[selectionCss] && this.colorRule.isInDiapason(i, r[selectionCss])) {
				return 'class=' + q + selectionCss + q;
			}
			return 'class=' + q + k + q;
		}
	}
	return '';
}

/** 
 * @description Этот метод вызывает ColorRuleBase или его наследник и передаёт объект с данными о символах,
 * 	которые необходимо раскрасить
*/
ColorTextArea.prototype.setRules = function(rules) {
	this.colorRules = rules;
}


