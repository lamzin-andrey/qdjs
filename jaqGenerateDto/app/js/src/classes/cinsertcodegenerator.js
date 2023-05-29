/**
 
*/
function CInsertCodeGenerator() {
}
/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string'
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
 * @return String
**/
CInsertCodeGenerator.prototype.generate = function(fieldsData, dtoName, methodName, path, dtoPath) {
	var o = this;
	
	o.fieldsData = fieldsData;
	o.methodName = methodName;
	o.dtoName = dtoName;
	o.path = path;
	o.dtoPath = dtoPath;
	
	o.loadTemplates();

	o.setNamespace();
	
	o.setUse();
	o.setDtoName();
	o.setSqlFieldsFragment();
	o.setSetters();
	o.setSnakeInsertFields(); 
	o.setSnakeInsertPlaces(); 
	o.setParams();
	o.result = o.insertTpl;
	return o.result;
}


CInsertCodeGenerator.prototype.setParams = function() {
	var o = this;
	o.insertTpl = o.insertTpl.replace('<params_fragment>', o.getParamsText());
}


/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.getParamsText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type;
	paramsList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = o.paramsTpl;
		if (mem.type == "DateTime") {
			s = o.paramsDateTimeTpl;
		}
		
		if (mem.type == "bool") {
			s = o.paramsBoolTpl;
		}
		
		s = s.replace('<snake>', TextTransform.camelToSnake(mem.name));
		s = s.replace('<snake>', TextTransform.camelToSnake(mem.name));
		s = s.replace('<camel>', TextTransform.capitalize(mem.name));
		s = s.replace('<camel>', TextTransform.capitalize(mem.name));
		
		paramsList.push(s);
	}
	
	return paramsList.join("");
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.getSettersText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type, comm;
	o.settersList = [];
	
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = "$item->set<camel>((int)$dbRow['<snake>']);";	
		s = str_replace('<camel>', TextTransform.capitalize(mem.name), s);
		s = str_replace('<snake>', TextTransform.camelToSnake(mem.name), s);
		o.settersList.push(s);
	}
	
	return o.settersList.join("\n");
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.getInsertsText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type, comm;
		inserts = [];
	
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = ",";
		s = str_replace(',', TextTransform.camelToSnake(mem.name), s);
		if (i < sZ - 1) {
			s += ",";
		}
		inserts.push(s);
	}
	
	return inserts.join("\n");
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.getInsertPlacesText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type, comm;
		inserts = [];
	
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = ":<snake>{$i},";
		s = str_replace('<snake>', TextTransform.camelToSnake(mem.name), s);
		s = str_replace(',', '', s);
		if (i < sZ - 1) {
			s += ",";
		}
		inserts.push(s);
	}
	
	return inserts.join("\n");
}

CInsertCodeGenerator.prototype.getDefaultValue = function(type, isNotNull) {
	var o = this,
		isAutonull = o.isAutonull;
	
	if (isNotNull) {
		isAutonull = false;
	}
	
	if (type.indexOf('[]') != -1) {
		return '[]';
	}
	if (isAutonull) {
		return 'null';
	}
	
	if ('string' == type) {
		if (isAutonull) {
			return 'null';
		}
		return "''";
	}
	
	if ('float' == type) {
		if (isAutonull) {
			return 'null';
		}
		return "0.0";
	}
	
	if ('int' == type) {
		if (isAutonull) {
			return 'null';
		}
		return "0";
	}
	
	return 'null';
}

CInsertCodeGenerator.prototype.correctType = function(type, notNull) {
	var isAutonull = this.isAutonull;
	if (notNull) {
		isAutonull = false;
	}
	if ('DateTime' == type) {
		type = 'DateTimeInterface';
	}
	
	if (type.indexOf('[]') != -1 || type == 'array') {
		return 'array';
	}
	
	if (isAutonull && type.indexOf('Dto') == -1) {
		type = '?' + type;
	}
	
	return type;
}


CInsertCodeGenerator.prototype.setSetters = function() {
	var o = this;
	o.insertTpl = o.insertTpl.replace('<setters>', o.getSettersText());
}

CInsertCodeGenerator.prototype.setSnakeInsertFields = function() {
	var o = this;
	o.insertTpl = o.insertTpl.replace("<snake_insert_fields>", o.getInsertsText());
}

CInsertCodeGenerator.prototype.setSnakeInsertPlaces = function() {
	var o = this;
	o.insertTpl = o.insertTpl.replace("<snake_insert_places>", o.getInsertPlacesText());
}

CInsertCodeGenerator.prototype.setDtoName = function() {
	var o = this;
	o.insertTpl = str_replace('<dtoClass>', o.dtoName, o.insertTpl);
	o.insertTpl = str_replace('<className>', o.getClassNameFromPath(o.dtoPath), o.insertTpl);
}
/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.setSqlFieldsFragment = function(fieldsData) {
	var o = this;
	
	o.insertTpl = o.insertTpl.replace("<sqlFieldsFragment>", "");
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CInsertCodeGenerator.prototype.setUse = function() {
	var o = this,
		ns = o.calculateNamespaceFromPath(o.dtoPath);
	o.insertTpl = o.insertTpl.replace("use <dto>", "use " + ns + "\\" + o.dtoName);
}

CInsertCodeGenerator.prototype.isStdType = function(type) {
	var std = {
		'array' : 1,
		'int' : 1,
		'bool' : 1,
		'float' : 1,
		'string' : 1,
		'double' : 1
	};
	if ('undefined' === String(std[type])) {
		return false;
	}
	
	return true;
}


CInsertCodeGenerator.prototype.loadTemplates = function() {
	var o = this;
	o.insertTpl = PHP.file_get_contents(Qt.appDir() + '/data/insert/insert.tpl.php');
	o.paramsTpl = PHP.file_get_contents(Qt.appDir() + '/data/insert/params.tpl.php');
	o.paramsDateTimeTpl = PHP.file_get_contents(Qt.appDir() + '/data/insert/paramsDateTime.tpl.php');
	o.paramsBoolTpl = PHP.file_get_contents(Qt.appDir() + '/data/insert/paramsBool.tpl.php');
}



CInsertCodeGenerator.prototype.setNamespace = function(path) {
	var o = this,
		ns = o.calculateNamespaceFromPath(path);
	o.insertTpl = o.insertTpl.replace('<namespace>', ns);
}

CInsertCodeGenerator.prototype.calculateNamespaceFromPath = function(path) {
	var o = this,
		s, _path,
		a, i, sZ;
	_path = path;
	if (!_path) {
		_path = o.path;
	}
	s = _path.replace('.php', '');
	a = s.split('/src/');
	s = a[1];
	a = s.split('/');
	
	sZ = a.length - 1;
	for (i = 0; i < sZ; i++) {
		a[i] = TextTransform.capitalize(a[i]);
	}
	a.splice(a.length - 1, 1);
	
	return 'App\\' + a.join('\\');
}

CInsertCodeGenerator.prototype.getClassNameFromPath = function(path) {
    var o = this,
		ns = o.calculateNamespaceFromPath(path),
		a = ns.split("\\");
    return a[sz(a) - 1];
}

CInsertCodeGenerator.prototype.foo = function() {}
