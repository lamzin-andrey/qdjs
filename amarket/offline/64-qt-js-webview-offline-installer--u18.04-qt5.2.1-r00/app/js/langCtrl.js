function setLang() {
	window.lang = e('ru').checked ? window.ru : window.en;
	window.langName = e('ru').checked ? 'ru' : 'en';
	hide('langArea');
	show('extractPBar');
	Extractor.init();
	Extractor.extract();
}

function __(key) {
	if (window.lang) {
		if (lang[key]) {
			return lang[key];
		}
	}
	return key;
}
