function DataGrid(blockId) {
	this.viewContainer = e(blockId);
	this.mainTableNumCols = 0;
	this.mainTableNumRows = 0;
	
	this.columnNumberWidth = 50;
	this.columnNumberWidthCorrection = 0;
	this.cursorX = 0;
	this.cursorY = 0;
	
	this.initalizeView();
	/** @property {Boolean} после первой очистки принимает false */
	this.isFirstRender = true;
	/** @property {Boolean} надо устанавливать ее в false когда вы не хотите, чтобы grid реагировал на клавиши */
	this.isFocused = true;
}


/**
 * TODO продолжить
 * @description  Заполняет таблицу пустыми значениями чтобы установить динамические стили.
*/
DataGrid.prototype.initalizeView = function() {
	var N = 100, i, arr = [], rows = [], j, v;
	for (i = 0; i < N; i++) {
		v = (i + 1);
		/*if (i == 4) {
			v = 'Gerodoterda ore';
		}*/
		arr.push(v);
	}
	this.setColumnHeaders(arr);
	this.setRowHeadersByRange(1, N + 1);
	for (i = 0; i < N; i++) {
		rows[i] = [];
		for (j = 0; j < N; j++) {	
			rows[i][j] = '';// i + ', ' + j + ' Sigizmoond Podoozdovatyy III ERarol';
		}
	}
	this.setContent(rows);
	this.setScrollBars();
	this.setListeners();
	
	var td = e('c' + this.cursorY + '_' + this.cursorX);
	this.setActiveCellView(td, td);
}

DataGrid.prototype.setScrollBars = function() {
	this._divMainTablePlace.style.width = (this.viewContainer.offsetWidth - this.leftHeadersColumn.offsetWidth) + 'px';
	this.headerDivRight.style.width = (this.viewContainer.offsetWidth - this.leftHeadersColumn.offsetWidth) + 'px';
	this._divMainTablePlace.style.height = (this.viewContainer.offsetHeight - this.headerDiv.offsetHeight) + 'px';
	this.headerRows.style.height = (this.viewContainer.offsetHeight - this.headerDiv.offsetHeight) + 'px';
	
	
	// console.log(this._divMainTablePlace.style.width);
}


DataGrid.prototype.addEmptyRowAndColumn = function(dataRows) {
	var lastRow, i, j, newRow, numCells = 0, row, emp = '&nbsp;';
	// append new Empty row
	if (dataRows instanceof Array) {
		
		lastRow = dataRows[sz(dataRows) - 1];
		if (lastRow instanceof Array) {
			newRow = [];
			for (i = 0; i < sz(lastRow); i++) {
				newRow.push('&nbsp;');
			}
			dataRows.push(newRow);
		} else {
			newRow = new Object();
			for (i in lastRow) {
				newRow[i] = '&nbsp;';
			}
			dataRows.push(newRow);
		}
		
	} else {
		for (i in dataRows) {
			if (!lastRow) {
				lastRow = dataRows[i];
			}
			numCells++;
		}
		if (lastRow instanceof Array) {
			newRow = [];
			for (i = 0; i < sz(lastRow); i++) {
				newRow.push('&nbsp;');
			}
			dataRows['datagridLastRow21122020'] = newRow;
		} else {
			newRow = new Object();
			for (i in lastRow) {
				newRow[i] = '&nbsp;';
			}
			dataRows['datagridLastRow21122020'] = newRow;
		}
	}
	
	// append new Empty column
	if (dataRows instanceof Array) {
		for (i = 0; i < sz(dataRows); i++) {
			row = dataRows[i];
			if (row instanceof Array) {
				row.push(emp);
			} else {
				row['datagridLastRowLastCell21122020'] = emp;
			}
		}
	} else {
		for (i in dataRows) {
			row = dataRows[i];
			if (row instanceof Array) {
				row.push(emp);
			} else {
				row['datagridLastRowLastCell21122020'] = emp;
			}
		}
	}
}


