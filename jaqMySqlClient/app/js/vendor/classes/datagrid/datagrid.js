function DataGrid(blockId) {
	this.viewContainer = e(blockId);
	this.mainTableNumCols = 0;
	this.mainTableNumRows = 0;
	this.initalizeView();
}


/**
 * TODO продолжить
 * @description  Заполняет таблицу пустыми значениями чтобы установить динамические стили.
*/
DataGrid.prototype.initalizeView = function() {
	var N = 100, i, arr = [];
	for (i = 0; i < N; i++) {
		arr.push((i + 1));
	}
	this.setColumnHeaders(arr);
	this.setRowHeadersByRange(1, N + 1);
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
			this.setCellContent(dataRow[i], cells, i, rowIndex);
		}
	} else {
		for (i in dataRow) {
			this.setCellContent(dataRow[i], cells, j, rowIndex);
			j++;
		}
	}
}

DataGrid.prototype.setCellContent = function(value, cells, i, rowIndex) {
	var td;
	if (cells[i]) {
		td = cells[i];
		td.innerHTML = value;
	} else {
		td = appendChild(cells, 'td', value, {id: ('c' + rowIndex + '_' + i)});
		this.setCellListeners(td);//TODO define it хотя бы
	}
}
DataGrid.prototype.setRowContent = function(dataRow, mainTableRows, i) {
	var tr;
	if (mainTableRows[i]) {
		tr = mainTableRows[i];
	} else {
		tr = appendChild(this.mainTable, 'tr');
	}
	this.setRowValues(rows[i], tr, i);
}
/**
 * @param {Array} columnHeaders
*/
DataGrid.prototype.setColumnHeaders = function(columnHeaders) {
	var tr = this.getViewHeadersColumn(),
		i, createdNew = false,
		ls = tr.getElementsByTagName('td');
	for (i = 0; i < sz(columnHeaders); i++) {
		if (ls[i]) {
			ls[i].innerHTML = columnHeaders[i];
		} else {
			appendChild(tr, 'td', columnHeaders[i]);
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
	this.headerTable = appendChild(this.headerDiv, 'table', '');
	this.headerColumn = appendChild(this.headerTable, 'tr', '', {'class': 'tableHeader'});
	
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
			appendChild(tr, 'div', i);
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
	var left = appendChild(tr, 'td', '');
	var right = appendChild(tr, 'td', '');
	this.headerRows = appendChild(left, 'div', '', {'class': 'vScrollHidden'});		//TODO getter
	this._divMainTablePlace = appendChild(right, 'div', '', {'class': 'scroll'});  // TODO getter
	this.mainTable = appendChild(this._divMainTablePlace, 'table', '');
	
	return this.headerRows;
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
}
