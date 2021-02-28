window.jaqedLang = window.jaqedLang || {};
function L(s) {
	if (jaqedLang && jaqedLang[s]) {
		return jaqedLang[s];
	}
	return s;
}

window.addEventListener('load', setLocale, false);

function setLocale() {
	var ls = ee(document, 'legend'), i, sZ = sz(ls);
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
		if (ls[i].id && ls[i].type == 'button') {
			ls[i].value = L(ls[i].id);
		}
	}
}