/**
 * @description Установить максимальные пределы для изменения значений курсора ячеек
*/
DataGrid.prototype.setMaxCursor = function(dataRows) {
	var i, j = 0, row;
	if (dataRows instanceof Array) {
		this.maxCursorY = dataRows.length;
		row = dataRows[dataRows.length - 1];
	} else {
		this.maxCursorY = 0;
		for (i in dataRows) {
			if (!row) {
				row = dataRows[i];
			}
			this.maxCursorY++;
		}
	}
	
	if (row instanceof Array) {
		this.maxCursorX = row.length;
	} else {
		this.maxCursorX = 0;
		for (i in row) {
			this.maxCursorX++;
		}
	}
}
DataGrid.prototype.setContent = function(dataRows) {
	this.setMaxCursor(dataRows);
	this.addEmptyRowAndColumn(dataRows);
	var i, mainTableRows = ee(this.mainTable, 'tr'), j = 0;
	if (dataRows instanceof Array) {
		for (i = 0; i < sz(dataRows); i++) {
			this.setRowContent(dataRows[i], mainTableRows, i);
		}
	} else {
		for (i in dataRows) {
			this.setRowContent(dataRows[i], mainTableRows, j);
			j++;
		}
	}
}

DataGrid.prototype.setRowValues = function(dataRow, tr, rowIndex) {
	var i, cells = ee(tr, 'td'), j = 0;
	if (dataRow instanceof Array) {
		for (i = 0; i < sz(dataRow); i++) {
			/*if (i == 0) {
				console.log(cells);
				break;
			}*/
			this.setCellContent(dataRow[i], cells, i, rowIndex, tr);
			// throw new Error('Line 52');
		}
	} else {
		for (i in dataRow) {
			this.setCellContent(dataRow[i], cells, j, rowIndex, tr);
			j++;
		}
	}
}

DataGrid.prototype.setCellContent = function(value, cells, i, rowIndex, tr) {
	// Добавляю данные в копию, чтобы не было разных бед
	if (!this.tableData) {
		this.tableData = [];
	}
	
	if (!this.tableData[rowIndex]) {
		this.tableData[rowIndex] = {};
	}
	
	this.tableData[rowIndex][i] = value;
	
	var td, headers = this.getViewHeadersColumn(), ths, headerCell, stl, 
		cutValue, indexB = 6;
	
	cutValue = this.subValue(value, i);
	
	if (cells[i]) {
		td = cells[i];
		td.innerHTML = cutValue;
		if (this.columnHLsWidthList[i]) {
			// alert('set W for row ' + rowIndex + ' Cell ' + i + ' v = ' + this.columnHLsWidthList[i]);
			td.style['max-width'] = this.columnHLsWidthList[i] + 'px';
			td.style['min-width'] = this.columnHLsWidthList[i] + 'px';
		}
	} else {
		// console.log('will append td ' + i);
		stl = ''; // 'overflow-x:hidden;';
		if (this.columnHLsWidthList[i]) {
			stl += 'max-width: ' + this.columnHLsWidthList[i] + 'px;';
			stl += 'min-width: ' + this.columnHLsWidthList[i] + 'px';
		}
		td = appendChild(tr, 'td', cutValue, {id: ('c' + rowIndex + '_' + i), style: stl});
	}
	
	
	this.setCellListeners(td);
}

/**
 * Получить подстроку из значения таблицы для отображения в гриде
 * @param {String} value
 * @param {Number} i
*/
DataGrid.prototype.subValue = function(value, i) {
	var headers = this.getViewHeadersColumn(), ths, indexB, cutValue;
	// TODO это чистить при clear!
	if (!this.columnHLs) {
		this.columnHLs = ee(headers, 'td');
		this.columnHLsWidthList = [];
	}
	ths = this.columnHLs;
	headerCell = ths[i];
	if (!this.columnHLsWidthList[i] && headerCell) {
		this.columnHLsWidthList[i] = headerCell.offsetWidth - 1;
	}
	indexB = parseInt(this.columnHLsWidthList[i] / 10);
	cutValue = String(value).substring(0, indexB);
	
	return cutValue;
}

/**
 * Установка слушателей событий для ячеек таблицы
*/
DataGrid.prototype.setCellListeners = function(td) {
	var self = this;
	td.onclick = function(evt){
		self.onClickCell(evt, td);
	}
}


