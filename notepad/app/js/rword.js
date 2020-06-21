/**
 * @description api метод для вызова окна поиска. Определи вместо этого onCtrlF эсли что-то не устраивает
*/
function showReplaceWordApplet() {
	if (!window.oReplaceWordDialog) {
		window.oReplaceWordDialog = new replaceWordDialog();
	}
	oReplaceWordDialog.show();
}
/**
 * @class
*/
function replaceWordDialog() {
	/** @property PADDING - величина, на которую смещается вниз блок с полем ввода ( и с номерами линий и прочими штуками ( tabeditor.js::getEditoprBlock() ) ) */
	this.PADDING = '164px';
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
replaceWordDialog.prototype.setInactive = function() {
	this.hReplaceDlg.addClass('inactive');
}
/**
 * @description Делаем ярким при получении фокуса
*/
replaceWordDialog.prototype.setActive = function() {
	this.hReplaceDlg.removeClass('inactive');
}
/**
 * @description Добавляет на страницу окно поиска, инициализует все его контролы
*/
replaceWordDialog.prototype.createView = function() {
	var bd = $(document.getElementsByTagName('body')[0]);
	bd.append($(this.getWndTpl()));
	
	setCheckboxView();
	
	this.iFindWord 		= $('#iFindRWord');
	this.iReplaceWord 	= $('#iReplaceWord');
	this.bFindWord 		= $('#bFindRWord');
	this.bReplaceWord 		= $('#bReplaceWord');
	this.bReplaceAllWord	= $('#bReplaceAllWord');
	this.bCancel   			= $('#bRCancel');
	this.hReplaceDlg  			= $('#rinputdlgarea');
	this.bMatchCase  		= $('#bRMatchCase');
	
	this.iFindWord.bind('keydown', this.onKeyDown);	//закрывать по Escape
	this.bFindWord.bind('keydown', this.onKeyDown);
	this.hReplaceDlg.bind('keydown', this.onKeyDown);
	var o = this;
	this.hReplaceDlg.click(function(e){o.iFindWord.focus(); o.setActive();});
	this.bFindWord.click(this.onFindClick);
	this.bReplaceWord.click(this.onReplaceClick);
	this.bReplaceAllWord.click(this.onReplaceAllClick);
	this.bCancel.click(this.onCancelClick);
	this.iReplaceWord.click(function(e){e.preventDefault(); e.stopPropagation(); o.setActive();});
}
/**
 * @description Обработка нажатия кнопки Find
*/
replaceWordDialog.prototype.onFindClick = function(e){
	e.preventDefault();
	//это базовая функция определена в tabeditor.js
	/** @property {Number} _pos */
	oReplaceWordDialog._pos = setCaretOnFoundWord(oReplaceWordDialog.iFindWord.val(),
		oReplaceWordDialog.bMatchCase.prop('checked'),
		false, showReplaceDlg
	);
	return false;
}
/**
 * @description Обработка нажатия кнопки Replace
*/
replaceWordDialog.prototype.onReplaceClick = function(e){
	e.preventDefault();
	//это базовая функция определена в tabeditor.js
	replaceWordAndSetCaretOnFoundWord(
		oReplaceWordDialog.iFindWord.val(),
		oReplaceWordDialog.iReplaceWord.val(),
		oReplaceWordDialog._pos,
		oReplaceWordDialog.bMatchCase.prop('checked')
	);
	return false;
}
/**
 * @description Обработка нажатия кнопки Replace All
*/
replaceWordDialog.prototype.onReplaceAllClick = function(e) {
	e.preventDefault();
	//это базовая функция определена в tabeditor.js
	replaceAllWords(
		oReplaceWordDialog.iFindWord.val(),
		oReplaceWordDialog.iReplaceWord.val(),
		oReplaceWordDialog.bMatchCase.prop('checked')
	);
	return false;
}
/**
 * @description Обработка нажатия клавиши отмена
*/
replaceWordDialog.prototype.onCancelClick = function(e) {
	//console.log('sword.js onKeyDown:: code = ' + e.keyCode);
	var o = window.oReplaceWordDialog;
	o.hide();
}
/**
 * @description Обработка нажатия клавиш на диалоге
*/
replaceWordDialog.prototype.onKeyDown = function(e) {
	//console.log('sword.js onKeyDown:: code = ' + e.keyCode);
	var o = window.oReplaceWordDialog;
	if (e.keyCode == 27) {
		o.hide();
	}
	if (e.keyCode == 13) {
		e.preventDefault();
		setCaretOnFoundWord(window.oReplaceWordDialog.iFindWord.val());
		return false;
	}
}
/**
 * @description Скрываем диалог
*/
replaceWordDialog.prototype.hide = function(noAnim) {
	var o = this, top = '-166px';
	
	if (noAnim) {
		o.hReplaceDlg.css('top', top);
		getEditorBlock().css('margin-top', 0);
		getEditorBlock().css('height', o.sourceEditorHeight);
		getEditorBlock()[0].style.marginTop = null;
		getEditorBlock().focus();
		return;
	}
	o.hReplaceDlg.animate({'top': top, easing:'linear'});
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
replaceWordDialog.prototype.show = function() {
	//this.hReplaceDlg.css('top', '0px');
	var nTop = parseInt( this.hReplaceDlg.css('top') ), i;
	
	dbg('rword: ' + this.indexInDialogs);
	for (i = 0; i < SiEd.modalDialogs.length; i++) {
		if (i == this.indexInDialogs) {
			continue;
		}
		SiEd.modalDialogs[i].hide(1);
	}
	
	this.hReplaceDlg.animate({'top': '0px', easing:'linear'});
	if (nTop < 0) {
		var edBlock = getEditorBlock(),
			sH = edBlock.height(),
			tH = sH - parseInt(this.PADDING, 10);
		this.sourceEditorHeight = sH + 'px';
		edBlock.animate({'margin-top': this.PADDING, 'height': (tH + 'px'), easing:'linear'});
	}
	this.iFindWord.focus();
	this.setActive();
}
/**
 * @description Шаблон формы поиска и замены подстроки
*/
replaceWordDialog.prototype.getWndTpl = function() {
	var tpl = '<div id="rinputdlgarea">\
		<div>\
			<div class="bWrapTInput">\
				<label>' + L('Find') + ':\
					<input type="text" id="iFindRWord">\
				</label>\
			</div>\
			<div class="bWrapTInput">\
				<label>' + L('Replace') + ':\
					<input type="text" id="iReplaceWord">\
				</label>\
			</div>\
			<div class="bWrapRight">\
				<div class="iblock matchcaseblock" >\
					<input type="checkbox" id="bRMatchCase">\
					<div for="bRMatchCase" class="iblock chbView">&nbsp;</div><label for="bRMatchCase">' + L('Match case') + '</label>\
				</div>\
				<input type="button" id="bFindRWord" value="' + L('Find') + '">\
				<input type="button" id="bReplaceWord" value="' + L('Replace') + '">\
				<input type="button" id="bReplaceAllWord" value="' + L('Replace all') + '">\
				<input type="button" id="bRCancel" value="' + L('Cancel') + '">\
			</div>\
		</div>\
	\
	</div>';
	return tpl;
}
