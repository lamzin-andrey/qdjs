function CAppCheckSum() {}
CAppCheckSum.prototype.init = function() {
	var o = this;
	o.setListeners();
	
}
CAppCheckSum.prototype.setListeners = function() {
	var o = this;
	o.bSelect = e("bSelectCalalog");
	o.bInitSum = e("bInitSum");
	o.bCheckSum = e("bCheckSum");
	o.bSelect.onclick = function(ev){o.onClickSelect(ev);}
	o.bInitSum.onclick = function(ev){o.onClickInitSum(ev);}
	o.bCheckSum.onclick = function(ev){o.onClickCheckSum(ev);}
}

CAppCheckSum.prototype.onClickSelect = function() {
	
}
CAppCheckSum.prototype.onClickInitSum = function() {
}
CAppCheckSum.prototype.onClickCheckSum = function() {
	
}
