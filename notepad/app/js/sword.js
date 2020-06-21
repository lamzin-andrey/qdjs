/**
 * @description api метод для вызова окна поиска. Определи вместо этого onCtrlF эсли что-то не устраивает
*/
function showSearchWordApplet() {
	if (!window.oSearchWordDialog) {
		window.oSearchWordDialog = new searchWordDialog();
	}
	oSearchWordDialog.show();
}
/**
 * @class
*/
function searchWordDialog() {
	/** @property PADDING - величина, на которую смещается вниз блок с полем ввода ( и с номерами линий и прочими штуками ( tabeditor.js::getEditoprBlock() ) ) */
	this.PADDING = '84px';
	this.view = this.createView();
	if (!window.SiEd.modalDialogs) {
		window.SiEd.modalDialogs = [];
	}
	this.indexInDialogs = SiEd.modalDialogs.length;
	window.SiEd.modalDialogs.push(this);//чтобы редактор мог делать тебя неактивным при потере фокуса
}
/**
 * @description Делаем серым при потере фокуса
*/
searchWordDialog.prototype.setInactive = function() {
	this.hFindDlg.addClass('inactive');
}
/**
 * @description Делаем ярким при получении фокуса
*/
searchWordDialog.prototype.setActive = function() {
	this.hFindDlg.removeClass('inactive');
}
/**
 * @description Добавляет на страницу окно поиска, инициализует все его контролы
*/
searchWordDialog.prototype.createView = function() {
	var bd = $(document.getElementsByTagName('body')[0]);
	bd.append($(this.getWndTpl()));
	
	setCheckboxView();
	
	this.iFindWord = $('#iFindWord');
	this.bFindWord = $('#bFindWord');
	this.bFindWordPrev = $('#bFindWordPrev');
	this.bCancel   = $('#bCancel');
	this.hFindDlg  = $('#inputdlgarea');
	this.bMatchCase  = $('#bMatchCase');
	
	this.iFindWord.bind('keydown', this.onKeyDown);	//закрывать по Escape
	this.bFindWord.bind('keydown', this.onKeyDown);
	this.hFindDlg.bind('keydown', this.onKeyDown);
	var o = this;
	this.hFindDlg.click(function(e){o.iFindWord.focus(); o.setActive();});
	this.bFindWord.click(this.onFindClick);
	this.bFindWordPrev.click(this.onClickFindPrev);
	this.bCancel.click(this.onCancelClick);
}
/**
 * @description Обработка нажатия клавиши Find
*/
searchWordDialog.prototype.onFindClick = function(e){
	e.preventDefault();
	//это базовая функция определена в tabeditor.js
	setCaretOnFoundWord(window.oSearchWordDialog.iFindWord.val(), window.oSearchWordDialog.bMatchCase.prop('checked'));
	return false;
}
/**
 * @description Обработка нажатия клавиши Find
*/
searchWordDialog.prototype.onClickFindPrev = function(e){
	e.preventDefault();
	//это базовая функция определена в tabeditor.js
	setCaretOnFoundWord(window.oSearchWordDialog.iFindWord.val(), window.oSearchWordDialog.bMatchCase.prop('checked'), 1);
	return false;
}
/**
 * @description Обработка нажатия клавиши отмена
*/
searchWordDialog.prototype.onCancelClick = function(e) {
	//console.log('sword.js onKeyDown:: code = ' + e.keyCode);
	var o = window.oSearchWordDialog;
	o.hide();
}
/**
 * @description Обработка нажатия клавиш на диалоге
*/
searchWordDialog.prototype.onKeyDown = function(e) {
	//console.log('sword.js onKeyDown:: code = ' + e.keyCode);
	var o = window.oSearchWordDialog;
	if (e.keyCode == 27) {
		o.hide();
	}
	if (e.keyCode == 13) {
		e.preventDefault();
		setCaretOnFoundWord(window.oSearchWordDialog.iFindWord.val());
		return false;
	}
}
/**
 * @description Скрываем диалог
*/
searchWordDialog.prototype.hide = function(noAnim) {
	var o = this, top = '-86px';
	if (noAnim) {
		o.hFindDlg.css('top', top);
		getEditorBlock().css('margin-top', 0);
		getEditorBlock().css('height', o.sourceEditorHeight);
		getEditorBlock()[0].style.marginTop = null;
		getEditorBlock().focus();
		return;
	}
	o.hFindDlg.animate({'top': top, easing:'linear'});
	getEditorBlock().animate({'margin-top': 0, 'height':o.sourceEditorHeight,easing:'linear'}, {
		complete:function() {
			getEditorBlock()[0].style.marginTop = null;
			getEditorBlock().focus();
		}
	});
}
/**
 * @description ПОказываем диалог
*/
searchWordDialog.prototype.show = function() {
	//this.hFindDlg.css('top', '0px');
	var nTop = parseInt( this.hFindDlg.css('top') ), i;
	
	dbg('sword: ' + this.indexInDialogs);
	for (i = 0; i < SiEd.modalDialogs.length; i++) {
		if (i == this.indexInDialogs) {
			continue;
		}
		SiEd.modalDialogs[i].hide(1);
	}
	
	this.hFindDlg.animate({'top': '0px', easing:'linear'});
	if (nTop < 0) {
		var edBlock = getEditorBlock(),
			sH = edBlock.height(),
			tH = sH - parseInt(this.PADDING, 10);
		this.sourceEditorHeight = sH + 'px';
		edBlock.animate({'margin-top': this.PADDING, 'height': (tH + 'px'), easing:'linear'});
	}
	this.iFindWord.focus();
	this.setActive();
	//TODO сдвигать textarea вниз
	//TODO анимация если хочется
}
/**
 * @description Шаблон формы поиска подстроки
*/
searchWordDialog.prototype.getWndTpl = function() {
	var tpl = '<div id="inputdlgarea">\
		<div>\
			<input type="text" id="iFindWord">\
			<div class="bWrapRight">\
				<div class="iblock matchcaseblock" >\
					<input type="checkbox" id="bMatchCase">\
					<div for="bMatchCase" class="iblock chbView">&nbsp;</div><label for="bMatchCase">' + L('Match case') + '</label>\
				</div>\
				<input type="button" id="bFindWordPrev" value="' + L('Find previous') + '">\
				<input type="button" id="bFindWord" value="' + L('Find next') + '">\
				<input type="button" id="bCancel" value="' + L('Cancel') + '">\
			</div>\
		</div>\
	\
	</div>';
	return tpl;
}
