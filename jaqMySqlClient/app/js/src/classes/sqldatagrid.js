/**
 * @depends from datagrid.js
*/
function SqlDataGrid(blockId) {
	this.dataGrid = new DataGrid(blockId);
}

SqlDataGrid.prototype.set = function(rows, n) {
	var columnHeaders = this.getColumnHeaders(rows);
	this.clear();
	this.dataGrid.setColumnHeaders(columnHeaders);
	this.dataGrid.setRowHeadersByRange(1, n + 1);
	
	this.dataGrid.setContent(rows);//TODO
}

SqlDataGrid.prototype.getColumnHeadersFromRow = function(row) {
	var i, r = [];
	for (i in row) {
		r.push(i);
	}
	
	return r;
}

SqlDataGrid.prototype.getColumnHeaders = function(rows) {
	var i;
	if (rows instanceof Array) {
		for (i = 0; i < 2; i++) {
			return this.getColumnHeadersFromRow(rows[i]);
		}
	}
	
	for (i in rows) {
		return this.getColumnHeadersFromRow(rows[i]);
	}
	
	return [];
	
}

SqlDataGrid.prototype.clear = function() {
	this.dataGrid.clearHeaders();
	this.dataGrid.clearContent();
}

SqlDataGrid.prototype.setListeners = function() {
	var self = this;
    
}

SqlDataGrid.prototype.setScrollBars = function() {
	this.dataGrid.setScrollBars();
}

