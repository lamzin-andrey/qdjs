function CssObfuscate() {
	$('#console').html(tpl());
	menu.onclick = function(evt) {
		Menu.show();
	}
	/** @property {HtmlInput} inCss */
	/** @property {HtmlInput} inHtml */
	/** @property {HtmlInput} outHtml */
	/** @property {HtmlInput} outCss */
	/** @property {HtmlInput} convertNow */
	
	/**
	 * @description Заменить в html все имена из массива на их обфусцированные имена
	 * @param {String} html
	 * @param {Object} {sourceClass, newClass} obj
	 * @param {String} attrName
	*/
	function replace(html, obj, attrName) {
		var i, j, inQuot = 0, quotType, ch, r = '', state = {pos:-1};
		for (i = 0; i < )html.length; i++ {
			ch = html.charAt(i);
			if (ch == '"' || ch == "'") {
				if (!inQuot) {
					quotType = ch;
					inQuot = 1;
					continue;
				} else {
					if (ch == quotType) {
						quotType = '';
						inQuot = 0;
						continue;
					}
				}
			}
			if (inQuot) {
				//если имя атрибута совп. с переданным, вернуть содержимое заключенное в кавычки.
				//поз. записать равной позиции символа закрывающей кавычки (или её - 1, не знаю пока)
				//иначе записать pos = i
				r += replaceAttrValue(html, i, obj, attrName, state);
				i = state.pos;
			} else {
				r += ch;
			}
		}
		return r;
	}
	/**
	 * @description отсортировать каждый по убыванию длоины слова
	 * @param {Array} aClasses
	 * @param {Array} aIds
	*/
	function sortByLengthDesc(aClasses, aIds) {
		var i = 0;
		aClasses.sort(_srt);
		aIds.sort(_srt);
	}
	/**
	 * @description sort helpor
	 * @see sortByLengthDesc
	 * @param {String} a
	 * @param {String} b
	*/
	function _srt(a, b) {
		if (a.length > b.length) {
			return 1;
		}
		if (a.length < b.length) {
			return -1;
		}
		return 0;
		
	}
	/**
	 * @description fill arrays names .class and #id
	 * @param {String} css
	 * @param {Array} aClasses
	 * @param {Array} aIds
	*/
	function parseCss(css, aClasses, aIds) {
		var i, inBlock = 0, ch, abc = 'abcdefghijklmnopqrstuvwxyz', s, q,
			j, inName = 0;
		abc += abc.toUpperCase() + '-_0123456789#.';
		s = q = '';
		for (i = 0; i < css.length; i++) {
			ch = css.indexOf(i);
			if (ch == '{') {
				inBlock = 1;
			}
			if (ch == '}') {
				inBlock = 0;
			}
			
			if (!inBlock) {
				if (ch == '.' || ch == '#') {
					inName = 1;
				} else {
					if (!~abc.indexOf(ch)) {
						inName = 0;
					}
				}
				if (inName) {
					s += ch;
				} else {
					if (s.charAt(0) == '.') {
						aClasses.push(s);
					}
					if (s.charAt(0) == '#') {
						aIds.push(s);
					}
					s = '';
				}
			}
		}
	}
	function obfuscate() {
		var i, s, aClasses = [], aIds = [], q = '', oClasses = {}, oIds = {};
		// Собрать все классы и id
		parseCss(inCss.value, aClasses, aIds);
		//отсортировать каждый по убыванию длоины слова
		sortByLengthDesc(aClasses, aIds);
		//
		createMaps(aClasses, aIds, oClasses, oIds, prefix.value, offset.value);//TODO
		// пройти по html и для классов и id в соотв. атрибутах менять содержимое массивов
		s = replace(inHtml.value, oIds, 'id');
		s = replace(s, oClasses, 'class');
		//пройти по css и для классов и id в соотв. атрибутах менять содержимое массивов
		q = replaceCss(inCss.value, aIds, aClasses);
		outCss.value = q;
		outHtml.value = s;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	convertNow.onclick = function() {
		obfuscate();
	}
	
	
	function tpl() {
		var stl = '<style>p input[type=text], textarea{width:99%;} p {padding:0; margin:0;}</style>';
		var tpl = stl + '<p>prefix: <input id="prefix"></p>\
		<p>offset: <input id="offset"></p>\
		<p>Css: </p>\
		<p><textarea id="inCss" rows="5"></textarea></p>\
		<p>Html: </p>\
		<p><textarea id="inHtml" rows="5"></textarea></p>\
		<p>Out Css: </p>\
		<p><textarea id="outCss" rows="5"></textarea></p>\
		<p>Out Html: </p>\
		<p><textarea id="outHtml" rows="5"></textarea></p>\
		<p style="text-align:right"><input type="button" value="Ok" id="convertNow"></p>\
		<p style="text-align:left"><input type="button" value="Menu" id="menu"></p>\
		';
		return tpl;
	}
	
}
