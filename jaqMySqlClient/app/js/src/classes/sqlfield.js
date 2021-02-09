function SqlField(mediator) {
	this.mediator = mediator;
	this.SKEY = 'tEdit1Value';
    this.view = W.tEdit1;
    this.view.value = storage(this.SKEY);
    this.setListeners();
}

SqlField.prototype.setListeners = function () {
	var self = this;
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
					self.exec(self.view.value.trim());
					evt.preventDefault();
					this.mediator.dataGrid.clear();
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
