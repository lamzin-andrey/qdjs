function ColorTextArea(blockId, colorRule) {
	this.subjectTa = e(blockId);
	this.colorRule = colorRule;
	// TODO this.colorRule.setContext(this);
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
 * TODO тут заворачивать в <i>
 * @description Установка слушателей событий
*/
ColorTextArea.prototype.onInput = function(evt) {
	var s = this.subjectTa.value, i, ch, q = '', cls = 'class="kw"'; //
	// this.colorRule.calc(s); TODO
	// ColorRule.context.setRules(rules);
	// rules: [n: sCssClassName,, n + 1: undefined ] ..
	for (i = 0; i < sz(s); i++) {
		ch = s.charAt(i);
		if (ch == '\n') {
			ch = '<br>';
		} else {
			// cls = this.getRule(i);// TODO return 'class="kw" ' or ''
			ch = '<i ' + cls + '>' + ch + '</i>'
		}
		q += ch;
	}
	this.mirror.innerHTML = q;
}
/** 
 * TODO скорее всего излишне
 * @description Установка цвета. В mirror каждый символ завернут в <i></i>
 * @param {Number} indexA 0
 * @param {Number} indexB
 * @param {String} color '#0000AA'
 * @param {String} fontStyle 'b' 'i' 'n'
 * @param {String} bgColor '#000099'
*/
ColorTextArea.prototype.setColor = function(indexA, indexB, color, fontStyle, bgColor) {
	
}


