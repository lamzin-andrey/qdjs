function ColorRuleSql() {
	this.configure();
}
extend(ColorRuleBase, ColorRuleSql);

ColorRuleSql.prototype.configure = function() {
	this.cssKeywords = 'kw';
	this.cssSingleString = 'ss';
	this.cssString = 's';
	this.cssComments = 'c';
	this.cssApString = 'as';
	this.cssRE = 'r';
	this.cssNums = 'n';
	this.keywords = ['select', 'from', 'where', 'in', 'update', 'insert', 'values', 'integer', 'primary', 'key',
		'set', 'count', 'datetime', 'distinct', 'group',
		'date',
		'tinyint',
		'not',
		'null',
		'on',
		'or',
		'and',
		'left',
		'right',
		'is',
		'as',
		'union',
		'join',
		'limit',
		'order',
		'desc',
		'asc',
		'by',
		'delete',
		'inner'
	];
	this.singleCommentStart = '--'
	this.commentStart = '/*';
	this.commentEnd = '*/';
}

/**
 * @description Определяет, не начинается ли в позиции i однострочный комментарий '//'
 * 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleSql.prototype.checkIsStartOnestringComment = function(s, i) {
	var q = s.charAt(i) + s.charAt(i + 1);
	return (q == '--');
}

/**
 * @description Определяет, не начинается ли в позиции i регулярное выражение
 * 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleSql.prototype.checkIsStartRegExp = function(s, i) {
	return false;
}

/*
 *  @description Определяет, не заканчивается ли регулярное выражение
 * 
 * @param {String} s
 * @param {Number} startREPos
 * @param {Number} i
*/
ColorRuleSql.prototype.checkIsEndRE = function(s, startREPos, i) {
	return false;
}

/*
 *  @description Определяет, не заканчивается ли регулярное выражение
 * 
 * @param {String} s
 * @param {Number} startREPos
 * @param {Number} i
*/
ColorRuleSql.prototype.checkIsEndRE = function(s, startREPos, i) {
	return false;
}
