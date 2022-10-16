function McpUi() {
	this.name = 'McpUi';
	this.srcBytes = 0;
	this.destBytes = 0;
	this.fileSize = new FileSize();
}

McpUi.prototype.setSrcSize = function(v){
	this.srcBytes = v;
	e('hSrcSz').innerHTML = this.fileSize.getHumanFilesize(v, 2, 3, false);
	pBarSetPureVal(intval(this.destBytes), intval(this.srcBytes));
}

McpUi.prototype.setDestSize = function(v){
	this.destBytes = v;
	e('hDestSz').innerHTML = this.fileSize.getHumanFilesize(v, 2, 3, false);
	pBarSetPureVal(intval(this.destBytes), intval(this.srcBytes));
}
McpUi.prototype.setCurrentFileName = function(s){
	var i, q = '', SZ, a = [], j;
	s = String(s);
	SZ = sz(s);
	for (i = SZ - 1, j = 0; i > -1; i--, j++) {
		a.push(s.charAt(i));
		if (j > 49) {
			break;
		}
	}
	a.reverse();
	s = a.join('');
	e('progressStateLabel').innerHTML = '...' + s;
}

