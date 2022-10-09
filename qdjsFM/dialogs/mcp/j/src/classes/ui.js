function McpUi() {
	this.name = 'McpUi';
}

McpUi.prototype.setSrcSize = function(v){
	e('hSrcSz').innerHTML = v;
}

McpUi.prototype.setDestSize = function(v){
	e('hDestSz').innerHTML = v;
}

