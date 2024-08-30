function Sort(){
	this.name = 'Sort';
	this.direct = 'ASC';
	this.field = 'rsz';
}
Sort.prototype.apply = function(list){
	var k = this.field,
		m = 1,
		o = this;
	if (this.direct == 'DESC') {
		m = -1;
	}
	list.sort(function(A, B){
		switch (k) {
			case 'name':
				return o.cmp(A[k], B[k], m);
			case 'rsz':
				return o.cmpSize(A[k], B[k], m);
			case 'type':
				return o.cmpType(A, B, m);
			case 'mt':
				return o.cmpDatetime(A[k], B[k], m);
		}
		
		return 0;
	});
}
Sort.prototype.cmpSize = function(a, b, m){
	if (this.calcSize(a) < this.calcSize(b)) {
		return -1 * m;
	}
	if (this.calcSize(a) > this.calcSize(b)) {
		return 1 * m;
	}
	
	return 0;
}
Sort.prototype.calcSize = function(s){
	s = String(s).replace(' ', '');
	var n = floatval(String(s).replace(',', '.'));
	n *= 1.0;
	s = s.toLowerCase();
	if (s.indexOf('k') != -1 || s.indexOf('к') != -1) {
		return n * 1024;
	}
	if (s.indexOf('m') != -1 || s.indexOf('м') != -1) {
		return n * 1024 * 1024;
	}
	if (s.indexOf('g') != -1 || s.indexOf('г') != -1) {
		return n * 1024 * 1024 * 1024;
	}
	if (s.indexOf('t') != -1 || s.indexOf('т') != -1) {
		return n * 1024 * 1024 * 1024 * 1024;
	}
	
	return n;
}
Sort.prototype.cmpType = function(A, B, m){
	var pathInfo = pathinfo(A['name']);
	a = pathInfo.extension ? pathInfo.extension : '';
	pathInfo = pathinfo(B['name']);
	b = pathInfo.extension ? pathInfo.extension : '';
	if (a < b) {
		return -1 * m;
	}
	if (a > b || '' == a || '' == b || A['type'] == 'File' || B['type'] == 'File') {
		return 1 * m;
	}
	
	return 0;
}
Sort.prototype.cmpDatetime = function(a, b, m){
	if (strtotime(a) < strtotime(b)) {
		return -1 * m;
	}
	if (strtotime(a) > strtotime(b)) {
		return 1 * m;
	}
	
	return 0;
}
Sort.prototype.cmp = function(a, b, m){
	if (a < b) {
		return -1 * m;
	}
	if (a > b) {
		return 1 * m;
	}
	
	return 0;
}
