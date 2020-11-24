function DataGrid(blockId) {
	this.viewContainer = e(blockId);
	
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
	if (this.headerRow) {
		return this.headerRow;
	}
	this.headerTable = appendChild(this.viewContainer, 'table', '');
	this.headerRow = appendChild(this.headerTable, 'tr', '', {'class': 'tableHeader'});
	
	return this.headerRow;
}

DataGrid.prototype.setRowHeadersByRange = function(first, last) {
	var td = this.getViewHeadersRowsTable();//TODO create or return exists table td(div) td(div)
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

DataGrid.prototype.clearHeaders = function() {
}

DataGrid.prototype.clearContent = function() {
}

DataGrid.prototype.setListeners = function() {
	var self = this;
}
