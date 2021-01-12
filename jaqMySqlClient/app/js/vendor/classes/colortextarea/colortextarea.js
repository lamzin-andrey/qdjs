function ColorTextArea(blockId, colorRule) {
	this.subjectTa = e(blockId);
	this.colorRule = colorRule;
	this.colorRule.setContext(this);
	this.initalizeView();
}


/**
 * 
 * @description  
*/
ColorTextArea.prototype.initalizeView = function() {
	// Get mirror
	// Get Cursor Layer
	var parentNode = this.subjectTa.parentNode,
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
	styles = getComputedStyle(this.subjectTa);
	mirror.style.width = styles.width;
	// mirror.style.maxWidth = styles.width;
	cursorBlock.style.width = styles.width;
	mirror.style.height = styles.height;
	cursorBlock.style.height = styles.height;
	
	
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
}

/** 
 * @description Установка слушателей событий
*/
ColorTextArea.prototype.setListeners = function() {
	var self = this;
	this.subjectTa.oninput = function(evt) {
		self.onInput(evt);
	}
}
/** 
 * @description Заворачивает каждый символ в <i> и добавляет классы подсветки символов
*/
ColorTextArea.prototype.onInput = function(evt) {
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"'; //
	this.colorRule.calc(s);
	// console.log(this.colorRules);
	// return;
	// ColorRule.context.setRules(rules);
	// rules: {cssClassName: [0,5, 12,14, ...], cssClassName2: [9,14, 20,28, ...]}
	for (i = 0; i < sz(s); i++) {
		ch = s.charAt(i);
		if (ch == '\n') {
			ch = '<br>';
		} else {
			cls = this.getRule(i);
			ch = '<i ' + cls + '>' + ch + '</i>'
		}
		q += ch;
	}
	this.mirror.innerHTML = q;
}
/** 
 * @description Этот метод определяет, надо ли подсвечивать очередной символ, и каким цветом
 * @param {Number} i
 * @return String 'class="kw" ' or ''
*/
ColorTextArea.prototype.getRule = function(i) {
	var r = this.colorRules, k, j, q = '"';
	for (k in r) {
		if (this.colorRule.isInDiapason(i, r[k])) {
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


