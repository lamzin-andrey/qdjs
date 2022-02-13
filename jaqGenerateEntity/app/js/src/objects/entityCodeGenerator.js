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
			entityCodeGenerator = new CEntityCodeGenerator(
				o.getFieldsData(),
				o.getAutonullValue(),
				o.getEntityName(),
				o.getTableName(),
				fileName
			), 
			s = entityCodeGenerator.generate(),
			repositoryCode = entityCodeGenerator.getRepositoryCode(),
			repositoryFileName = entityCodeGenerator.getRepositoryFileName(),
			overwriteFiles = {},
			aOverwriteFiles = [],
			confirmLegend = 'Are you sure overwrite file ', i;

		if (PHP.file_exists(fileName)) {
			overwriteFiles[fileName] = s;
			aOverwriteFiles.push(fileName);
		}
		if (PHP.file_exists(repositoryFileName)) {
			overwriteFiles[repositoryFileName] = repositoryCode;
			aOverwriteFiles.push(repositoryFileName);
		}
		if (aOverwriteFiles.length > 1) {
			confirmLegend = 'Are you sure overwrite files: \n';
		}
		
		if (aOverwriteFiles.length > 0) {
			if (confirm(confirmLegend + aOverwriteFiles.join('\n'))) {
				for (i in overwriteFiles) {
					PHP.file_put_contents(i, overwriteFiles[i]);
				}
			}
		}
		if (!PHP.file_exists(fileName)) {
			PHP.file_put_contents(fileName, s);
		}
		
		if (!PHP.file_exists(repositoryFileName)) {
			PHP.file_put_contents(repositoryFileName, repositoryCode);
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
