var AppRecentFolder  = {
	init:function() {
		var o = this;
		o.pathInput = e('entityFolder');
		o.pathInput.value = o.getlastDirViewValue(RecentDir.jmp3cutLastDir());
		e('bSwitchEntityFolder').onclick = function() {
			o.onClickLastDirButton();
		}
	},
	getlastDirViewValue:function(s) {
		var a = s.split('/src/');
		if (a.length > 1) {
			return 'src/' + a[1];
		}
		
		return s;
	},
	onClickLastDirButton:function() {
		var s = jqlOpenDirectoryDialog("Выберите каталог с сущностями", ''), o = this;
		o.pathInput.value = o.getlastDirViewValue(s);
	},
	get:function() {
		return RecentDir.jmp3cutLastDir();
	}
};
