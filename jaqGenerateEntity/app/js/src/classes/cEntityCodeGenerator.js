/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string'
 *      doctrineType: 'string',
 *      name: 'patronymic',
 * 		notNull: true,
 *      isUnsigned: true
 *  }]
*/
function CEntityCodeGenerator(fieldsData, setAutonull, entityName, tableName, path) {
	var o = this;
	o.fieldsData = fieldsData;
	o.isAutonull = setAutonull;
	o.entityName = entityName;
	o.tableName = tableName;
	o.path = path;
	o.result = '<?php';
	o.repositoryCode = '';
	o.cRepositoryCodeGenerator = new CRepositoryCodeGenerator();
	
}
/**
 * @return String
**/
CEntityCodeGenerator.prototype.generate = function() {
	var o = this;
	o.loadTemplates();
	o.setNamespace();
	o.setTableName();
	o.setRepository();
	o.setEntityName();
	o.setMembers();
	o.setGettersAndSetters();
	
	o.result = o.entityTpl;
	return o.result;
}


CEntityCodeGenerator.prototype.setGettersAndSetters = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<getsetters>', o.getMethodsText());
}


/**
 * @param {Array} fieldsData
 *  [{
 * 		type: 'string'
 *      doctrineType: 'varchar',
 *      name: 'patronymic',
 * 		notNull: true,
 *      isUnsigned: true
 *  }]
*/
CEntityCodeGenerator.prototype.getMethodsText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type;
	o.methodsList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = o.methodsTpl;
		s = s.replace('<Name>', TextTransform.capitalize(mem.name));
		s = s.replace('<Name>', TextTransform.capitalize(mem.name));
		
		type = o.correctType(mem.type);
		if (o.isAutonull) {
			type = '?' + type;
		}
		s = s.replace('<type>', type);
		s = s.replace('<type>', type);
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
 * 		type: 'string'
 *      doctrineType: 'varchar',
 *      name: 'patronymic',
 * 		notNull: true,
 *      isUnsigned: true
 *  }]
*/
CEntityCodeGenerator.prototype.getMembersText = function() {
	var o = this, i, sZ = o.fieldsData.length, s, mem, type;
	o.membersList = [];
	for (i = 0; i < sZ; i++) {
		mem = o.fieldsData[i];
		s = o.memberTpl;
		s = s.replace('<doctrinename>', TextTransform.camelToSnake(mem.name));
		
		s = s.replace('<doctrinetype>', mem.doctrineType);
		s = s.replace('<length>', o.generateAnnotationLength(mem.doctrineType));
		s = s.replace('<nullable>', o.generateAnnotationNullable(mem.notNull));
		s = s.replace('<options>', o.generateAnnotationOptions(mem.notNull, mem.isUnsigned));
		
		type = o.correctType(mem.type);
		if (o.isAutonull) {
			type = '?' + type;
		}
		s = s.replace('<type>', type);
		s = s.replace('<name>', mem.name);
		s = s.replace('<defValue>', o.getDefaultValue(mem.type));
		o.membersList.push(s);
	}
	
	return o.membersList.join("\n");
}


CEntityCodeGenerator.prototype.getDefaultValue = function(type) {
	var o = this;
	if (type.indexOf('[]') != -1) {
		return '[]';
	}
	if (o.isAutonull) {
		return 'null';
	}
	
	if ('string' == type) {
		if (o.isAutonull) {
			return 'null';
		}
		return "''";
	}
	
	return 'null';
}

CEntityCodeGenerator.prototype.correctType = function(type) {
	if ('DateTime' == type) {
		return 'DateTimeInterface';
	}
	
	if (type.indexOf('[]') != -1) {
		return 'array';
	}
	
	return type;
}

CEntityCodeGenerator.prototype.generateAnnotationOptions = function(notNull, isUnsigned) {
	var aOpts = [], o = this, i;
	if (!notNull) {
		aOpts.push('"default"=NULL');
	}
	
	if (isUnsigned) {
		aOpts.push('"unsigned"=true');
	}
	
	if (aOpts.length > 0) {
		return ', options={' + aOpts.join(', ') + '}';
	}
	
	return '';
}

CEntityCodeGenerator.prototype.generateAnnotationNullable = function(notNull) {
	if (!notNull) {
		return ', nullable=true';
	}
	
	return ', nullable=false';
}

CEntityCodeGenerator.prototype.generateAnnotationLength = function(type) {
	if ('string' == type || 'varchar' == type) {
		return ', length=255';
	}
	
	if ('text' == type) {
		return ', length=65535';
	}
	
	return '';
}

CEntityCodeGenerator.prototype.setMembers = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<members>', o.getMembersText());
}

CEntityCodeGenerator.prototype.setEntityName = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<EntityName>', o.entityName);
}

CEntityCodeGenerator.prototype.setTableName = function() {
	var o = this;
	o.entityTpl = o.entityTpl.replace('<table_name>', o.tableName);
}

CEntityCodeGenerator.prototype.loadTemplates = function() {
	var o = this;
	o.entityTpl = PHP.file_get_contents(Qt.appDir() + '/data/entity.tpl.php');
	o.memberTpl = PHP.file_get_contents(Qt.appDir() + '/data/member.tpl.php');
	o.methodsTpl = PHP.file_get_contents(Qt.appDir() + '/data/getset.tpl.php');
}

CEntityCodeGenerator.prototype.setRepository = function() {
	var o = this,
		nsEntity = o.calculateNamespaceFromPath(),
		nsRepository;
	nsRepository = nsEntity.replace('Entity', 'Repository') + '\\' + o.entityName + 'Repository';
	o.entityTpl = o.entityTpl.replace('<repository>', nsRepository);
	o.cRepositoryCodeGenerator.setPath(o.path);
	o.cRepositoryCodeGenerator.setEntityNamespace(nsEntity);
	o.cRepositoryCodeGenerator.setRepositoryNamespace(nsRepository);
	o.cRepositoryCodeGenerator.setEntityName(o.entityName);
	o.repositoryCode = o.cRepositoryCodeGenerator.generate();
}

CEntityCodeGenerator.prototype.getRepositoryFileName = function() {
	return this.cRepositoryCodeGenerator.getRepositoryFileName();
}

CEntityCodeGenerator.prototype.getRepositoryCode = function() {
	return this.repositoryCode;
}

CEntityCodeGenerator.prototype.setNamespace = function() {
	var o = this,
		ns = o.calculateNamespaceFromPath();
	o.entityTpl = o.entityTpl.replace('<namespace>', ns);
}

CEntityCodeGenerator.prototype.calculateNamespaceFromPath = function() {
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

CEntityCodeGenerator.prototype.foo = function() {}