/**
 * Установка слушателей событий для ячеек таблицы
*/
DataGrid.prototype.onClickCell = function(evt, td) {
	evt.preventDefault();
	var currentActiveCell = e('c' + this.cursorY + '_' + this.cursorX);
	this.setActiveCellView(td, currentActiveCell);
	
	var id = td.getAttribute('id'),
		a, r, c;
		
	id = id.replace('c', '');
	a = id.split('_');
	r = a[0];
	c = a[1];
	this.cursorX = c;
	this.cursorY = r;
	if (this.editCellX != c && this.editCellY != r) {
		this.setCellViewReadable();
	}
}

/**
 * Установка вида ячейки таблицы "активная"
*/
DataGrid.prototype.setActiveCellView = function(td, currentActiveCell) {
	var clr = '#002DEF';// #002DEF  #ACFFD2 rgb(72, 215, 137)
	this.setCellColor(currentActiveCell, '#000000', 1);
	this.setCellColor(td, clr, 2);
}

/**
 * Установка цвета активной ячейки таблицы
*/
DataGrid.prototype.setCellColor = function(td, clr, w) {
	var id = td.getAttribute('id'),
		a, r, c;
		
	id = id.replace('c', '');
	a = id.split('_');
	r = a[0];
	c = a[1];
	
	td.style.borderRight = w + 'px solid ' + clr;
	td.style.borderBottom = w + 'px solid ' + clr;
	
	td = this.getTopCell(r, c);
	if (td) {
		td.style.borderBottom = w + 'px solid ' + clr;
	}
	
	td = this.getLeftCell(r, c);
	if (td) {
		td.style.borderRight = w + 'px solid ' + clr;
	}
	
}

/**
 * Получить ячейку (td element) над ячейкой с индексами r и  c
*/
DataGrid.prototype.getTopCell = function(r, c) {
	r = r - 1;
	var td = e('c' + r + '_' + c);
	if (!td) {
		return null;
	}
	
	return td;
}

/**
 * Получить ячейку (td element) левее ячейки с индексами r и  c
*/
DataGrid.prototype.getLeftCell = function(r, c) {
	c = c - 1;
	var td = e('c' + r + '_' + c);
	if (!td) {
		return null;
	}
	
	return td;
}

/**
 * Установка слушателей событий для ячеек таблицы
*/
DataGrid.prototype.onKeyDownCell = function(evt) {
	
	//TODO если фокус в поле ввода, выходить
	if (!this.isFocused || (this.isEditMode && evt.keyCode != 13)) {
		return true;
	}
	evt.preventDefault(); 
	
	if (evt.keyCode in In([27, 13, 38, 40])) { // Esc or Down or Up or Enter
		this.updateData(evt.keyCode);
		this.emitOnChangeCellData(evt.keyCode);
		this.setCellViewReadable();
	}
	
	
	
	var current = e('c' + this.cursorY + '_' + this.cursorX),
		scrollFunctionName = '', isCursorKey = false;
	
	
	
	
	if (evt.keyCode == 37) { // left
		isCursorKey = true;
		this.cursorX--;
		if (this.cursorX < 0) {
			this.cursorX = 0;
		}
		scrollFunctionName = 'setScrollForLeft';
	}
	
	var maxX = this.maxCursorX,
		maxY = this.maxCursorY;

	/*if (this.tableData.length) {
		// здесь использовать this.maxCursorXY
		maxY = this.tableData.length;
		maxX = this.tableData[0].length;
	}*/
		
	if (evt.keyCode == 39) { // right
		isCursorKey = true;
		this.cursorX++;
		if (this.cursorX > maxX) {
			this.cursorX = maxX;
		}
		scrollFunctionName = 'setScrollForRight';
	}
	
	if (evt.keyCode == 40) { // down
		isCursorKey = true;
		this.cursorY++;
		if (this.cursorY > maxY) {
			this.cursorY = maxY;
		}
		scrollFunctionName = 'setScrollForDown';
	}
	
	if (evt.keyCode == 38) { // up
		isCursorKey = true;
		this.cursorY--;
		if (this.cursorY < 0) {
			this.cursorY = 0;
		}
		scrollFunctionName = 'setScrollForUp';
	}
	
	if (evt.keyCode == 113) { // F2
		this.setCellViewEditable();
	}
	
	
	if (isCursorKey) {
		var td = e('c' + this.cursorY + '_' + this.cursorX);
		this.setActiveCellView(td, current);
		if (this[scrollFunctionName]) {
			this[scrollFunctionName]();
		}
	}
}

