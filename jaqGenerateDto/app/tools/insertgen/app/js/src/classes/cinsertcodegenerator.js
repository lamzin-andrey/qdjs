/**
 * 
*/

function CStorageFieldsEditor() {
	var o = this;
	o.entityFolder = e('entityFolder');
	o.srvFileName = e('srvFileName');
	o.srvMethodName = e('srvMethodName');
	o.defaultType = e('defaultType');
	o.sqlFragmentInput = e('sqlFragmentInput');
	o.tableNameInput = e('tableName');
	this.setListeners();
}
/**
 * @return String
**/
CStorageFieldsEditor.prototype.setListeners = function() {
	var o = this;
	try {
		
		e('bParse').onclick = function(){
			o.onClickParseBtn();
		}
		
	} catch(err) {
		alert(err);
	}
}


CStorageFieldsEditor.prototype.getDoctrineType = function(type) {
	
	switch (type) {
		case 'DateTime':
			return "datetime";
		case 'bool':
			return "boolean";
		default:
			return type;
	}
}

CStorageFieldsEditor.prototype.onClickParseBtn = function() {
	var o = this, 
		names = o.parseFieldNames(o.sqlFragmentInput.value),
		name,
		type = o.defaultType.value, i,
		SZ = sz(names),
		bs,
		fieldsData = o.loadFieldsData(),
		entityFieldsData = o.loadEntityFieldsData();
		
	for (i = 0; i < SZ; i++) {
		name = names[i];
		
		bs = "fieldName" + i;
		fieldsData[bs] = o.toCamelCase(name);
		entityFieldsData[bs] = o.toCamelCase(name);
		bs = "fieldType" + i;
		fieldsData[bs] = type;
		entityFieldsData[bs] = type;
		bs = "fieldDoctrineType" + i;
		fieldsData[bs] = type;
		// alert(name);
		entityFieldsData[bs] = o.getDoctrineType(type);
		bs = "fieldNotNull" + i;
		fieldsData[bs] = 2;
		entityFieldsData[bs] = 2;
	}
	fieldsData["srvFileName"] = AppRecentFolder.get() + "/" + this.srvFileName.value;
	fieldsData["srvMethodName"] = this.srvMethodName.value;
	fieldsData["defaultType"] = this.defaultType.value;
	fieldsData["sqlFragmentInput"] = this.sqlFragmentInput.value;
	fieldsData["tableName"] = this.tableNameInput.value;
	o.saveFieldsData(fieldsData);
	o.saveEntityFieldsData(entityFieldsData);	
}

/**
 * @param {String} s
 * @return Array of string
*/
CStorageFieldsEditor.prototype.parseFieldNames = function(s) {
	
	var a = String(s).split(","), i, SZ = sz(a), item, pair, r = [];
	for (i = 0; i < SZ; i++) {
		item = String(a[i]).trim();
		item = item.replace("`", "");
		item = item.replace("`", "");
		
		if (item.toLowerCase().indexOf(" as ") != -1) {
			pair = item.split(" AS ");
			if (sz(pair) != 2) {
				pair = item.split(" as ");
			}
			item = pair1[1];
		}
		
		if (item.toLowerCase().indexOf(".") != -1) {
			pair = item.split(".");
			item = pair[1];
		}
		
		item = item.trim();
		r.push(this.toCamelCase(item));
	}
	
	return r;
}


/**
 * @description грузим конфиг основного приложения
 * @return Object
*/
CStorageFieldsEditor.prototype.loadFieldsData = function() {
	
	var s = this.getConfigFilePath(), o;
	if (FS.fileExists(s)) {
		s = FS.readfile(s);
		try {
			o = JSON.parse(s);
		} catch(err) {
			o = {};
		}
	}

	return o;
}


/**
 * @description грузим конфиг приложения для сущностей
 * @return Object
*/
CStorageFieldsEditor.prototype.loadEntityFieldsData = function() {
	
	var s = this.getEntityConfigFilePath(), o;
	if (FS.fileExists(s)) {
		s = FS.readfile(s);
		try {
			o = JSON.parse(s);
		} catch(err) {
			o = {};
		}
	}

	return o;
}

CStorageFieldsEditor.getLang = function(def) {
	var c = new CStorageFieldsEditor(),
		d = c.loadFieldsData(),
		lang = d.lang;

	return lang ? lang : def;
}

/**
 * @param {String} data
*/
CStorageFieldsEditor.prototype.saveFieldsData = function(data) {
	var data;
	data = JSON.stringify(data);
	FS.writefile(this.getConfigFilePath(), data);
}

/**
 * @param {String} data
*/
CStorageFieldsEditor.prototype.saveEntityFieldsData = function(data) {
	var data;
	data = JSON.stringify(data);
	FS.writefile(this.getEntityConfigFilePath(), data);
}
/**
 * @return String
*/
CStorageFieldsEditor.prototype.getConfigFilePath = function() {
	return App.dir() + "/../../../config.json";
}

/**
 * @return String
*/
CStorageFieldsEditor.prototype.getEntityConfigFilePath = function() {
	return App.dir() + "/../../../../../jaqGenerateEntity/app/config.json";
}

/**
 * @param {String}
 * @return String
*/
CStorageFieldsEditor.prototype.toCamelCase = function(s) {
	if (~s.indexOf("_")) {
		return TextTransform.snakeToCamel(s);
	}
	
	return s;
}



CStorageFieldsEditor.prototype.setEntityName = function() {
	
}
