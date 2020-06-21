/**
 * Инструмент для поиска всех namespace содержащих имя PHP класса или "Пока PHPStorm грузится..."
*/
function NamespacesTool(settingsObject) {
	this.settingsObject = settingsObject;
	/** @property {String} dir  каталог, в котором лежит файл, открытый в редакторе (при запуске утилиты из geany передается как %d) */
	this.dir = Qt.getArgs()[0];
	/** @property {String} composerDir каталог с composer.json */
	this.composerDir = 0;
	/** @property {String} sCacheFile файл с кэшем */
	this.sCacheFile = Qt.appDir() + '/data/phpnssearch.cache';
	/** @property {String} shellFile файл в который будет записсываться команда для запуска */
	this.shellFile = Qt.appDir() + '/data/phpnscmd.sh';
	
	this.setListeners();
}
/**
 * @description Установка слушателей событий
*/
NamespacesTool.prototype.setListeners = function() {
	this.iPhpClassName = $('#iPhpClassName');
	this.sNamespaces = $('#sNamespaces');
	this.iPhpNamespaceResult = $('#iPhpNamespaceResult');
	this.hNsError = $('#hNsError');
	
	var o = this;
	this.iPhpClassName.on('keydown', function(ev) { o.onKeyDown(ev); });
	this.iPhpClassName.click(function(ev) { o.onClickPhpClassNameInput(ev); });
	this.iPhpNamespaceResult.click(function(ev) { o.onClickResultInput(this); });
	this.sNamespaces.on('keydown', function(ev) { o.onKeyDownListSpaces(ev); });
}
/**
 * @description Поиск неймспейсов в каталоге расположенного выше this.dir и содержащего composer.json
 * @param {String} sClassName
*/
NamespacesTool.prototype.searchNamespaces = function(s) {
	this.calculateRootDir();
	var aList = this.loadListFromCache(s);
	this.setArrInDisplayList(aList);
	if (!this.composerDir) {
		return;
	}
	this.runFindCommand(s);
	
}
/**
 * @description Ищет файл composer.json в каталоге с акетивном файле и в тех каталогах, в которые он вложен
 *  Каталог содержащий composer.json считается корнем проекта
*/
NamespacesTool.prototype.calculateRootDir = function() {
	if (this.composerDir) {
		return;
	}
	var	currentDir = this.dir, file, a;
	while (currentDir != '') {
		file = currentDir + '/composer.json';
		if (PHP.file_exists(file)) {
			this.composerDir = currentDir;
			break;
		}
		a = currentDir.split('/');
		a.splice(a.length - 1, 1);
		currentDir = a.join('/');
	}
	if (!this.composerDir) {
		this.showError('Не найден composer.json');
	}
}
/**
 * @description Загрузить данные 
 * @param {String} sClassName
 * @return Array
*/
NamespacesTool.prototype.loadListFromCache = function(sClassName) {
	try {
		var o = JSON.parse( PHP.file_get_contents(this.sCacheFile) );
		if (o[sClassName]) {
			return o[sClassName];
		}
	} catch(e) {;};
	return [];
}
/**
 * @description Запускает 'find ' + this.currentDir + '/vendor' -name s + '.php'
 *   и для src то же самое
 * @param {String} sClassName
*/
NamespacesTool.prototype.runFindCommand = function(sClassName) {
	/** @property {Number} countSubdir количество поддиректорий, поиск в которых завершён */
	this.countSubdir = 0;
	this.output = [];
	
	var cmdTpl = 'find ' + this.composerDir + '/{subdir} -name ' + sClassName + '.php',
		cmd = cmdTpl.replace('{subdir}', 'vendor');
	this.sClassName = sClassName;
	window.namespaceToolSocket = this;
	//PHP.file_put_contents(this.shellFile, cmd);
	PHP.exec(cmd, 'namespaceToolOnStopFindVendor', 'namespaceToolNull', 'namespaceToolNull');
	cmd = cmdTpl.replace('{subdir}', 'src');
	//PHP.file_put_contents(this.shellFile, cmd);
	PHP.exec(cmd, 'namespaceToolOnStopFindSrc', 'namespaceToolNull', 'namespaceToolNull');
}
/**
 * @description Обработка результатов запуска команды find
 * @param {String} stdout
 * @param {String} stderr
 * @param {String} sType определяет, поиск в каком каталоге был завершен
*/