/**
 * @description Сохраняет значение в модели данных, которую использует this
*/
DataGrid.prototype.updateData = function(keyCode) {
	if (keyCode != 13) {
		return;
	}

	var u = 'undefined';
	if (String(this.tableData[this.editCellY]) == u || String(this.tableData[this.editCellY][this.editCellX]) == u) {
		return;
	}
	this.tableData[this.editCellY][this.editCellX] = this.editInput.value;
}
/**
 * @description Вызывает обработку сохранения значения в исходном источнике
*/
DataGrid.prototype.emitOnChangeCellData = function(keyCode) {
	if (keyCode != 13) {
		return;
	}

	if (!this.onChangeCellData || !(this.onChangeCellData[1] instanceof Function)) {
		return;
	}
	
	var u = 'undefined';
	if (String(this.tableData[this.editCellY]) == u || String(this.tableData[this.editCellY][this.editCellX]) == u) {
		return;
	}
	this.onChangeCellData[1].call(this.onChangeCellData[0], this.tableData[this.editCellY][this.editCellX], this.editCellY, this.editCellX);
}

/**
 * @description 
*/
DataGrid.prototype.setCellViewReadable = function() {
	if (!isNaN(this.editCellX) && !isNaN(this.editCellY)) {
		this.isEditMode = false;
		var td = e('c' + this.editCellY + '_' + this.editCellX),
			data = this.tableData[this.editCellY][this.editCellX];
		td.innerHTML = this.subValue(data, this.editCellY);
		this.editCellX = this.editCellY = parseInt('NaN');
	}
}

/**
 * @description 
*/
DataGrid.prototype.setCellViewEditable = function() {
	var td = e('c' + this.cursorY + '_' + this.cursorX),
		data = this.tableData[this.cursorY][this.cursorX];
		
	if (data && td) {
		this.setCellViewReadable();
		this.isEditMode = true;
		this.editCellX = this.cursorX;
		this.editCellY = this.cursorY;
		td.innerHTML = '';
		
		var inp = appendChild(td, 'input', '', {value: data, 'class': 'editinput'});
		this.editInput = inp;
		// TODO configure!
		setTimeout(function(){
			inp.focus();
			inp.select();
		}, 100);
	}
}

/**
 * @description Установить горизонтальный скролл при движении курсором влево
*/
DataGrid.prototype.setScrollForLeft = function() {
	var td, i, offsetLeft = 0;
	for (i = 0; i < this.cursorX; i++) {
		td = e('c' + this.cursorY + '_' + i);
		offsetLeft += td.offsetWidth;
	}
	
	// console.log('this._divMainTablePlace.scrollLeft', this._divMainTablePlace.scrollLeft, 'offsetLeft', offsetLeft);
	if ( ( offsetLeft - parseInt(this._divMainTablePlace.scrollLeft)) < 0) {
		this._divMainTablePlace.scrollLeft -= -1*( offsetLeft - parseInt(this._divMainTablePlace.scrollLeft));
	}
	
	if (this.cursorX == 0) {
		this._divMainTablePlace.scrollLeft = 0;
	}
	
	
}
/**
 * @description Установить горизонтальный скролл при движении курсором вправо
*/
DataGrid.prototype.setScrollForRight = function() {
	var td, i, offsetLeft = 0;
	for (i = 0; i <= this.cursorX; i++) {
		td = e('c' + this.cursorY + '_' + i);
		if (!td) {
			return;
		}
		offsetLeft += td.offsetWidth;
	}
	if (offsetLeft > parseInt(this._divMainTablePlace.style.width) ) {
		this._divMainTablePlace.scrollLeft = ( offsetLeft - parseInt(this._divMainTablePlace.style.width));
	}
}

/**
 * @description Установить горизонтальный скролл при движении курсором вниз
*/
DataGrid.prototype.setScrollForDown = function() {
	var td, i, offsetTop = 0;
	for (i = 0; i <= this.cursorY; i++) {
		td = e('c' + i + '_' + this.cursorX);
		if (!td) {
			return;
		}
		offsetTop += td.offsetHeight;
	}
	if (offsetTop > parseInt(this._divMainTablePlace.style.height) ) {
		this._divMainTablePlace.scrollTop = ( offsetTop - parseInt(this._divMainTablePlace.style.height));
	}
}

