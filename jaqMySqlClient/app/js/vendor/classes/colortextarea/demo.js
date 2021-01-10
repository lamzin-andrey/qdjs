window.addEventListener('load', onLoad);
function onLoad() {
	var sqlColorTextRules = new ColorRuleSql();
	window.colorTa = new ColorTextArea('demo', sqlColorTextRules);
}
