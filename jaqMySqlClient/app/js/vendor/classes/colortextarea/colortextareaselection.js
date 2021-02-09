function ColorTextAreaSelection(textarea, context) {
	this.textarea = textarea;
	this.context = context;
	this.configure();
}
ColorTextAreaSelection.prototype.configure = function() {
	
}
ColorTextAreaSelection.prototype.calc = function() {
	var r = this.context.colorRules,
		start = this.textarea.selectionStart,
		end = this.textarea.selectionEnd;
	// console.log(document.getSelection().isCollapsed);
	if (!isNaN(start) && !isNaN(end) && start != end) {
		r['sl'] = [start, end];
	}
	if (this.context && (this.context.setRules instanceof Function)) {
		this.context.setRules(r);
	}
	
}
