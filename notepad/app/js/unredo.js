/**
 * TODO повесить на CtrlZ  и меню
 * @description  Действие отмены редактирования
*/
function undoAction() {
	var n = getEditorCurrentFile(),
		fileHistory = getFileHistory(n), prev;
	prev = fileHistory.prev();//TODO it FileHistory.prev() FileHistory - в отдельный файл
	if (prev) {
		setEditorContent(prev.s);
		setEditorCaretPosition(prev.p);
		fileHistory.pointer--;//TODO it указатель на состояние
	}
}
/**
 * TODO повесить на CtrlY и меню
 * @description  Действие повтора редактирования
*/
function redoAction() {
	var n = getEditorCurrentFile(),
		fileHistory = getFileHistory(n), next;
	next = fileHistory.next();//TODO it FileHistory.next()
	if (next) {
		setEditorContent(next.s);
		setEditorCaretPosition(next.p);
		fileHistory.pointer++;//TODO it указатель на состояние
	}
}
/**
 * @description  Инициализация массива и таймера сохраняющего состояние каждую секунду
*/
function initHistoryArray() {
	/** Массив состояний текста (для каждого открытого файла объект FileHistory) */
	SiEd.aUnredo = [];
	SiEd.unredoIval = setInterval(onSecondUnredo, 1000);
}
/**
 * @description  TODO Надо вызывать  при открытии файла (если он не открыт в другой вкладке)
*/
function onOpenFileUnredo() {
	var n = getEditorCurrentFile();
	//TODO подумать, не надо ли мне перезаписать (стереть) историю при переоткрытии. Сравнить с geany в том числе и тогда, когда файл переоткрыт из консоли
	if (!SiEd.aUnredo[n]) {
		SiEd.aUnredo[n] = new FileHistory(getEditorContent(), getEditorCaretPosition());
	}
}
/**
 * @description  Раз в секунду сравнивает контент файла с последним сохраненным и если он изменился, 
 * 				добавляет новый элемент (если не превышен лимит сохранений)
 * 				перезаписывает позицию курсора, емсли он изменилась
*/
function onSecondUnredo() {
	var n = getEditorCurrentFile(),
		fileHistory = getFileHistory(n);
	if (fileHistory.last().s != getEditorContent()) {//TODO FileHistory.last().s
		//TODO он не просто добавляет, если pointer смещен, очищаются все что после pointer и добавляется в конец
		fileHistory.addState();//TODO FileHistory.addState it use getEditorContent(), getEditorCaretPosition()
	} else if (fileHistory.last().p != getEditorCaretPosition()) {
		fileHistory.refreshLastState();//TODO it use getEditorCaretPosition()
	}
}
/**
 * @description Возвращает номер "таба", "вкладки" - элемента открытого файла
 * Номер не должен зависеть от порядка расположения вкладок. Он задается вкладке при её создании
 * Для simpleTextEditor всегда вернет 0
 * @return Number
*/
function getEditorCurrentFile() {
	return SiEd._currentTabeditor;
}
/**
 * @description Если в SiEd.aUnredo есть элемент под номером n вернет его. Если нет, создаст и вернет
 * @param {Number} n
 * @return FileHistory object
*/
function getFileHistory(n) {
	if (!SiEd.aUnredo[n]) {
		SiEd.aUnredo[n] = new FileHistory(getEditorContent(), getEditorCaretPosition());
	}
	return SiEd.aUnredo[n];
}
