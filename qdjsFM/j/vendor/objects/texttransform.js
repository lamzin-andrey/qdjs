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
	},
	/**
	 * @description Splits a long number of three characters. For example argument 1000000 return '1 000 000'
	*/
	money:function(s){
		var o = this, i, a = [], j = 0;
		s = o.nums(s);
		for (i = s.length - 1; i > -1 ; i--, j++) {
			if (j > 0 && (j % 3) ==  0) {
				a.push(' ');
			}
			a.push(s.charAt(i));
		}
		s = a.reverse().join('');
		return s;
	},
	/**
	 * @description Remove all no numbers chars  
	*/
	nums:function(s){
		var o = this;
		s = String(s).replace(/[\D]/mig, '');
		return s;
	},
	/**
	 * @description 
	 * 
	 * Change word from value of argument n
	 * For example "day"
	 * 
	 * pluralize(n, 'day', 'days', 'days');
	 * becouse 'one day' (one),
	 * 			  'three days'(less4, 3 <= 4),
	 *			  'twenty days' (more19, 20 > 19)

     * (less4 and more19 is actual for russian language)
	 * 
	 *  
	 * Склоняет лексему (eд. измерения) в зависимости от значения n
	 * На примере "день"
	 * pluralize(n, 'день', 'дня', 'дней');
	 * потому что 'один день' (one),
	 * 			  'три дня'(less4, 3 <= 4),
	 *			  '20 дней' (more19, 20 > 19)
	*/
	pluralize: function(n, one, less4, more19) {
		var m, lex, r, i;
		m = String(n);
		if (m.length > 1) {
			m =  parseInt( m.charAt(m.length - 2) + m.charAt(m.length - 1) );
		}
		lex = less4;
		if (m > 20) {
			r = String(n);
			i = parseInt( r.charAt( r.length - 1 ) );
		   if (i == 1) {
				lex = one;
			} else {
				if (i == 0 || i > 4) {
				   lex = more19;
				}
			}
		} else if (m > 4 || m == '00'|| m == '0') {
			lex = more19;
		} else if (m == 1) {
			lex = one;
		}
		return lex;
	}
};
