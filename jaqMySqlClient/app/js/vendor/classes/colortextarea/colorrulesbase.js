function ColorRuleBase() {
	this.init();
	this.configure();
}
ColorRuleBase.prototype.configure = function() {
	this.keywords = [];
	this.cssKeywords = 'kw';
	this.cssSingleString = 'ss';
	this.cssString = 's';
	this.cssComments = 'c';
	this.cssRE = 'r';
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
		ch,
		b,
		lnk = {},
		r = {};
	
	for (i = 0; i < sz(sValue); i++) {
		ch = sValue.charAt(i);
		// Не начался ли комментарий?
		if (!isInComment && !isInStr && !isInRegExp) {
			// TODO
			isInComment = this.checkIsStartOnestringComment(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, С++, SQL
			if (isInComment) {
				isOnestringComment = true;
			}
		}
		if (!isInComment && !isInStr && !isInRegExp) {
			// TODO
			isInComment = this.checkIsStartManystringComment(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, С++
			if (isInComment) {
				isOnestringComment = false;
			}
		}
		
		// Не началась ли строка?
		if (!isInComment && !isInStr && !isInRegExp) {
			// TODO
			isInStr = this.checkIsStartString(sValue, ch); // Чтобы можно было перегружать в наследниках, например Pascal, Javascript, C++
			if (isInStr) {
				quoteType = ch;
			}
			
			/*if (ch == '"' || ch == "'") {
				isInStr = true;
				quoteType = ch;
			}*/
		}
		
		// Не началось ли регулярное выражение?
		if (!isInComment && !isInStr && !isInRegExp) {
			//TODO
			isInRegExp = this.checkIsStartRegExp(sValue, i); // Чтобы можно было перегружать в наследниках, например Pascal, Javascript, C++
		}
		
		// TODO здесь записать в r состояние
		this.writeCharStyle(r, isInComment, isInStr, isInRegExp, i);
		
		// Далее смотрим, не закончились ли эти сущности, если сейчас позиция внутри одной из них
		if (isInComment) {
			// TODO
			b = this.checkIsEndComment(sValue, i, isOnestringComment);// Чтобы можно было перегружать в наследниках
			if (b) {
				isInComment = false;
				isOnestringComment = false;
			}
		}
		
		if (isInStr) {
			// TODO
			b = this.checkIsEndString(sValue, ch, quoteType);// Чтобы можно было перегружать в наследниках
			if (b) {
				isInStr = false;
				quoteType = u;
			}
		}
		
		if (isInRegExp) {
			// TODO
			b = this.checkIsEndRE(sValue, i);// Чтобы можно было перегружать в наследниках
			if (b) {
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
			searchResult = word.indexOf(word, searchResult);
			if (searchResult == -1) {
				break;
			}
			indexA = searchResult;
			indexB = searchResult + word.length;
			
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

(indexA, r[this.cssComments])

/**
 * @description Вернет true если n входит в один из заданных в массиве диапазонов
 * @param {Number} n
 * @param {Array} arr определяет диапазоны таким образом: каждый чётный элемент - это начало диапазона, следующий за ним - конец
 * @return Boolean
*/
ColorRuleBase.prototype.isInDiapason = function(n, arr) {
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

