var DTOCodeGenerator = {
	init:function() {
		var o = this;
		o.bGenerate = e('bGenerate');
		o.bGenerate.onclick = function() {
			try {
				o.onClickGenerate();
			} catch(err) {
				alert("9 * " + err);
			}
		}
	},
	
	onClickGenerate:function() {
		var o = this,
			fileName = o.getOutputFilename(),
			entityCodeGenerator = new CDtoCodeGenerator( // TODO 
				o.getFieldsData(),
				o.getAutonullValue(),
				o.getJsonValue(),
				o.getEntityName(),
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
		o.generateInsertCode();
	},

	getEntityName:function(){
		return e('className').value;
	},
	getAutonullValue:function() {
		return e('bAutonull').checked;
	},
	getJsonValue:function() {
		return e('bJson').checked;
	},
	getFieldsData:function() {
		var sZ = FieldList.items.length, co, r = [], i;
		for (i = 0; i < sZ; i++) {
			co = {
				'type': FieldList.items[i].fieldType.value,
				'name': FieldList.items[i].fieldName.value,
				'notNull': FieldList.items[i].fieldNotNull.checked
			};
			r.push(co);
		}
		
		return r;
	},
	getOutputFilename:function() {
		var s = AppRecentFolder.get() + '/' + this.getEntityName() + '.php';
		return s;
	},
	/**
	 * TODO если установлена галка "Генерировать INSERT код"
	*/
	generateInsertCode:function() {
		var insertCodeGenerator = new CInsertCodeGenerator(),
			o = this, code, outputFile;
		if (e("bInsert").checked === false) {
			return;
		}
		outputFile = Settings.get("srvFileName");
		code = insertCodeGenerator.generate(
			o.getFieldsData(),
			o.getEntityName(),
			Settings.get("srvMethodName"),
			outputFile,
			o.getOutputFilename()
		);
		if (FS.fileExists(outputFile)) {
			if (confirm('Are you sure overwrite file ' + outputFile)) {
				FS.writefile(outputFile, code);
			}
		} else {
			FS.writefile(outputFile, code);
		}
	}
};
/*function EntityCodeGenerator() {
}
EntityCodeGenerator.prototype.foo = function() {}*/