/**
 * @description Установить горизонтальный скролл при движении курсором влево
*/
DataGrid.prototype.setScrollForUp = function() {
	var td, i, offsetTop = 0;
	for (i = 0; i < this.cursorY; i++) {
		td = e('c' + i + '_' + this.cursorX);
		offsetTop += td.offsetHeight;
	}
	
	// console.log('this._divMainTablePlace.scrollLeft', this._divMainTablePlace.scrollLeft, 'offsetLeft', offsetLeft);
	if ( ( offsetTop - parseInt(this._divMainTablePlace.scrollTop)) < 0) {
		this._divMainTablePlace.scrollTop -= -1*( offsetTop - parseInt(this._divMainTablePlace.scrollTop));
	}
	
	if (this.cursorY == 0) {
		this._divMainTablePlace.scrollTop = 0;
	}
	
	
}

DataGrid.prototype.setRowContent = function(dataRow, mainTableRows, i) {
	var tr;
	if (mainTableRows[i]) {
		tr = mainTableRows[i];
	} else {
		tr = appendChild(this.mainTable, 'tr', '');
	}
	this.setRowValues(dataRow, tr, i);
}
/**
 * @description Устанавливает ширину колонок такой же, как ширина колонок - заголовков
*/
DataGrid.prototype.setColumnWidthes = function() {
	var headersTr = this.getViewHeadersColumn(), i, th, td,
		ths = ee(headersTr, 'td');
	for (i = 0; i < sz(ths); i++) {
		th = ths[i];
		this.getCellByIndex(0, i).style.maxWidth = th.offsetWidth + 'px';
	}
}
/**
 * @param {Array} columnHeaders
*/
DataGrid.prototype.getCellByIndex = function(rowN, cellN) {
	return e('c' + rowN + '_' + cellN);
}
/**
 * @param {Array} columnHeaders
*/
DataGrid.prototype.setColumnHeaders = function(columnHeaders) {
	var tr = this.getViewHeadersColumn(),
		i, createdNew = false,
		ls = tr.getElementsByTagName('td'),
		s = '';
	for (i = 0; i <= sz(columnHeaders); i++) {
		s = columnHeaders[i];
		if (String(s) == 'undefined') {
			s = '';
		}
		if (ls[i]) {
			ls[i].innerHTML = s;
		} else {
			appendChild(tr, 'td', s);
			createdNew = true;
		}
	}
	
	if (!createdNew) {
		for (i + 1; i < sz(ls); i++) {
			ls[i].innerHTML = '';
		}
	}
}

DataGrid.prototype.getViewHeadersColumn = function(row) {
	if (this.headerColumn) {
		return this.headerColumn;
	}
	this.headerDiv = appendChild(this.viewContainer, 'div', '');
	this.headerDivTable = appendChild(this.headerDiv, 'table', '');
	this.headerDivTableTr = appendChild(this.headerDivTable, 'tr', '');
	this.topBrick = appendChild(this.headerDivTableTr, 'td', '', {'class' : 'topBrick'});
	this.rightBrick = appendChild(this.headerDivTableTr, 'td', '');
	this.headerDivRight = appendChild(this.rightBrick, 'div', '', {'class' : 'hScrollHidden'});
	// this.headerDivClear = appendChild(this.headerDiv, 'div', '', {'class' : 'clear'});
	this.headerTable = appendChild(this.headerDivRight, 'table', '');
	this.headerColumn = appendChild(this.headerTable, 'tr', '', {'class': 'tableHeader'});
	
	this.observeGeometry();
	
	return this.headerColumn;
}
/**
 * @description Залить номера строк от first дол last
 * 
*/
DataGrid.prototype.setRowHeadersByRange = function(first, last) {
	var td = this.getViewHeadersRowsDiv();
	var i, j = 0, ls = ee(td, 'div'), createdNew = false;
	for (i = first; i <= last + 1; i++, j++) {
		if (ls[j]) {
			ls[j].innerHTML = i;
		} else {
			appendChild(td, 'div', i);
			createdNew = true;
		}
	}

	if (!createdNew) {
		for (j + 1; j < sz(ls); j++) {
			ls[j].innerHTML = '&nbsp;';
		}
	}
}
/**
 * @description Строит основной вид таблицы
*/
DataGrid.prototype.getViewHeadersRowsDiv = function() {
	if (this.headerRowsInner) {
		return this.headerRowsInner;
	}
	this.mainFrameTable = appendChild(this.viewContainer, 'table', '');
	var tr = appendChild(this.mainFrameTable, 'tr', '');
	var left = appendChild(tr, 'td', '', {'style' : 'vertical-align: top;', 'class' : 'tableHeader'});
	this.leftHeadersColumn = left;
	var right = appendChild(tr, 'td', '', {'style' : 'vertical-align: top;'});
	this.headerRows = appendChild(left, 'div', '', {'class': 'vScrollHidden'});		// TODO getter
	this.headerRowsInner = appendChild(this.headerRows, 'div', '', {'class': 'headerRowsInner'});		
	this._divMainTablePlace = appendChild(right, 'div', '', {'class': 'scroll', 'id': 'mainScroll'});	// TODO getter
	this.mainTable = appendChild(this._divMainTablePlace, 'table', '', {'class': 'au1'});
	
	return this.headerRowsInner;
}

