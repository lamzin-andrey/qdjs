function SqlField(mediator) {
	this.mediator = mediator;
	this.SKEY = 'tEdit1Value';
    this.view = W.tEdit1;
    this.view.value = storage(this.SKEY);
    this.setListeners();
}

SqlField.prototype.setListeners = function () {
	var self = this, sql;
    this.view.onkeydown = function(evt) { 
		if (evt.ctrlKey) {
			switch(evt.keyCode) {
				case 65:
					setTimeout(function(){
						self.view.select();
					}, 10);
					evt.preventDefault();
					break;
			}
		} else {
			switch(evt.keyCode) {
				case 116: // F5
					try {
						self.mediator.dataGrid.clear();
						sql = self.getActiveQuery(self.view.value.trim());
						// alert(sql);
					} catch(e) {
						alert('case 116: // F5' + e);
					}
					
					self.exec(sql);
					evt.preventDefault();
					
					break;
			}
		}
		
		setTimeout(function(){
			self.onKeyDown(evt); 
		}, 100);
		return true;
	};
	
	this.view.onkeyup = function(evt) {
		if (evt.ctrlKey) {
			switch(evt.keyCode) {
				case 65:
					evt.preventDefault();
					evt.stopImmediatePropagation();
					return false;
			}
			
		}
		return true;
	};
	
	this.view.onfocus = function(evt) {
		if (self.onfocus instanceof Function) {
			self.onfocus();
		}
	}
	
	this.view.onblur = function(evt) {
		if (self.onblur instanceof Function) {
			self.onblur();
		}
	}
}

SqlField.prototype.onKeyDown = function(e) {
	storage(this.SKEY, this.view.value);
}
/**
 * Выбирает только тот sql запрос, в котором находится текстовый курсор
 * Завязан на классы из vendor поэтому потом не разобраться
*/
SqlField.prototype.getActiveQuery = function(sql) {
	// Для понимания, находится ли символ в комментарии или в строке использую класс для подсветки синтаксиса
	var endPos = -1, // Окончание строки
		startPos = -1,
		i, ch, res,
		currentPos;
	currentPos = this.mediator.colorTa.textCursor.getCaretPosition(this.view);
	// Ищем окончание запроса (точку с запятой)
	for (i = currentPos; i < sz(sql); i++) {
		ch = sql.charAt(i);
		/*if (';' == ch) {
			alert(sql.charAt(i - 2) + sql.charAt(i - 1) + sql.charAt(i) + sql.charAt(i + 1));
			alert( this.isIgnoredSqlFragment(i) );
		}*/
		if (';' == ch && !this.isIgnoredSqlFragment(i)) {
			// alert(i + ' FOUND!' );
			endPos = i + 1;
			break;
		}
	}
	startPos = 0;
	for (i = currentPos; i > -1; i--) {
		ch = sql.charAt(i);
		if (';' == ch || this.isComment(i)) {
			startPos = i + 1;
			break;
		}
	}
	
	while (this.isComment(startPos)) {
		startPos++;
		if (startPos > endPos) {
			startPos = -1;
			break;
		}
	}
	
	
	if (-1 != startPos && -1 != endPos) {
		res = '';
		for (i = startPos; i <= endPos; i++) {
			if(!this.isComment(i)) {
				res += sql.charAt(i);
			}
		}
		return res.trim();
		// return sql.substring(startPos, endPos).trim();
	}
	
	return sql;
}

/**
 * Определяет, не находится ли символ в строке или комментарии
 * Завязан на классы из vendor поэтому потом не разобраться
*/
SqlField.prototype.isIgnoredSqlFragment = function(i) {
	var s = this.mediator.colorTa.getRule(i);
	if ('class="as"' == s
		|| 'class="s"' == s
		|| 'class="ss"' == s
		|| 'class="c"' == s
	) {
		return true;
	}
	
	return false;
}

/**
 * Определяет, не находится ли символ в строке или комментарии
 * Завязан на классы из vendor поэтому потом не разобраться
*/
SqlField.prototype.isComment = function(i) {
	var s = this.mediator.colorTa.getRule(i);
	if ('class="c"' == s) {
		return true;
	}
	
	return false;
}

SqlField.prototype.exec = function(sql) {
	PHP.file_put_contents(Qt.appDir() + '/p/command.sql', sql);
	PHP.exec('php ' + Qt.appDir() + '/p/query.php', 'sqlfield_onFin', 'Null', 'Null');
}


function sqlfield_onFin(stdout, stderr) {
	var r = PHP.file_get_contents(Qt.appDir() + '/p/result.json');
	try {
		r = JSON.parse(r);
	} catch(e) {
		r = {status: 'error', msg: 'Some went wrong'};
	}
	onExecuteSql(r); //it define in app.js
}
