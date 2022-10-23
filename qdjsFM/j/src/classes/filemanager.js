function FileManager() {
	var o = this;
	this.addContextMenuHtml();
	this.bookmarksManager = new Bookmarks();
	this.tabPanel = new TabPanel();
	this.sort = new Sort();
	window.app.sort = this.sort;
	this.fileHeader = new FileHeader();
	this.procManager = new ProcManager();
	AppEnv.init([this, this.onGetActualEnv], [this, this.onGetSavedEnv]);
	this.devicesManager = new Devices();
	this.devicesManager.run();
	this.setMainMenu();
	/*this.scrollIval = setInterval(function(){
		o.watchScrollX();
	}, 42);*/
	
	e('tabItems').onscroll = function(){
		o.actualizeScrollX();
	}
	this.kbListener = new KBListener();
}

/**
 * @param {String} path
 * @param {Array} aExcludes - идентификатор(ы) элементов управления, для которых не надо применять setPath
*/
FileManager.prototype.setActivePath = function(path, aExcludes) {
	var emitter = aExcludes[0];
	if (emitter != 'navbarPanelManager') {
		this.tab.navbarPanelManager.setPath(path);
	}
	if (emitter != 'tab') {
		this.tab.setPath(path);
	}
	if (emitter != 'bookmarksManager') {
		this.bookmarksManager.setPath(path);
	}
	if (emitter != 'devicesManager') {
		this.devicesManager.setPath(path);
	}
}

FileManager.prototype.initActiveTab = function() {
	window.tab = this.tab = this.tabPanel.getActiveTab();
}

/**
 * Вызывается когда получены последние данные об окружении AppEnv (USER, HOME и т. п)
*/
FileManager.prototype.onGetActualEnv = function() {
	if (!this.bookmarksManager.isRun()) {
		this.bookmarksManager.run();
		this.initActiveTab();
	} else {
		if (this.tab.getUser() != USER && USER != 'root') {
			this.bookmarksManager.setUser(USER);
			this.tab.setUser(USER);
			this.tab.setPath('/home/' + USER);
		}
	}
	this.procManager.run();
}


/**
 * TODO Вызывается когда получены предварительно сохраненные данные об окружении AppEnv (USER, HOME и т. п)
*/
FileManager.prototype.onGetSavedEnv = function() {
	//console.log(this);
	this.bookmarksManager.setUser(AppEnv.config.USER);
	this.bookmarksManager.run();
	this.initActiveTab();
}

/**
 * TODO Изменяет размеры кнопок "строки адреса"
 * TODO Изменяет размеры табов
*/
FileManager.prototype.onResize = function() {
	this.setTabWidths();
}
FileManager.prototype.setTabWidths = function() {
	e('tabContentHeaderDate').style.width = null;
	e('tabContentHeaderDate').style.minWidth = null;
	
	e('tabContentHeaderFileName').style.width = null;
	e('tabContentHeaderFileName').style.minWidth = null;
	var o = this;
	this.setColWidth(null, null);
	//setTimeout(function(){
		o.corectTabWidth();
	//}, 10);
	
}

FileManager.prototype.corectTabWidth = function() {
	var minDateTabW = 126, correct = 23, s, delta,
		dateColWidth,
		nameColWidth;
	if (
		intval(e('tabContentHeaders').style.minWidth) > intval(e('tabContentHeadersWr').style.width)
	) {
		var x = intval(e('tabContentHeaders').style.minWidth) - intval(e('tabContentHeadersWr').style.width);
		
		// надо выбрать из даты как можно больше, но чтобы оно стало не меньше чем необходимо для полного отображения даты.
		// 116, но возможно добавим.
		
		if (intval(e('tabContentHeaderDate').offsetWidth) - x > 116) {
			dateColWidth = (intval(e('tabContentHeaderDate').offsetWidth) - x);
			e('tabContentHeaderDate').style.width = dateColWidth + 'px';
			e('tabContentHeaderDate').style.minWidth = dateColWidth + 'px';
			this.setColWidth(nameColWidth, dateColWidth);
			return;
		}
		s = intval(e('tabContentHeaderDate').offsetWidth) - x;
		delta = minDateTabW - s;
		dateColWidth = minDateTabW;
		e('tabContentHeaderDate').style.width = minDateTabW + 'px';
		e('tabContentHeaderDate').style.minWidth = minDateTabW + 'px';
		x = delta + correct;
		
		// Остальное выбираем из таба с именем
		x = e('tabContentHeaderFileName').offsetWidth - x;
		nameColWidth = x;
		if (nameColWidth < 100) {
			nameColWidth = 100;
		}
		e('tabContentHeaderFileName').style.width = x + 'px';
		e('tabContentHeaderFileName').style.minWidth = x + 'px';
		this.setColWidth(nameColWidth, dateColWidth);
	} else {
		if (screen.width == 1024) {
			nameColWidth = 355;
			dateColWidth = 126;
			e('tabContentHeaderDate').style.width = dateColWidth + 'px';
			e('tabContentHeaderDate').style.minWidth = dateColWidth + 'px';
		
			e('tabContentHeaderFileName').style.width = nameColWidth + 'px';
			e('tabContentHeaderFileName').style.minWidth = nameColWidth + 'px';
			this.setColWidth(nameColWidth, dateColWidth);
		}
	}
}

