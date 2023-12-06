/**
 * @depends from datagrid.js
*/
function SqlDataGrid(blockId) {
	this.dataGrid = new DataGrid(blockId);
	this.dataGrid.onChangeCellData = [this, this.onChangeCellData];
}

SqlDataGrid.prototype.set = function(rows, n) {
	var columnHeaders = this.getColumnHeaders(rows);
	this.clear();
	this.dataGrid.setColumnHeaders(columnHeaders);
	this.dataGrid.setRowHeadersByRange(1, n);
	
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

/**
 * @param {Boolean} bValue
*/
SqlDataGrid.prototype.setIsFocused = function(bValue) {
	this.dataGrid.isFocused = bValue;
}

/**
 * @param {Boolean} bValue
*/
SqlDataGrid.prototype.onChangeCellData = function(val, y, x) {
	// alert(val + ', ' + y + ',' + x);
	// alert(window.sqlField.lastExecuteSql);
	var updateSqlData = this.parseSql(window.sqlField.lastExecuteSql, val),
		table, idFieldName, idVal, upSql, editFieldName;
	if (updateSqlData.ok) {
		idVal = updateSqlData.idVal;
		table = updateSqlData.table;
		editFieldName = updateSqlData.editFieldName;
		idFieldName = updateSqlData.idFieldName;
		upSql = "UPDATE " + table + " SET " + editFieldName + " = '" + val + "' WHERE " + idFieldName + " = '" + idVal + "';";
		
		window.colorTa.skipLineStatus = 1;
		setStatusText(L('Run query...'));
		window.sqlField.exec(upSql);
	}
}

/**
 * @param {String} lastExecuteSql
 * @param {String} newVal
 * @return {
 * 	ok: Boolean,
 *  idVal: String,
 *  table: String,
 *  editFieldName: String
 * }
*/
SqlDataGrid.prototype.parseSql = function(lastExecuteSql, newVal) {
	var r = {};
	lastExecuteSql = lastExecuteSql.toLowerCase();
	if (!~lastExecuteSql.indexOf('join')) {
		return r;
	}
	if (
		!~lastExecuteSql.indexOf('id,') 
		&& !~lastExecuteSql.indexOf(', id')
		&& !~lastExecuteSql.indexOf(' id')
	) {
		return r;
	}
	
}
