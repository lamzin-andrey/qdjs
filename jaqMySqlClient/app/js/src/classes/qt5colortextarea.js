
/**
 * @description  
 * @param {String} blockId id block, wrapped textarea element. For excample `<div id="test"><textarea></textarea></div>`
 * 	var rte = new ColorTextArea('test', sqlColorRules);
*/
function Qt5ColorTextArea(blockId, colorRule) {
	this.onChangeCursorPositionContext = this;
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
 * 
*/
Qt5ColorTextArea.prototype.onChangeCursorPosition = function(coord) {
	var s = ' ';
	if (coord && !isNaN(parseInt(coord.line))) {
		setStatusText(L('Line: ') + s + (coord.line + 1) + ', ' + L('Col: ') + s + (1 + coord.column));
	}
}
