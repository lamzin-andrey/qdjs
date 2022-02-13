function CRepositoryCodeGenerator() {}
CRepositoryCodeGenerator.prototype.generate = function() {
	var o = this;
	o.code = '<?php';
	o.loadTemplates();
	o.generateNs();
	o.generateFullClassName();
	o.generateShortClassName();
	o.calculateFileName();
	
	return o.code;
}
CRepositoryCodeGenerator.prototype.calculateFileName = function() {
	var o = this;
	o.fileName = o.path;
	o.fileName = o.fileName.replace('Entity', 'Repository');
	o.fileName = o.fileName.replace('.php', 'Repository.php');
}
CRepositoryCodeGenerator.prototype.generateShortClassName = function() {
	var o = this,
		re = new RegExp('<className>', 'gim');
	o.code = o.code.replace(re, o.entityName);
}
CRepositoryCodeGenerator.prototype.generateFullClassName = function() {
	var o = this, 
	s = o.entityNamespace + '\\' + o.entityName;
	o.code = o.code.replace('<fullClassName>', s);
}
CRepositoryCodeGenerator.prototype.generateNs = function() {
	var o = this;
	o.code = o.code.replace('<namespace>', o.repositoryNamespace);
}
CRepositoryCodeGenerator.prototype.loadTemplates = function() {
	var o = this;
	o.code = PHP.file_get_contents(Qt.appDir() + '/data/repository.tpl.php');
}

CRepositoryCodeGenerator.prototype.setEntityName = function(s) {
	this.entityName = s;
}
CRepositoryCodeGenerator.prototype.setRepositoryNamespace = function(s) {
	this.repositoryNamespace = s;
}
CRepositoryCodeGenerator.prototype.setEntityNamespace = function(s) {
	this.entityNamespace = s;
}
CRepositoryCodeGenerator.prototype.setPath = function(s) {
	this.path = s;
}
CRepositoryCodeGenerator.prototype.getRepositoryFileName = function() {
	return this.fileName;
}


