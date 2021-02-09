window.addEventListener('load', onLoad);
function onLoad() {
	var sqlColorTextRules = new ColorRuleSql();
	window.colorTa = new ColorTextArea('demo', sqlColorTextRules);
	
	/*window.ival = setInterval(function(){
		window.colorTa.emulateOnScroll();
	}, 1000);*/
	
	// тут просто добавил рамку, обычно это не нужно
	setTimeout(function(){
		addClass(window.colorTa.mirror, 'dbgb');
	}, 500);
	
	
	
}
