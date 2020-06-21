function setLang() {
	var locale = $.trim(PHP.file_get_contents(Qt.appDir() + '/data/locale'));
	window.lang = locale == 'ru' ? window.ru : window.en;
	
}

function __(key) {
	if (window.lang) {
		if (lang[key]) {
			return lang[key];
		}
	}
	return key;
}
