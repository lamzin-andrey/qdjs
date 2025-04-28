//window.jaqedLang = window.jaqedLang || {};
function L(s) {
	//alert(JSON.stringify(window.jaqedLang));
	if (window.jaqedLang && jaqedLang[s]) {
		return jaqedLang[s];
	}
	return s;
}
