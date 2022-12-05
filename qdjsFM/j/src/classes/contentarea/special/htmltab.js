function HtmlTab() {
	this.name = 'HtmlTab';
	MW.setIconImage(App.dir() + '/i/browser32.png');
	this.tpl();
}
HtmlTab.counter = 0;

HtmlTab.prototype.tpl = function() {
	// hide all bottom
	var html = '<iframe width="100%" height="{h}" id="{id}" style="border:none;" src="{s}"></iframe>',
		h = e('contentArea').offsetHeight - e('addressButtonPlacer').offsetHeight - e('tabContentHeadersWr').offsetHeight - e('contentArea').offsetTop - 60,
		id = 'htmlIframe' + HtmlTab.counter,
		s;
	this.iframeId = id;
	HtmlTab.counter++;
	s = str_replace('{h}', (h + 'px'), html);
	s = str_replace('{id}', id, s);
	s = str_replace('{s}', app.tab.currentPath, s);
	e('tabItems').innerHTML = s;
	hide('addressButtonPlacer');
	hide('tabContentHeadersWr');
	app.tab.setStatus(L("Saved Web page"), 0);
}

HtmlTab.prototype.resize = function() {
	h = e('contentArea').offsetHeight - e('addressContainer').offsetHeight - e('tabContentHeadersWr').offsetHeight;
	e(this.iframeId).style.height = h + 'px';
}

HtmlTab.prototype.setEnc = function(enc) {
	var tpl = '<meta charset="' + enc + '">',
			c = FS.readfile(app.tab.currentPath),
			tmpFile = pathinfo(app.tab.currentPath).dirname + '/.tmp.html';
	if (c.indexOf('<head>') != -1) {
		// c = c.replace('<head>', '<head>' + tpl);
		PHP.replaceInFile(app.tab.currentPath, '<head>', '<head>' + tpl, tmpFile);
	} else if (c.indexOf('<HEAD>') != -1) {
		PHP.replaceInFile(app.tab.currentPath, '<HEAD>', '<head>' + tpl, tmpFile);
	}
	e(this.iframeId).src =  tmpFile;
}

