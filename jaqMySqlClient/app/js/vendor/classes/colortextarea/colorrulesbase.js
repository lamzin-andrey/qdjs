function ColorRuleBase() {
	this.configure();
}
ColorRuleBase.prototype.configure = function() {
	this.keywords = [];
	this.cssKeywords = 'kw';
	this.cssSingleString = 'ss';
	this.cssApString = 'as';
	this.cssString = 's';
	this.cssComments = 'c';
	this.cssNums = 'n';
	this.cssRE = 'r';
	this.singleCommentStart = '//'
	this.commentStart = '/*';
	this.commentEnd = '*/';
}
ColorRuleBase.prototype.calc = function(sValue) {
	// Находим все комментарии в sValue
	// Находим все строки в sValue
	// Находим все регуляные выражения в sValue
	// Находим все ключевые слова в sValue
	var i, isInComment = false, 
		isOnestringComment = false,
		isInStr = false,
		isInRegExp = false,
		u = 'undefined',
		quoteType,
		startStrPos,
		startREPos,
		ch,
		b,
		lnk = {},
		r = {};
	this.prevColorType = 'undefined';
	for (i = 0; i < sz(sValue); i++) {
		ch = sValue.charAt(i);
		// Не начался ли комментарий?
		if (!isInComment && !isInStr && !isInRegExp) {
			isInComment = this.checkIsStartOnestringComment(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, С++, SQL
			if (isInComment) {
				isOnestringComment = true;
			}
		}
		if (!isInComment && !isInStr && !isInRegExp) {
			isInComment = this.checkIsStartManystringComment(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, С++
			if (isInComment) {
				isOnestringComment = false;
			}
		}
		
		// Не началась ли строка?
		if (!isInComment && !isInStr && !isInRegExp) {
			isInStr = this.checkIsStartString(sValue, ch); // Чтобы можно было перегружать в наследниках, например Pascal, Javascript, C++
			if (isInStr) {
				quoteType = ch;
				startStrPos = i;
			}
		}
		
		// Не началось ли регулярное выражение?
		if (!isInComment && !isInStr && !isInRegExp) {
			// console.log('check re start');
			isInRegExp = this.checkIsStartRegExp(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, Javascript, C++
			if (isInRegExp) {
				startREPos = i;
			}
		}
		
		// здесь записать в r состояние
		// console.log('здесь записать в r состояние');
		this.writeCharStyle(r, isInComment, isInStr, isInRegExp, quoteType, i);
		
		// Далее смотрим, не закончились ли эти сущности, если сейчас позиция внутри одной из них
		if (isInComment) {
			b = this.checkIsEndComment(sValue, i, isOnestringComment);// Чтобы можно было перегружать в наследниках
			if (b) {
				isInComment = false;
				isOnestringComment = false;
			}
		}
		
		if (isInStr) {
			b = this.checkIsEndString(sValue, ch, quoteType, startStrPos, i);// Чтобы можно было перегружать в наследниках
			if (b) {
				isInStr = false;
				quoteType = u;
			}
		}
		
		if (isInRegExp) {
			// console.log('check re end');
			b = this.checkIsEndRE(sValue, startREPos, i);// Чтобы можно было перегружать в наследниках
			if (b) {
				// console.log('check re end IS TRUE');
				isInRegExp = false;
			}
		}
		
	}
	
	// А далее подсвечиваем все ключевые слова если они не на позициях, 
	//	которые уже подсвеченны комментариями, строками или регулярными выражениями
	
	this.calcKeywords(r, sValue);
	
	
	// Этот вызов обязательно должен быть в перегружаемых наследниках!
	if (this.context && (this.context.setRules instanceof Function)) {
		this.context.setRules(r);
	}
	
}
/* @description Определяет, не заканчивается ли регулярное выражение
 * 
 * @param {String} s
 * @param {Number} startREPos
 * @param {Number} i
*/
ColorRuleBase.prototype.checkIsEndRE = function(s, startREPos, i) {
	var j, slashCounter = 0, ch;
	if (s.charAt(i) != '\n') {
		return false;
	}
	for (j = startREPos; j <= i; j++) {
		ch = s.charAt(j);
		if (ch == '/' && s.charAt(j - 1) != '\\') {
			slashCounter++;
		}
	}
	return (slashCounter == 2);
}
/* @description Определяет, не заканчивается ли строка
 * @param {String} s
 * @param {String} ch
 * @param {String} quoteType
 * @param {Number} startStrPos
 * @param {Number} i
*/
ColorRuleBase.prototype.checkIsEndString = function(s, ch, quoteType, startStrPos, i) {
	if (startStrPos === i) {
		return false;
	}
	return (ch === quoteType);
}
/**
 * @description Определяет, не заканчивается ли в строке комментарий
 * 
 * @param {String} s
 * @param {Number} i
 * @param {Boolean} isOnestringComment
*/
ColorRuleBase.prototype.checkIsEndComment = function(s, i, isOnestringComment) {
	if (isOnestringComment && s.charAt(i) == '\n') {
		return true;
	}
	if (!isOnestringComment && s.charAt(i) == '*' && s.charAt(i + 1) == '/') {
		return true;
	}
	return false;
}
/**
 * @description Записывает в r данные о символах, которые надо подсветить
 * 
 * @param {Object} r
 * @param {Boolean} isInComment
 * @param {Boolean} isInStr
 * @param {Boolean} isInRegExp
 * @param {String} quoteType
 * @param {Number} i
*/
ColorRuleBase.prototype.writeCharStyle = function(r, isInComment, isInStr, isInRegExp, quoteType, i) {
	var k = '';
	if (isInComment) {
		k = this.cssComments;
	} else if(isInStr) {
		if (quoteType == '"') {
			k = this.cssString;
		} else if (quoteType == "'") {
			k = this.cssSingleString;
		} else if (quoteType == "`") {
			k = this.cssApString;
		}
	} else if(isInRegExp) {
		k = this.cssRE;
	}
	
	if (k) {
		// console.log('Found k = ' + k + ', i = ' + i + ', this.prevColorType = ' + this.prevColorType);
		if (!r[k]) {
			r[k] = [];
			// console.log('Create array in item ' + k);
		}
		if (isU(this.prevColorType) || this.prevColorType != k) {
			r[k].push(i);
			r[k].push(i);
			// console.log('INSERT in array  "' + k + '" i = ' + i);
		} else {
			r[k][r[k].length - 1]++;
			// console.log('Increment in array  "' + k + '" i = ' + (r[k].length - 1) );
		}
		this.prevColorType = k;
	} else {
		this.prevColorType = 'undefined';
	}
}
/**
 * @description Определяет, не начинается ли в позиции i регулярное выражение
 * 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.checkIsStartRegExp = function(s, i) {
	var j,
		slashCounter = 1,
		ch,
		isInvalidModifier = false,
		mods = 'mig,;';
	if (s.charAt(i) == '/' && s.charAt(i + 1) != '/') {
		for (j = i + 1; j < s.length; j++) {
			ch = s.charAt(j);
			if (ch == '/' && s.charAt(j - 1) != '\\') {
				slashCounter++;
				continue;
			}
			if (slashCounter == 2 && ch != '\n') {
				if (ch in In(mods)) {
					isInvalidModifier = true;
				}
			}
			if (ch == '\n' || j == s.length -1) {
				break;
			}
		}
		if (slashCounter != 2 || isInvalidModifier) {
			if (isInvalidModifier) {
				console.log('isInvalidModifier');
			} else {
				console.log('slashCounter != 2');
			}
			
			return false;
		}
		return true;
	}
	return false;
}
/**
 * @description Определяет, не начинается ли с символа ch строка
 * 
 * @param {String} s
 * @param {String} ch
*/
ColorRuleBase.prototype.checkIsStartString = function(s, ch) {
	if (ch == '"' || ch == "'" || ch == "`") {
		return true;
	}
	return false;
}
/**
 * @description Определяет, не начинается ли в позиции i многострочный комментарий '/*'
 * 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.checkIsStartManystringComment = function(s, i) {
	var q = s.charAt(i) + s.charAt(i + 1);
	return (q == '/*');
}
/**
 * @description Определяет, не начинается ли в позиции i однострочный комментарий '//'
 * 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.checkIsStartOnestringComment = function(s, i) {
	var q = s.charAt(i) + s.charAt(i + 1);
	return (q == '//');
}

/**
 * @description Подсвечиваем все ключевые слова если они не на позициях, 
 * которые уже подсвеченны комментариями, строками или регулярными выражениями
 * @param {Object} r
 * @param {String} s
*/
ColorRuleBase.prototype.calcKeywords = function(r, s) {
	s = s.toLowerCase();
	var i, j, k, n, m, word, indexA, indexB, searchResult = 0,
		isInComment, isInStr, isInRegExp;
	for (i = 0; i < sz(this.keywords); i++) {
		// Все вхождения каждого слова!
		word = this.keywords[i].toLowerCase();
		
		do {
			searchResult = s.indexOf(word, searchResult);
			if (searchResult == -1) {
				break;
			}
			indexA = searchResult;
			indexB = searchResult + word.length;
			searchResult = indexA + 1;
			
			// Проверяем, не входит ли слово в комментарий, строку или регулярное выражение
			//  Похоже, достаточно проверить лишь вхождение первого символа
			// Note isInDiapason важная функция, возможно её будет использовать context
			isInComment = this.isInDiapason(indexA, r[this.cssComments]);
			isInStr = this.isInDiapason(indexA, r[this.cssSingleString]) || this.isInDiapason(indexA, r[this.cssString]);
			isInRegExp = this.isInDiapason(indexA, r[this.cssRE]);
			if (!(isInComment || isInStr || isInRegExp) ) {
				if (!(r[this.cssKeywords] instanceof Array)) {
					r[this.cssKeywords] = [];
				}
				r[this.cssKeywords].push(indexA);
				r[this.cssKeywords].push(indexB);
			}
			
		} while(searchResult != -1)
	}
}



/**
 * @description Вернет true если n входит в один из заданых в массиве диапазонов
 * @param {Number} n
 * @param {Array} arr определяет диапазоны таким образом: каждый чётный элемент - это начало диапазона, следующий за ним - конец
 * @return Boolean
*/
ColorRuleBase.prototype.isInDiapason = function(n, arr) {
	if (isU(arr)) {
		return false;
	}
	var i, left, right;
	for (i = 0; i < sz(arr); i += 2) {
		left = arr[i];
		right = arr[i + 1];
		if (n >= left && n <= right) {
			return true;
		}
	}
	return false;
}

/**
 * @description Устанавливает контекст поля ввода с подсветкой символов
*/
ColorRuleBase.prototype.setContext = function(colorTextArea) {
	this.context = colorTextArea;
}

// Оптимизация 2023 12 04
/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isInComm = function(s, i) {
	var pSingle, pStart, pEnd, pNL;
	
	if (!s) {
		return false;
	}
	
	// check single
	pSingle = s.lastIndexOf(this.singleCommentStart, i);
	if (pSingle != -1) {
		pNL = s.lastIndexOf('\n', i);
		if (pNL < pSingle) {
			return true;
		}
	}
	
	pStart = s.lastIndexOf(this.commentStart, i);
	pEnd = s.lastIndexOf(this.commentEnd, i);
	if (pStart > -1 && pEnd < pStart) {
		return true;
	}
	
	if (sz(this.commentEnd) == 2) {
		if (s.charAt(i) ==  this.commentEnd.charAt(0) && this.isInComm(s, i - 1)) {
			return true;
		}
		
		if (s.charAt(i) ==  this.commentEnd.charAt(1) && this.isInComm(s, i - 2)) {
			return true;
		}
	}
	
	
	return false;
}


/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isKW = function(s) {
	var i, SZ;
	if (!this.okw) {
		SZ = sz(this.keywords);
		this.okw = {};
		for (i = 0; i < SZ; i++) {
			this.okw[ this.keywords[i] ] = 1;
		}
	}
	
	if (this.okw[s]) {
		return true;
	}
	
	return false;
}


/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isInStr = function(s, i) {
	return this.pIsInStr(s, i, '"');
}

/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isInSingleStr = function(s, i) {
	return this.pIsInStr(s, i, "'");
}

/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isInRE = function(s, i) {
	return false;
}


/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.pIsInStr = function(s, i, q) {
	var c = 0, j, br = 0, ls = [], k, SZ;
	
	if (!s) {
		return false;
	}
	
	j = i;
	while (j > -1) {
		j = s.lastIndexOf(q, j);
		if (j > -1) {
			ls.push(j);
			c++;
		}
		j--;
		br++;
		if (br > 500) {
			console.log('Alarma pIsInStr, s = '  + s + ', i = ' + i + ', q = ' + q);
			break;
		}
	}
	
	
	if (c % 2 != 0) {
		SZ = sz(ls);
		for (k = 0; k < SZ; k++) {
			if (this.isInComm(s, ls[k])) {
				c--;
			}
		}
	}
	
	if (c % 2 != 0) {
		return true;
	}
	
	if (s.charAt(i) == q && this.pIsInStr(s, i - 1, q)) {
		return true;
	}
	
	return false;
}


/**
 * @description 
 * @param {String} s
 * @param {Number} i
*/
ColorRuleBase.prototype.isNum = function(s) {
	
	var inp = String(s).trim(),
		aft = String(parseInt(s)), r;
	r =  inp == aft || inp == String(parseFloat(s));
	
	if (r) {
		return r;
	}
	
	if (~s.indexOf(';')) {
		s = s.replace(';', '');
		
		return this.isNum(s);
	}
	
	return false;
}
