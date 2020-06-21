var PATH_SEPARATOR = '/',
	APP_NAME	= 'jaqNotepad';
function initJaqEditorApp() {
	setWndLayout();
}
/**
 * @description устанволивает высоту редактора, чтобы не было горизонтального скроллбара в окне и была видна полоса статуса и все такое прочее
*/
function setWndLayout() {
	var h = getViewport().h - $('#hStatusbar').height() - 9;
	console.log( $('#hStatusbar').height() + ' = h');
	getEditorBlock().height(h);
}
window.onresize = function() {
	setWndLayout();
}
function setBlackMode() {
	$(document.body).addClass('night');
}
function setWhiteMode() {
	$(document.body).removeClass('night');
}
