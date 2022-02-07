var ClassNameField = {
	init:function(){
		var o = this;
		o.inputEntityName = e('className');
		o.inputEntityName.onkeyup = function() {
			setTimeout(function() {
				o.onInputEntityName();
			}, 100);
		}
		o.inputEntityName.value = Settings.get('className', '');
	},
	
	onInputEntityName:function(){
		var o = this;
		Settings.set('className', o.inputEntityName.value);
	}
}
