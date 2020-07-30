function RusDateConv(inputId, outputId) {
	var inp = this.inp = $('#' + inputId);
	var out = this.out = $('#' + outputId);
	var self = this;
	inp.on('keydown', function(evt) { return self.onKeyDown(evt); });
	out.on('click', function(evt) { return self.onActivatOutput(evt); });
	out.on('focus', function(evt) { return self.onActivatOutput(evt); });
}

RusDateConv.prototype.onActivatOutput = function(evt){
	this.out.select();
}
RusDateConv.prototype.onKeyDown = function(evt, immediately){
	if(evt.keyCode == 9) {
		return true;
	}
	if (!immediately) {
		var self = this;
		setTimeout(function(){
			self.onKeyDown(evt, true);
		}, 100);
		return true;
	}
	
	var a = this.inp.val().split('-'),
		Y, m, d, s, d = '.';
	if (a.length == 3) {
		s = a[2] + d + a[1] + d + a[0];
		this.out.val(s);
	}
	
	return true;
}
