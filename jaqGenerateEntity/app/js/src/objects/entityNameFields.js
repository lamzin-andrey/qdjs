var EntityNameFields = {
	init:function(){
		var o = this;
		o.inputPrefix = e('tablePrefix');
		o.inputSuffix = e('tableSuffix');
		o.inputEntityName = e('entityName');
		o.inputPrefix.onkeydown = function() {
			setTimeout(function() {
				o.onInputPrefix();
			}, 100);
		}
		o.inputSuffix.onkeyup = function() {
			setTimeout(function() {
				o.onInputSuffix();
			}, 100);
			
		}
		o.inputEntityName.onkeyup = function() {
			setTimeout(function() {
				o.onInputEntityName();
			}, 100);
		}
		o.inputPrefix.value = Settings.get('tablePrefix', '');
		o.inputSuffix.value = Settings.get('tableSuffix', '');
		o.inputEntityName.value = Settings.get('entityName', '');
	},
	onInputPrefix:function(){
		var o = this;
		try {
			Settings.set('tablePrefix', o.inputPrefix.value);
		} catch (err) {
			alert(err);
		}
	},
	onInputSuffix:function(){
		var o = this;
		Settings.set('tableSuffix', o.inputSuffix.value);
		var entityName = Settings.get('entityName', '');
		if (!entityName) {
			try {
				o.inputEntityName.value = TextTransform.snakeToCamel(o.inputSuffix.value, true); // TODO
			} catch(err) {
				alert(err);
			}	
		}
	},
	onInputEntityName:function(){
		var o = this;
		Settings.set('entityName', o.inputEntityName.value);
	}
}