NamespacesTool.prototype.onResult = function(stdout, stderr, sType) {
	this.countSubdir++;
	var a = stdout.split('\n'), i, s, o = {};
	
	for (i = 0; i < a.length; i++) {
		s = String(a[i]).trim();
		if (s.length) {
			this.output.push(a[i]);
		}
	}
	if (this.countSubdir == 2) {
		if (PHP.file_exists(this.sCacheFile)) {
			try {
				o = JSON.parse( PHP.file_get_contents(this.sCacheFile) );
				o = o ? o : {};
			} catch(e) {;};
		}
		o[this.sClassName] = this.extractNsFromOutput();
		PHP.file_put_contents(this.sCacheFile, JSON.stringify(o));
		this.setArrInDisplayList(o[this.sClassName]);
	}
}
/**
 * @description 
 * @return Array
*/
NamespacesTool.prototype.extractNsFromOutput = function() {
	var r = [], i, file, s, start, end, a = this.output;
	for (i = 0; i < a.length; i++) {
		file = a[i];
		if (PHP.file_exists(file)) {
			s = PHP.file_get_contents(file);
			start = s.indexOf('namespace');
			end = s.indexOf(';', start);
			s = s.substring(start, end).replace('namespace', '').trim();
			r.push( s );
		}
	}
	return r;
}
/**
 * @description Установить список неёмспейсов и установить для элементов списка обработчик onclick
 * @param {Array} a Список неймспейсов
*/
NamespacesTool.prototype.setArrInDisplayList = function(a) {
	this.sNamespaces[0].options.length = 0;
	var i, opt, o = this;
	for (i = 0; i < a.length; i++) {
		opt = $('<option>' + a[i] + '</option>');
		opt.click( function(evt){ o.onClickOption(this); } );
		this.sNamespaces.append(opt);
	}
}
/**
 * @description Обработка клика на элемента списка
 * @param {HtmlOptionElement} option элемент списка
*/
NamespacesTool.prototype.onClickOption = function(option) {
	this.iPhpNamespaceResult.val( 'use ' + $(option).text().trim()  + '\\' + this.sClassName + ';');
}
/**
 * @description Обработка результатов запуска команды find
 * @param {String} stdout
 * @param {String} stderr
*/
function namespaceToolOnStopFindVendor(stdout, stderr) {
	window.namespaceToolSocket.onResult(stdout, stderr, 'vendor');
}
/**
 * @description Обработка результатов запуска команды src
 * @param {String} stdout
 * @param {String} stderr
*/
function namespaceToolOnStopFindSrc(stdout, stderr) {
	window.namespaceToolSocket.onResult(stdout, stderr, 'src');
}
/**
 * @description Показать сообщение об ошибке
 * @param {String} s
*/
NamespacesTool.prototype.showError = function(s) {
	this.hNsError.text(s);
	this.hNsError.css('display', 'block');
}
/**
 * @description Скрыть сообщение об ошибке
 * @param {String} s
*/
NamespacesTool.prototype.hideError = function() {
	this.hNsError.css('display', 'none');
}
/**
 * @description Событие клик на инпуте результата
*/
NamespacesTool.prototype.onClickResultInput = function(input) {
	input.select();
}
/**
 * @description Событие По нажатию на кнопку списка найденных namespaces
*/
NamespacesTool.prototype.onKeyDownListSpaces = function(evt) {
	if (evt.keyCode == 40 || evt.keyCode == 38) {
		var o = this;
		setTimeout(function() {
			var n = o.getSelectedIndex();
			var opt = o.sNamespaces[0].options[n];
			if (opt) {
				o.onClickOption(opt);
			}
		}, 100);
	}
}
/**
 * @description Patch для HtmlElementSelect.selectedIndex
 * @return Number
*/
NamespacesTool.prototype.getSelectedIndex = function() {
	var opts = this.sNamespaces[0].options, i;
	for (i = 0; i < opts.length; i++) {
		if (opts[i].selected) {
			return i;
		}
	}
	return -1;
}
/**
 * @description Событие По нажатию на кнопку в поле ввода имени класса
*/
NamespacesTool.prototype.onKeyDown = function(evt) {
	if (evt.keyCode == 13) {
		this.hideError();
		this.searchNamespaces(this.iPhpClassName.val());
	}
	if (evt.keyCode == 40) {
		this.sNamespaces[0].focus();
		var first = this.sNamespaces[0].options[0];
		if (first) {
			first.selected = true;
			this.onClickOption(first);
		}
	}
	return true;
}
/**
 * @description Событие По клику на поле ввода имени класса. Запомнить, что на нём был клик.
*/
NamespacesTool.prototype.onClickPhpClassNameInput = function(evt) {
	this.settingsObject.storage('lastClickedFile', evt.currentTarget.id);
}
function namespaceToolNull(s){}
