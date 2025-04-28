function InsertFromSelect() {}
InsertFromSelect.prototype.input = function(){
	var s = prompt(L("Enter table name")), sql;
	if (!s) {
		alert(L("Need enter table name"));
		return;
	}
	sql = "SELECT * FROM " + s + " LIMIT 1";
	W.modeInsertFromSelectProcess = true;
	W.modeInsertFromSelectProcessTableName = s;
	setStatusText(L("Build query..."));
	W.sqlField.exec(sql);
}
InsertFromSelect.prototype.process = function(data){
	var row, tpl, aF = [], i, r;
	W.modeInsertFromSelectProcess = false;
	
	if (data.status == 'error') {
		alert(data.msg);
		W.modeInsertFromSelectProcessTableName = '';
		return;
	}
	
	if (data.n == 0) {
		alert(L("Need table with one or more rows"));
		W.modeInsertFromSelectProcessTableName = '';
		return;
	}
	row = data.rows[0];
	tpl = "INSERT INTO {table2} ({fieldList})\n\
SELECT {fieldList}\n\
FROM   {table1};";
	for (i in row) {
		if (i == 'id') {
			continue;
		}
		aF.push('`' + i + '`');
	}
	
	r = tpl.replace('{table2}', W.modeInsertFromSelectProcessTableName + '__tmp');
	r = r.replace('{fieldList}', aF.join(',\n'));
	r = r.replace('{fieldList}', aF.join(',\n'));
	r = r.replace('{table1}', W.modeInsertFromSelectProcessTableName);
	
	
	W.tEdit1.value = r + '\n\n' + W.tEdit1.value;
	
	W.modeInsertFromSelectProcessTableName = '';
	W.tEdit1.focus();
	setStatusText(L("Done"));
	W.colorTa.buildText();
	W.colorTa.onInput();
}


