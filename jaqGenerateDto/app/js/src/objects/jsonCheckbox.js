var JSONCheckbox = {
	init:function() {
		var o = this, k = 'bJson', c;
		o.checkbox = e(k);
		c = Settings.get(k);
		if (c == 2) {
			o.checkbox.checked = true;
		}
		o.checkbox.onchange = function() {
			o.onChange();
		}
	},
	onChange:function() {
		var o = this, k = 'bJson',
			v = o.checkbox.checked ? 2 : 1;
		Settings.set(k, v);
	}
};