DataGrid.prototype.getRowsScrollDiv = function() {
	return this.headerRows;
}

DataGrid.prototype.getMainTableWrapper = function() {
	return this._divMainTablePlace;
}
/**
 * @description Строит основной вид таблицы
*/
DataGrid.prototype.clearHeaders = function() {
	var div = this.getViewHeadersRowsDiv();
	var i, ls = ee(div, 'div'), emp = '&nbsp;';
	for (i = 0; i < sz(ls); i++) {
		ls[i].innerHTML = emp;
	}
	
	var td = this.getViewHeadersColumn();
	ls = ee(td, 'td');
	for (i = 0; i < sz(ls); i++) {
		ls[i].innerHTML = emp;
	}
}


DataGrid.prototype.clearContent = function() {
	if (this.isFirstRender) {
		this.isFirstRender = false;
		return;
	}
	// Get cells count
	var row = this.tableData[0] ? this.tableData[0] : {}, 
		sZ = this.count(row),
		i, j, td;
	
	// Clear
	for (i = 0; i < sz(this.tableData); i++) {
		for (j = 0; j < sZ; j++) {
			td = this.getCellByIndex(i, j);
			if (td) {
				td.innerHTML = '&nbsp;';
				td.style.maxWidth = null;
				td.style['min-width'] = null;
			}
		}
	}
	this.tableData = [];
	this.columnHLs = null;
	this.columnHLsWidthList = null;
	var currentActiveTd = this.getCellByIndex(this.cursorY, this.cursorX),
		td = this.getCellByIndex(0, 0);
	this.cursorX = 0;
	this.cursorY = 0;
	this.setActiveCellView(td, currentActiveTd);
}

DataGrid.prototype.setListeners = function() {
	var self = this;
	this._divMainTablePlace.addEventListener('scroll', function(evt){ self.onScroll(evt); });
	
	window.addEventListener('keydown',  function(evt){
		self.onKeyDownCell(evt);
		return true;
	}, true);
}

DataGrid.prototype.onScroll = function(evt) {
	// alert(this._divMainTablePlace.scrollTop);
	this.headerRowsInner.style.marginTop = (-1 * this._divMainTablePlace.scrollTop) + 'px';
	this.headerTable.style.marginLeft = (-1 * this._divMainTablePlace.scrollLeft) + 'px';
	this.observeGeometry();
}

DataGrid.prototype.observeGeometry = function() {
	//TODO здесь можно будет измнять ширину столбца с цифрами
	
	// topBrick меняем тоже
	this.topBrick.style.width = this.columnNumberWidth + this.columnNumberWidthCorrection + 'px';
	
}

DataGrid.prototype.count = function(row) {
	var i, sZ = 0;
	if (row instanceof Array) {
		return row.length;
	}
	for (i in row) {
		sZ++;
	}
	
	return sZ;
}

