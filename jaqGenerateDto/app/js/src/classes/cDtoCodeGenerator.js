/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string'
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
function CDtoCodeGenerator(fieldsData, setAutonull, setJson, entityName, path) {
	var o = this;
	o.fieldsData = fieldsData;
	o.isAutonull = setAutonull;
	o.setJSON = setJson;
	o.entityName = entityName;
	o.path = path;
	o.result = '<?php';
	
}
/**
 * @return String
**/
CDtoCodeGenerator.prototype.generate = function() {
	var o = this;
	o.loadTemplates();
	o.setNamespace();
	o.setUse();
	o.setJson();
	o.setEntityName();
	o.setConstruct();
	o.setMembers();
	o.setGettersAndSetters();
	
	o.result = o.entityTpl;
	return o.result;
}


CDtoCodeGenerator.prototype.setGettersAndSetters = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<getset>', o.getMethodsText());
}


/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CDtoCodeGenerator.prototype.getMethodsText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type;
	o.methodsList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = o.methodsTpl;
		
		if (mem.type.indexOf('[]') != -1) {
			s = s.replace('<atype>', mem.type);
			s = s.replace('<atype>', mem.type);
		} else {
			comm = '/**\n\
     * @return <atype>\n\
     */\n    ';
			s = s.replace(comm, '');
			comm = '\n/**\n\
     * @param <atype> $<name>\n\
     */\n    ';
			s = s.replace(comm, '\n    ');
			comm = '/**\n\
     * @param <atype> $<name>\n\
     */\n    ';
			s = s.replace(comm, '\n    ');
		}
		
		s = s.replace('<Name>', TextTransform.capitalize(mem.name));
		s = s.replace('<Name>', TextTransform.capitalize(mem.name));
		
		type = o.correctType(mem.type, mem.notNull);
		s = s.replace('<type>', type);
		s = s.replace('<type>', type);
		s = s.replace('<name>', mem.name);
		s = s.replace('<name>', mem.name);
		s = s.replace('<name>', mem.name);
		s = s.replace('<name>', mem.name);
		s = s.replace('<name>', mem.name);
		o.methodsList.push(s);
	}
	
	return o.methodsList.join("\n");
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CDtoCodeGenerator.prototype.getMembersText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type, comm;
	o.membersList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = o.memberTpl;
		type = o.correctType(mem.type, mem.notNull);
		if (type.indexOf('?') !== 0 && type != 'array') {
			s = s.replace(' = <defValue>', '');
		}
		
		s = s.replace('<type>', type);
		s = s.replace('<name>', mem.name);
		s = s.replace('<defValue>', o.getDefaultValue(mem.type, mem.notNull));
		
		if (mem.type.indexOf('[]') != -1) {
			s = s.replace('<atype>', mem.type);
		} else {
			comm = '\n    /**\n\
     * @var <atype>\n\
     */\n    ';
			s = s.replace(comm, '    ');
		}

		o.membersList.push(s);
	}
	
	return o.membersList.join("");
}


CDtoCodeGenerator.prototype.getDefaultValue = function(type, isNotNull) {
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

CDtoCodeGenerator.prototype.correctType = function(type, notNull) {
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


CDtoCodeGenerator.prototype.setMembers = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<members>', o.getMembersText());
}

CDtoCodeGenerator.prototype.setEntityName = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<className>', o.entityName);
}
/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CDtoCodeGenerator.prototype.setConstruct = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type,
		tab2 = '        ', tab1 = '    ',
		annotationTypes = [], sAnnotation = '';
	o.argumentList = [];
	o.applyList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		if (~mem.type.indexOf('DateTime')) {
			continue;
		}
		type = o.correctType(mem.type, mem.notNull);
		
		if (~mem.type.indexOf('Dto')) {
			annotationTypes.push(tab1 + ' * @param ' + mem.type + ' $' + mem.name);
		}
		
		o.argumentList.push(type + ' $' + mem.name);
		o.applyList.push(tab2 + '$this->' + mem.name + ' = $' + mem.name + ';');
	}
	s = o.constructTpl.replace('<arguments>', o.argumentList.join(', '));
	s = s.replace('<apply>', o.applyList.join('\n'));
	
	if (annotationTypes.length > 0) {
		sAnnotation = tab1 + '/**\n' + annotationTypes.join('\n') + '\n' + tab1 + ' */\n' + tab1;
	}
	
	o.entityTpl = o.entityTpl.replace('<construct>', s);
	o.entityTpl = o.entityTpl.replace('<cannotation>', sAnnotation);
}

/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string',
 *      name: 'patronymic',
 * 		notNull: true
 *  }]
*/
CDtoCodeGenerator.prototype.setUse = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type,
		tab2 = '        ';
	o.useList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		if (o.isStdType(mem.type)) {
			continue;
		}
		
		o.useList.push('use ' + mem.type.replace('[]', '') + '; // TODO!');
	}
	
	o.entityTpl = o.entityTpl.replace('<use>', o.useList.join('\n'));
}

CDtoCodeGenerator.prototype.isStdType = function(type) {
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

CDtoCodeGenerator.prototype.setJson = function() {
	var o = this;
	if (o.setJSON) {
		o.entityTpl = o.entityTpl.replace('<JSON>', 'use JsonSerializable;');
		o.entityTpl = o.entityTpl.replace('<implJson>', ' implements JsonSerializable');
	} else {
		o.entityTpl = o.entityTpl.replace('<JSON>', '');
		o.entityTpl = o.entityTpl.replace('<implJson>', '');
	}
	
}

CDtoCodeGenerator.prototype.loadTemplates = function() {
	var o = this;
	o.entityTpl = PHP.file_get_contents(Qt.appDir() + '/data/entity.tpl.php');
	o.memberTpl = PHP.file_get_contents(Qt.appDir() + '/data/member.tpl.php');
	o.methodsTpl = PHP.file_get_contents(Qt.appDir() + '/data/getset.tpl.php');
	o.constructTpl = PHP.file_get_contents(Qt.appDir() + '/data/construct.tpl.php');
}



CDtoCodeGenerator.prototype.setNamespace = function() {
	var o = this,
		ns = o.calculateNamespaceFromPath();
	o.entityTpl = o.entityTpl.replace('<namespace>', ns);
}

CDtoCodeGenerator.prototype.calculateNamespaceFromPath = function() {
	var o = this,
		s = o.path.replace('.php', ''),
		a = s.split('/src/'), i, sZ;
	s = a[1];
	a = s.split('/');
	sZ = a.length - 1;
	for (i = 0; i < sZ; i++) {
		a[i] = TextTransform.capitalize(a[i]);
	}
	a.splice(a.length - 1, 1);
	
	return 'App\\' + a.join('\\');
}

CDtoCodeGenerator.prototype.foo = function() {}
