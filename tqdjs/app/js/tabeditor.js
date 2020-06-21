//============Простой редактор кода=====================================
	/**
	 * Установка позиции курсора в текстовом поле
	**/
	function setCaretPosition(ta, pos)  {
		var input = ta;
		if (input.readOnly) return;	
		if (input.value == "") return;	
		if ((!pos)&&(pos !== 0)) return;
		var f = 0;
		try {f = input.setSelectionRange;}
		catch(e){;}
		if(f)	{
			input.focus();		
			try{
				input.setSelectionRange(pos,pos);
			}catch(e){
				//если находится в контейнере с style="display:none" выдает ошибку
			}
		}else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
	/**
	 * Получение позиции курсора в текстовом поле
	**/
	function getCaretPosition(ta)  {
		var input = ta;
		var pos = 0;
		// IE Support
		if (document.selection) {		
			if (input.value.length == 0) return 0;
			ta.focus();
			var sel = document.selection.createRange();
			var clone  = sel.duplicate();
			sel.collapse(true);
			clone.moveToElementText(ta);
			clone.setEndPoint('EndToEnd', sel);
			return (clone.text.length);
			/*input.focus();
			var sel = document.selection.createRange();
			var n = sel.moveStart ('character', -1*input.value.length);
			sel.collapse(true);
			alert(n);
			pos = sel.text.length;
			alert(pos);*/
		}
		// Firefox support
		else if (input.selectionStart || input.selectionStart == '0'){
			pos = input.selectionStart;		
		}
		return pos;
	}
	function initSampleTextEditor()  {
		var mid = '#ta',
			fileId = -1,
			fileDisplayName = '',
			lastTimeLoadFileClick = 0,
			maxEditorHeight = false,
			ContentFunctions = {globals:{}},
			DefaultContentFunctions = _getStdMethods();
		window.SiEd = {};
		if (!$(mid)[0]) {
			return;
		}
		function showTextCursorCoord() {
			var p = getCaretPosition($(mid)[0]),
				s = $(mid).val(), i, res = {x:1, y:1};
				
			for(i = 0; i < p; i++){
				if (s.charAt(i) == '\n') {
					res.y++;
					res.x = 1;
					continue;
				}
				res.x++;
			}
			$('#qsline').text(res.y);
			$('#qscol').text(res.x);
			lines(s, res.y);
			return {p:p, s:s};
		}
		function lines(s, n){
			var total = s.split('\n').length, i = 0,
				div = $('#qseLines'), css, h;
			div.html('');
			for (i; i < total; i++) {
				if ((i + 1) == n) {
					css = 'qse_l qse_la';
				} else {
					css = 'qse_l';
				}
				div.append( $('<div class="' + css + '">' + (i + 1) + '</div>') );
			}
			
			h = ($('#qs_editor_s').height() + 5) + 'px';
			//$('#qseLineWrapper').css('max-height', h);
			//$('#qseLines')[0].style.top = (-1 * $('#qs_editor_s')[0].scrollTop) + 'px';
			if ($('#tabhook')[0]) {
				$('#tabhook')[0].style.height = h;
				$('#tabhook')[0].style.top = $('#qseLines')[0].offsetHeight;
			}
		}
		function onKeyDown(e) {
			//Контроль Tab клавиши
			if (e.keyCode == 9) {
				var ta = this, pos = getCaretPosition(ta),
					s = ta.value, tail, q,
				corr = 0;
				if (window.navigator.userAgent.toLowerCase().indexOf('msie') != -1 && s.charAt(pos) == '\n') {
					corr = 1;
				}
				if (pos) {
					q = s.substring(0, pos + corr);
					tail = s.substring(pos + corr, s.length);
					s = q + "\t" + tail;
				} else {
					s += "\t";
				}
				ta.value = s;
				setTimeout(
					function () {
						if (pos) {
							setCaretPosition(ta, pos + 1 + corr);
						} else {
							ta.focus();
						}
						setMenuIconState();
					}
					, 10
				);
				return true;
			} else if (e.keyCode == 13) {//Enter
				setTimeout(
					function () {
						showTextCursorCoord();
					}
					, 10
				);
				var ta = this, pos = getCaretPosition(ta),
					s = ta.value, tail, q, spaces = '', i, j = 0;
				if (pos) {
					for (i = pos - 1; i > -1; i--) {
						if (s.charAt(i) == '\n') {
							j = i + 1;
							break;
						}
					}
					//console.log('j = ' + j + ', pos = ' + pos);
					for (i = j; i < pos; i++) {
						if (s.charAt(i) == '\t' || s.charAt(i) == ' ') {
							spaces += s.charAt(i);
						} else {
							break;
						}
					}
					//console.log('sp = "' + spaces + '"');
					q = s.substring(0, pos);
					tail = s.substring(pos, s.length);
					s = q + "\n" + spaces + tail;
				} else {
					s += "\n";
				}
				ta.value = s;
				setCaretPosition(ta, pos + 1 + spaces.length);
				return false;
			} else if (e.keyCode == 68 && e.ctrlKey == true) {//Ctrl + D
				var ta = this, pos = getCaretPosition(ta),
					s = ta.value, tail, q, spaces = '', i, j = 0;
				if (pos) {
					for (i = pos - 1; i > -1; i--) {
						if (s.charAt(i) == '\n') {
							j = i + 1;
							break;
						}
					}
					//console.log('j = ' + j + ', pos = ' + pos);
					for (i = j; i < pos; i++) {
						spaces += s.charAt(i);
					}
					//console.log('sp = "' + spaces + '"');
					q = s.substring(0, pos);
					tail = s.substring(pos, s.length);
					
					s = q + "\n" + spaces + tail;
				} else {
					s += "\n";
				}
				ta.value = s;
				setCaretPosition(ta, pos + 1 + spaces.length);
				return false;
			} else if (e.keyCode == 83 && e.ctrlKey == true) {//Ctrl + S
				saveNow();
				return false;
			}
			else {
				//console.log(e);
				setTimeout(
					function () {
						setMenuIconState();
						var data = showTextCursorCoord();
						showCodeHint(data);
					}
					, 10
				);
			}
		}
		/**
		 * @desc Контроль состояния иконок
		**/
		function setMenuIconState() {return;//TODO
			function setIconSaveState() {
				if (!localStorage) {
					alert(lang['get_actual_browser']);
					return;
				}
				var lastText = localStorage.getItem('qsLastSavedText');
				if ($(mid).val() != lastText) {
					$("#qsEditorSave").css('cursor', 'pointer').attr("src", WEB_ROOT + "/img/save.png")[0].onclick=saveNow;
				} else {
					$("#qsEditorSave").css('cursor', 'default').attr("src", WEB_ROOT + "/img/save_d.png")[0].onclick=null;
				}
			}
			setIconSaveState();
			//setIconSaveAsState();
		}
		//Сохранение файла
		function saveNow() {return;//TODO
			function onFailSaveFile() {
				showError(lang['fail_save_file_try_again']);
			}
			function onSaveFile(data) {
				if (data.status == 'ok') {
					localStorage.setItem('qsLastSavedText', data.text);
					$("#qsEditorSave").css('cursor', 'default').attr("src", WEB_ROOT + "/img/save_d.png")[0].onclick = null;
				} else {
					if (data.requiredFilename != 1) {
						showError(data.msg);
					} else {
						appWindow('saveScriptFormWrapper', lang['information']);
					}
				}
				buildFunctionList();
			}
			if (fileId == -1) {
				try {
					var F = eval('(' + $(mid).val() + ')');
					$('#scriptFileNameQs').val(F.name);
					if (!F.name) {
						var name = F.toString().match(/^function\s*([^\s(]+)/)[1];
						$('#scriptFileNameQs').val(name);
					}
				} catch(e) {
					showError(lang['unable_get_function_name_check_code']);
					return;
				}
				appWindow('saveScriptFormWrapper', lang['information']);
			} else if(localStorage.getItem('qsLastSavedText') != $(mid).val()){
				//alert( 'store = |' + localStorage.getItem('qsLastSavedText') + '|, mval=|' +  $(mid).val()  + '|');
				try {
					var F = eval('(' + $(mid).val() + ')');
					if (!F.name) {
						var name = F.toString().match(/^function\s*([^\s(]+)/)[1];
						if (!name) {
							showError(lang['unable_get_function_name_check_code']);
							return;
						}
					}
				} catch(e) {
					showError(lang['unable_get_function_name_check_code']);
					return;
				}
				req({id:fileId, val:$(mid).val()}, onSaveFile, onFailSaveFile, 'saveFile', WEB_ROOT + '/editor/');
			} else {
				$("#qsEditorSave").css('cursor', 'default').attr("src", WEB_ROOT + "/img/save_d.png")[0].onclick=null;
			}
			return false;
		}
		//Save as , fail
		function onFailSaveNew() {
			showError(lang['fail_save_user_script_try_update']);//TODO lang
		}
		//Save as, success
		function onSaveNew(d) {//TODO return;
			
		}
		//Сохранить как, клик на иконке
		function showSaveAs() {console.log('showOPenFileDialog'); return; //TODO;
			fileId = -1;
			fileDisplayName = '';
			$('#scriptFileNameQs').val('');
			$('#scriptDisplayNameQs').val('');
			appWindow('saveScriptFormWrapper', lang['information']);
		}
		//Сохранить как, отправка формы
		function sendSaveAs(evt) {console.log('showOPenFileDialog'); return //TODO;
			if (evt.target.id == 'scriptDisplayNameQs' && evt.keyCode != 13) {
				return true;
			}
			if (!guid && !uid) {
				showError(lang['fail_save_user_script_try_update']);
				return false;
			}
			try {
				var F = eval('(' + $(mid).val() + ')');
				$('#scriptFileNameQs').val(F.name);
			} catch(e) {
				showError(lang['main_function_require']);
				return false;
			}
			if (!F.name) {
				var name = F.toString().match(/^function\s*([^\s(]+)/)[1];
				$('#scriptFileNameQs').val(name);
			}
			if (!$('#scriptFileNameQs').val()) {
				showError(lang['main_function_require']);
				return false;
			}
			req({fileName: $('#scriptFileNameQs').val(), display:$('#scriptDisplayNameQs').val(), content:$(mid).val()}, onSaveNew, onFailSaveNew, 'saveFileAs', WEB_ROOT + '/editor/');
			return false;
		}
		//
		function onKeyUp() {
			//Сохранение в localStorage
			localStorage.setItem('qsLastText', $(mid).val());
			//позиция курсора
			showTextCursorCoord();
		}
		function showOpenFileDlg() {console.log('showOPenFileDialog'); return; //TODO 
			function onFailLoadUserFiles() {
				showError(lang["unable_load_file_list_try_later"]);
				appWindowClose();
			}
			function loadFileContent() {console.log('file content was loaded'); return; //TODO
				$(mid).val(PHP.file_get_contents());//TODO
			}
		}
		
		
		//Инициализация
		$(mid).keydown(onKeyDown);
		$(mid).keyup(onKeyUp);
		$(mid).click(setMenuIconState);
		$(mid).click(showTextCursorCoord);
		//TODO
		$('#scriptFileQsButton').click(sendSaveAs);
		$('#scriptDisplayNameQs').keydown(sendSaveAs);
		$('#qsEditorSaveAs').click(showSaveAs);
		$('#qsEditorOpenFile').click(showOpenFileDlg);
		$('#qsEditorSetPro').click(showProjectSettingDlg);
		//TODO
		
		//Загрузка последнего содержимого
		if (localStorage.getItem('qsLastText')) {
			$(mid).val( localStorage.getItem('qsLastText') );
			setMenuIconState();
			showTextCursorCoord();
			if(localStorage.getItem('fileId')) {
				fileId = localStorage.getItem('fileId');
			}
			if(localStorage.getItem('fileDisplayName')) {
				fileDisplayName = localStorage.getItem('fileDisplayName');
				$('#currentFileName').text(fileDisplayName);
			} else {
				try {
					var F = eval('(' + $(mid).val() + ')');
					$('#currentFileName').text(F.name);
					if (!F.name) {
						var name = F.toString().match(/^function\s*([^\s(]+)/)[1];
						$('#scriptFileNameQs').val(name);
					}
				}catch(E){;}
			}
		}
		$(mid).bind('mousewheel', showTextCursorCoord);
		
		showTextCursorCoord();
		
	}
	
function showError(s) {
	alert(s);
}
//============ / Простой редактор кода==================================
$(initSampleTextEditor);
