function DataGrid(blockId) {
	this.viewContainer = e(blockId);
	this.mainTableNumCols = 0;
	this.mainTableNumRows = 0;
	
	this.columnNumberWidth = 50;
	this.columnNumberWidthCorrection = 0;
	this.cursorX = 0;
	this.cursorY = 0;
	
	this.initalizeView();
}


/**
 * TODO продолжить
 * @description  Заполняет таблицу пустыми значениями чтобы установить динамические стили.
*/
DataGrid.prototype.initalizeView = function() {
	var N = 100, i, arr = [], rows = [], j;
	for (i = 0; i < N; i++) {
		arr.push((i + 1));
	}
	this.setColumnHeaders(arr);
	this.setRowHeadersByRange(1, N + 1);
	for (i = 0; i < N; i++) {
		rows[i] = [];
		for (j = 0; j < N; j++) {	
			rows[i][j] = i + ', ' + j;
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

DataGrid.prototype.setContent = function(dataRows) {
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
		this.tableData[rowIndex] = [];
	}
	
	this.tableData[rowIndex][i] = value;
	
	var td;
	if (cells[i]) {
		td = cells[i];
		td.innerHTML = value;
	} else {
		// console.log('will append td ' + i);
		td = appendChild(tr, 'td', value, {id: ('c' + rowIndex + '_' + i)});
		// this.setCellListeners(td);//TODO define it хотя бы
	}
	this.setCellListeners(td);
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
	evt.preventDefault();
	
	var current = e('c' + this.cursorY + '_' + this.cursorX);
	
	
	if (evt.keyCode == 37) { // left
		this.cursorX--;
		if (this.cursorX < 0) {
			this.cursorX = 0;
		}
	}
	
	var maxX = 0,
		maxY = 0;

	if (this.tableData.length) {
		maxY = this.tableData.length;
		maxX = this.tableData[0].length;
	}
		
	if (evt.keyCode == 39) { // right
		this.cursorX++;
		if (this.cursorX > maxX) {
			this.cursorX = maxX;
		}
	}
	
	if (evt.keyCode == 40) { // down
		this.cursorY++;
		if (this.cursorY > maxY) {
			this.cursorY = maxY;
		}
	}
	
	if (evt.keyCode == 38) { // up
		this.cursorY--;
		if (this.cursorY < 0) {
			this.cursorY = 0;
		}
	}
	
	var td = e('c' + this.cursorY + '_' + this.cursorX);
	this.setActiveCellView(td, current);
	
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
 * @param {Array} columnHeaders
*/
DataGrid.prototype.setColumnHeaders = function(columnHeaders) {
	var tr = this.getViewHeadersColumn(),
		i, createdNew = false,
		ls = tr.getElementsByTagName('td'),
		s = '';
	for (i = 0; i < sz(columnHeaders); i++) {
		s = columnHeaders[i];
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
	for (i = first; i <= last; i++, j++) {
		if (ls[j]) {
			ls[j].innerHTML = i;
		} else {
			appendChild(td, 'div', i);
			createdNew = true;
		}
	}

	if (!createdNew) {
		for (j + 1; j < sz(ls); j++) {
			ls[j].innerHTML = '';
		}
	}
}
/**
 * @description Строит основной вид таблицы
*/
DataGrid.prototype.getViewHeadersRowsDiv = function() {
	if (this.headerRows) {
		return this.headerRows;
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
	var i, ls = ee(td, 'div');
	for (i = 0; i < sz(ls); i++) {
		ls[i].innerHTML = '';
	}
	
	var td = this.getViewHeadersColumn();
	ls = ee(td, 'td');
	for (i = 0; i < sz(ls); i++) {
		ls[i].innerHTML = '';
	}
}


DataGrid.prototype.clearContent = function() {
	var ls = ee(this.mainTable, 'td'), i;
	for (i = 0; i < sz(ls); i++) {
		ls[i].innerHTML = '';
	}
}

DataGrid.prototype.setListeners = function() {
	var self = this;
	this._divMainTablePlace.addEventListener('scroll', function(evt){ self.onScroll(evt); });
	
	window.addEventListener('keydown',  function(evt){
		self.onKeyDownCell(evt);
	});
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

