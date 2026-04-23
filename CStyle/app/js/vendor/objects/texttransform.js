var TextTransform = {
	snakeToCamel:function(inp, capitalizeFirst) {
		capitalizeFirst = capitalizeFirst ? capitalizeFirst : false;
		var arr = inp.split('_'), i, r = '', s;
		for(i = 0; i < arr.length; i++) {
			s = arr[i].trim();
			if (i > 0) {
				s = s.charAt(0).toUpperCase() + s.substring(1);
			}
			r += s;
		}
		
		if (capitalizeFirst) {
			r = r.charAt(0).toUpperCase() + r.substring(1);
		}
		
		return r;
	},
	capitalize:function(r) {
		r = r.charAt(0).toUpperCase() + r.substring(1);
		return r;
	},
	camelToSnake:function(s) {
		var a = s, i, r = '';
		for (i = 0; i < a.length; i++) {
			var ch = a.charAt(i);
			if (ch == ch.toUpperCase()) {
				ch = ch.toLowerCase();
				if (i > 0) {
					ch = '_' + ch;
				}
			}
			r += ch;
		}
		
		return r;
	}
};
