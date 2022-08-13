function FileManager() {
	this.addContextMenuHtml();
	this.bookmarksManager = new Bookmarks();
	this.tabPanel = new TabPanel();
	// this.procManager = new ProcManager();
	AppEnv.init([this, this.onGetActualEnv], [this, this.onGetSavedEnv]);
	this.devicesManager = new Devices();
	this.devicesManager.run();
	this.setMainMenu();
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
		}
	}
	// this.procManager.run();
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
		</div>';
	ee(document, 'body')[0].innerHTML += html;
}
