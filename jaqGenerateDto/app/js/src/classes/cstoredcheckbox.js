function CStoredCheckbox(key){
	this.key = key; 
}

CStoredCheckbox.prototype.init = function() {
	var o = this, k = this.key, c;
	o.checkbox = e(k);
	c = Settings.get(k);
	if (c == 2) {
		o.checkbox.checked = true;
	}
	o.checkbox.onchange = function() {
		o.onChange();
	}
}
	
CStoredCheckbox.prototype.onChange = function() {
	var o = this, k = this.key,
		v = o.checkbox.checked ? 2 : 1;
	Settings.set(k, v);
}

