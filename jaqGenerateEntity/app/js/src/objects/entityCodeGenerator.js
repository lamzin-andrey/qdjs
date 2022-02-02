var EntityCodeGenerator = {
	init:function() {
		var o = this;
		o.bGenerate = e('bGenerate');
		o.bGenerate.onclick = function() {
			try {
				o.onClickGenerate();
			} catch(err) {
				alert(err);
			}
		}
	},
	
	onClickGenerate:function() {
		var o = this,
			fileName = o.getOutputFilename(),
			entityCodeGenerator = new CEntityCodeGenerator( // TODO 
				o.getFieldsData(),
				o.getAutonullValue(),
				o.getEntityName(),
				o.getTableName(),
				fileName
			), 
			s = entityCodeGenerator.generate();
		if (PHP.file_exists(fileName)) {
			if (confirm('Are you sure overwrite file ' + fileName)) {
				PHP.file_put_contents(fileName, s);
			}
		} else {
			PHP.file_put_contents(fileName, s);
		}
	},
	getTableName:function(){
		return e('tablePrefix').value + '_' + e('tableSuffix').value;
	},
	getEntityName:function(){
		return e('entityName').value;
	},
	getAutonullValue:function() {
		return e('bAutonull').checked;
	},
	getFieldsData:function() {
		var sZ = FieldList.items.length, co, r = [], i;
		for (i = 0; i < sZ; i++) {
			co = {
				'type': FieldList.items[i].fieldType.value,
				'doctrineType': FieldList.items[i].fieldDoctrineType.value,
				'name': FieldList.items[i].fieldName.value,
				'notNull': FieldList.items[i].fieldNotNull.checked,
				'isUnsigned': FieldList.items[i].fieldUnsigned.checked
			};
			r.push(co);
		}
		
		return r;
	},
	getOutputFilename:function() {
		var s = AppRecentFolder.get() + '/' + this.getEntityName() + '.php';
		return s;
	}
};
/*function EntityCodeGenerator() {
}
EntityCodeGenerator.prototype.foo = function() {}*/
