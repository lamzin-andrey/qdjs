function CStyleTranslator() {}
CStyleTranslator.prototype.init = function() {
	var o, savedPath;
	o = this;
	o.hPath = e('hPath');
	o.browse = e('Browse');
	o.bStart = e('bStart');
	o.browse.onclick = function(){
		o.onBrowse();
	}
	o.bStart.onclick = function(){
		o.onClickStart();
	}
	savedPath = storage("savedPath");
	if (savedPath && FS.fileExists(savedPath)) {
		v('hPath', savedPath);
	}
	o.sourceListCreator = new CSourceListCreator();
	o.translator = new CStyleCodeTranslator();
}
CStyleTranslator.prototype.onBrowse = function() {
	var s;
	s = jqlOpenDirectoryDialog(L('Select catalog'));
	if (s) {
		storage('savedPath', s);
		v('hPath', s);
	}
}

CStyleTranslator.prototype.onClickStart = function() {
	var savedPath, o, ls, i, z;
	o = this;
	savedPath = storage("savedPath");
	if (!savedPath || !FS.fileExists(savedPath)) {
		alert(L("Catalog Not Found"));
		return;
	}
	ls = o.sourceListCreator.getFilesList(savedPath);
	z = sz(ls);
	for (i = 0; i < z; i++) {
		try {
			o.translator.process(savedPath, ls[i]);
		} catch (err) {
			alert(err);
		}
	}
	alert(L("Done!"));
}