FileManager.prototype.setColWidth = function(nameColWidth, dateColWidth) {
	try {
		this.setColNameWidth(nameColWidth);
		this.setColDateWidth(dateColWidth);
		this.actualizeScrollX();
	} catch(err) {
		alert(err);
	}
}

FileManager.prototype.setColNameWidth = function(nameColWidth) {
	var stl = '.tabContentItemNameMain {\
  width: {n}px!important;\
  max-width: {n}px!important;\
  min-width: {n}px!important;\
}',
	head, tagStyle;
	head = ee(document, 'head')[0];
	rm('styleNameCol');
	if (intval(nameColWidth) == 0) {
		return;
	}
	
	stl = stl.replace('{n}', nameColWidth);
	stl = stl.replace('{n}', nameColWidth);
	stl = stl.replace('{n}', nameColWidth);
   
    
    tagStyle = appendChild(head, 'style', stl, {
		"id": "styleNameCol"
	}, {});
}


FileManager.prototype.setColDateWidth = function(dateColWidth) {
	var stl = '.tabContentItemDate {\
	  width: {n}px!important;\
	  max-width: {n}px!important;\
	}',
	head, tagStyle;
	head = ee(document, 'head')[0];
	rm('styleDateCol');
	if (intval(dateColWidth) == 0) {
		return;
	}
	
	stl = stl.replace('{n}', dateColWidth);
	stl = stl.replace('{n}', dateColWidth);
   
    
    tagStyle = appendChild(head, 'style', stl, {
		"id": "styleDateCol"
	}, {});
}

FileManager.prototype.actualizeScrollX = function() {
	var x = e('tabItems').scrollLeft;
	if (x > 0) {
		x *= -1;
	}
	e('tabContentHeaders').style['margin-left'] = x + 'px';
}

/**
 * Set unconstant main menu items
*/
FileManager.prototype.setMainMenu = function() {
	var mode = intval(Settings.get('hMode')), text;
	if (1 === mode) {
		text = L('Hide hidden files Ctrl+H');
	} else {
		text = L('Show hidden files Ctrl+H');
	}
	Qt.renameMenuItem(1, 0, text);
}


FileManager.prototype.addContextMenuHtml = function() {
	var html = '<!-- context menu example -->\
		<div id="cmCatalog" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/open16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickOpenNewTab()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Открыть в новой вкладке</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickOpenNewWnd()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Открыть в новом окне</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickOpenTerm()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/sh16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть терминал</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSearch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/search16.png">\
					</div>\
					<div class="contextMenuItemText">Найти в этом каталоге</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		<!-- /context menu example -->\
		\
		<div id="cmImage" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		<div id="cmDocument" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		<div id="cmText" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		<div id="cmArch" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		<div id="cmWeb" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		\
		<div id="cmVideo" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		<div id="cmAudio" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		\
		\
		<div id="cmDefault" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickSendDesktop()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/desktop16.png">\
					</div>\
					<div class="contextMenuItemText">Отправить на рабочий стол ссылку</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCut()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cut16.png">\
					</div>\
					<div class="contextMenuItemText">Вырезать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCopy()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/copy16.png">\
					</div>\
					<div class="contextMenuItemText">Копировать</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/cross16.png">\
					</div>\
					<div class="contextMenuItemText">Удалить</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickRename()">\
					<div class="contextMenuItemIcon">\
						&nbsp;\
					</div>\
					<div class="contextMenuItemText">Переименовать</div>\
					<div class="cf"></div>\
				</div>\
				\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickCreateArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">Создать архив</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickProps()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pencil16.png">\
					</div>\
					<div class="contextMenuItemText">Свойства</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		<div id="cmEmptyCatalogArea" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpenTerm(1)">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/sh16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть терминал</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.tab.onClickNewFolder()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/folder_new16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Create catalog") + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickNewFile()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/filenew16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Create file") + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickPaste()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/pst16.png">\
					</div>\
					<div class="contextMenuItemText">Вставить</div>\
					<div class="cf"></div>\
				</div>\
				\
			</div>\
		</div>\
		<!-- Devices menu -->\
		<div id="cmDiskMenu" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/sh16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Open") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickMount()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/folder_new16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Mount device") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickUnmount()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/filenew16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Unmount device") + '</div>\
					<div class="cf"></div>\
				</div>\
			</div>\
		</div>\
		<div id="cmUsbMenu" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/sh16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Open") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickMount()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/folder_new16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Mount device") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickUnmount()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/filenew16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Unmount device") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.devicesManager.onClickEject()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/filenew16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Eject device") + '</div>\
					<div class="cf"></div>\
				</div>\
			</div>\
		</div>';
	ee(document, 'body')[0].innerHTML += html;
}
