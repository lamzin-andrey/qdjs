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
	this.keywords = ['select', 'from', 'where', 'in', 'update', 'insert', 'values', 'integer', 'primary', 'key',
		'set', 'count', 'datetime', 
		'date',
		'tinyint',
		'not',
		'null',
		'on',
		'left',
		'right',
		'is',
		'union',
		'join',
		'inner'
	];
}

