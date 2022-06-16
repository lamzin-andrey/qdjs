window.jaqedLang = window.jaqedLang || {};
function L(s) {
	if (jaqedLang && jaqedLang[s]) {
		return jaqedLang[s];
	}
	return s;
}

window.addEventListener('load', setLocale, false);

function setLocale() {
	var ls = ee(document, 'legend'), i, sZ = sz(ls),
		textById;
	for (i = 0; i < sZ; i++) {
		if (ls[i].id) {
			ls[i].innerHTML = L(ls[i].id);
		}
	}
	
	ls = ee(document, 'label');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].id) {
			ls[i].innerHTML = L(ls[i].id);
		}
	}
	
	/*ls = ee(document, 'div');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].hasAttribute('id')) {
			ls[i].innerHTML = L(ls[i].id);
		}
	}*/
	
	ls = ee(document, 'input');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].type == 'button') {
			textById = L(ls[i].id);
			if (textById) {
				ls[i].value = textById;
			} else {
				textById = parseClassForButtonId(attr(ls[i], 'class'));
				ls[i].value = L(textById);
			}
		}
	}
}


function parseClassForButtonId(s) {
	var a = s.split(/\b/), i, w, ch;
	for (i = 0; i < a.length; i++) {
		w = a[i];
		if (w) {
			if (w[0] == 'b') {
				ch = w[1];
				if (ch === ch.toUpperCase()) {
					return w;
				}
			}
		}
	}
	return '';
}
