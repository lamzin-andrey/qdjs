/**
 * Handlers:
 * onStartLoadDikList()
*/
function DiskListController(htmlBlock, usbIconPath, usbIconUPath, diskIconPath, diskIconUPath) {
	this.SKEY = 'diskControllerListStorageKey';
	this.usbIconPath = usbIconPath;
	this.usbIconUPath = usbIconUPath;
	this.diskIconPath = diskIconPath;
	this.diskIconUPath = diskIconUPath;
    this.view = htmlBlock;
    this.setListeners();
    this.diskList = new DiskList();
    this.diskList.onBuild = {
		m: this.onBuildComplete,
		context: this
	};
    this.items = [];
}

DiskListController.prototype.build = function () {
	var ls = this.loadCache();
	this.draw(ls);
	this.emitProcesLoadEvent();
	this.diskList.load();
}

DiskListController.prototype.onBuildComplete = function(ls) {
	
	var sZ = 0, i;
	for (i = 0; i < sz(ls); i++) {
		if (ls[i].isUsb == 1) {
			sZ++;
		}
	}
	
	if (!sZ) {
		e('shoreHelp').innerHTML = 'Попробуйте сначала примонтировать флешку';
	}
	storage(this.SKEY, ls);
	this.draw(ls);
	this.emitProcesLoadEventEnd();
}

DiskListController.prototype.emitProcesLoadEventEnd = function () {
	// alert('emitProcesLoadEventEnd!');
	if (this.onProcesLoadEventEnd && (this.onProcesLoadEventEnd.m instanceof Function) ) {
		
		this.onProcesLoadEventEnd.m.call(this.onProcesLoadEventEnd.context);
	} else {
		alert('You must set handler diskListController.onProcesLoadEventEnd = {m, context}');
	}
}

DiskListController.prototype.emitProcesLoadEvent = function () {
	// alert('emitProcesLoadEvent!');
	if (this.onProcesLoadEvent && (this.onProcesLoadEvent.m instanceof Function) ) {
		// if (!this.loadProcessFinished ) {
			this.onProcesLoadEvent.m.call(this.onProcesLoadEvent.context);
		//}
	} else {
		alert('You must set handler diskListController.onProcesLoadEvent = {m, context}');
	}
}
DiskListController.prototype.draw = function (list) {
	var i, item, icon, tpl = '<img src="{path}">\
					<span>{name}</span>',
		s, vItem, editArea;
	this.view.innerHTML = '';
	for (i in list) {
		item = list[i];
		if (item.isUsb) {
			if (item.isMounted) {
				s = tpl.replace('{path}', this.usbIconPath);
			} else {
				s = tpl.replace('{path}', this.usbIconUPath);
			}
			
			// Пока показываю только флешки
			s = s.replace('{name}', item.name);
			vItem = appendChild(this.view, 'div', s);
			editArea = ee(vItem, 'span')[0];
			this.items.push(new ClickEditElementController(editArea, item.name, item));
			
		} else {
			if (item.isMounted) {
				s = tpl.replace('{path}', this.diskIconPath);
			} else {
				s = tpl.replace('{path}', this.diskIconUPath);
			}
		}
		/*
		 *  Пока показываю только флешки
		 * s = s.replace('{name}', item.name);
		vItem = appendChild(this.view, 'div', s);
		editArea = ee(vItem, 'span')[0];
		this.items.push(new ClickEditElementController(editArea, item.name, item));
		*/
	}
}

DiskListController.prototype.onFinExecuteRename = function (output, errors) {
	//alert(output);
	if (errors) {
		alert(errors);
		// alert( String(errors).indexOf('mlabel:') );
		if (errors.indexOf('mlabel:') != -1) {
			alert('Try execute in terminal command sudo apt-get install mtools');
		}
	}
	this.emitProcesLoadEvent();
	this.diskList.load();
}


DiskListController.prototype.loadCache = function () {
	/*return [
		{
			name: 'C',
			isMounted: 1,
			isUsb: 0
		},
		{
			name: 'D',
			isMounted: 0,
			isUsb: 0
		},
		{
			name: 'K',
			isMounted: 1,
			isUsb: 1
		},
		{
			name: 'F',
			isMounted: 0,
			isUsb: 1
		}
	];*/
	return storage(this.SKEY);
}

DiskListController.prototype.setListeners = function () {
	
}
DiskListController.prototype.setListeners = function () {
	
}



DiskListController.prototype.setListeners = function () {
	
}

DiskListController.prototype.onKeyDown = function(e) {
	
}

DiskListController.prototype.exec = function(sql) {
	PHP.file_put_contents(Qt.appDir() + '/p/command.sql', sql);
	PHP.exec('php ' + Qt.appDir() + '/p/query.php', 'DiskListController_onFin', 'Null', 'Null');
}


function DiskListController_onFin(stdout, stderr) {
	
}
