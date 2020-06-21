window.Menu = {
	show:function() {
		var tpl = '<a href="#CssObfuscate">CssObfuscate</a> <a href="#Camel2Snake">CamelSnake</a> <a href="#Abc">Abc</a>';
		$('#console').html(tpl);
		$('a').click(this.onHrefClick);
	},
	onHrefClick:function(evt) {
		evt.preventDefault();
		var key = evt.target.getAttribute('href').replace('#', '');
		if (window[key] instanceof Function) {
			window[key]();
		}
		return false;
	}
};
