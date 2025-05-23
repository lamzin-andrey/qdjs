function ContextMenuContent() {
	this.name = "ContxtMenuContent";
}

ContextMenuContent.prototype.getHtmlTabMenuHtml = function() {
	var html = '\
		<div id="cmTabHtml" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tabPanel.onClickUtf8()">\
					<div class="contextMenuItemIcon">\
					</div>\
					<div class="contextMenuItemText">' + L("Encoding")  + " UTF-8" + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tabPanel.onClickWindows1251()">\
					<div class="contextMenuItemIcon">\
					</div>\
					<div class="contextMenuItemText">' + L("Encoding")  + " Windows-1251" + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tabPanel.onClickKOI8R()">\
					<div class="contextMenuItemIcon">\
					</div>\
					<div class="contextMenuItemText">' + L("Encoding")  + " KOI8-R" + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tabPanel.onClickOther()">\
					<div class="contextMenuItemIcon">\
					</div>\
					<div class="contextMenuItemText">' + L("Other")   + '</div>\
					<div class="cf"></div>\
				</div>\
		</div>';
		return html;
}

ContextMenuContent.prototype.getWebItemMenuHtml = function() {
	var html = '\
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
				<div class="contextMenuItem" onclick="app.tab.onClickOpenWebNewTab()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/web22.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Open in new tab") + '</div>\
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
		
	return html;
}

ContextMenuContent.prototype.getDeviceItemMenuHtml = function() {
	var html = '\
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
				<div class="contextMenuItem" onclick="app.devicesManager.onClickFixHibernated()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/filenew16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Fix windows hibernated") + '</div>\
					<div class="cf"></div>\
				</div>\
			</div>\
		</div>';
		
	return html;
}

ContextMenuContent.prototype.getBookmarkItemMenuHtml = function() {
	var html = '\
		<!-- User Bookmark menu -->\
		<div id="cmBmMenu" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/sh16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Open") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickOpenInTerm()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/sh16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Open terminal") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickRemove()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/folder_new16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Remove bookmark") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickRename()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/filenew16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Rename bookmark") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickUp()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/up22.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Move up") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickDown()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/down22.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Move down") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickExportBookmarks()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/saveAll22.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Export bookmarks") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickImportBookmarks()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/undo22.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Import bookmarks") + '</div>\
					<div class="cf"></div>\
				</div>\
			</div>\
		</div>\
		<!-- System Bookmark menu -->\
		<div id="cmBmSysMenu" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<!--img src="./i/cm/sh16.png"-->\
					</div>\
					<div class="contextMenuItemText">' + L("Open") + '</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.bookmarksManager.onClickOpenInTerm()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/sh16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Open terminal") + '</div>\
					<div class="cf"></div>\
				</div>\
			</div>\
		</div>';
	return html;
}

ContextMenuContent.prototype.getCatalogMenuHtml = function() {
	var html = '\
		<!-- context menu example -->\
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
					<div class="contextMenuItemText">' + L("Open in new tab") + '</div>\
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
					<div class="contextMenuItemText">' + L("Send link to desktop") + '</div>\
					<div class="cf"></div>\
				</div>\
				\
				<div class="contextMenuItem" onclick="app.tab.onClickAddBookmark()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/folderStar16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Add bookmark") + '</div>\
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
					<div class="contextMenuItemText">' + L("Create tar.gz") + '</div>\
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
		';
		return html;
}

ContextMenuContent.prototype.getArjItemMenuHtml = function() {
	var html = '<div id="cmArch" style="display:none">\
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
				<div class="contextMenuItem" onclick="app.tab.onClickExtractArch()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/arch+16.png">\
					</div>\
					<div class="contextMenuItemText">' + L("Extract files") + '</div>\
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
		
		return html;
}




ContextMenuContent.prototype.getSearchResultItemMenuHtml = function() {
	var html = '<div id="cmSR" style="display:none">\
			<div class="contextMenu">\
				<div class="contextMenuItem" onclick="app.tab.onClickOpen()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть</div>\
					<div class="cf"></div>\
				</div>\
				<div class="contextMenuItem" onclick="app.tab.onClickOpenContainingFolder()">\
					<div class="contextMenuItemIcon">\
						<img src="./i/cm/exec16.png">\
					</div>\
					<div class="contextMenuItemText">Открыть содержащую объект папку</div>\
					<div class="cf"></div>\
				</div>\
				\
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
		
		return html;
}
