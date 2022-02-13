var FieldList = {
	init:function() {
		var o = this;
		o.items = [];
		o.onClickAddField();
		o.bAddList = e('bAddField');
		o.bAddList.onclick = function() {
			o.onClickAddField();
		}
	},
	onClickAddField:function() {
		var o = this, field = new FieldInputs(e('fieldPlacer'), o, o.items.length);
		o.items.push(field);
		setLocale();
	},
	remove:function(index) {
		var o = e('fieldList' + index);
		if (o) {
			try {
				rm(o);
				this.items.splice(index, 1);
			} catch(err) {
				alert(err);
			}
		}
	}
};
