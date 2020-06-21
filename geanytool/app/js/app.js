function Camel2Snake() {
	function tpl() {
		var s = '<p style="text-align:left; margin:0px; padding:0px;color:gray;">\
		int $nCompanyId, string $stamp, float $nLat, float $nLng) : StdClass\
		</p>\
		<p style="text-align:left; margin:0px; padding:0px;">\
		<textarea id="outDesc" style="resize:none; width:99%;"></textarea>\
		</p>\
		\
		<p style="text-align:left; margin:0px; padding:0px;color:gray;">\
		Введите имя PHP класса\
		</p>\
		<p style="text-align:left; margin:0px; padding:0px;">\
			<input id="iPhpClassName"  style="width:99%">\
			<div id="hNsError" style="color:#FF0000; display:none;">Не найден composer.json</div>\
		</p>\
		<p style="text-align:left; margin:0px; padding:0px;">\
			<select multiple id="sNamespaces"  style="width:99%; height:50px;">\
			</select>\
		</p>\
		<p style="text-align:left; margin:0px; padding:0px;">\
			<input id="iPhpNamespaceResult"  style="width:99%">\
		</p>\
		<p style="text-align:left; margin:0px; padding:0px;color:gray;">\
		snake_case to camelCase\
		</p>\
		<input id="in" rows="10" style="width:99%">\
		<input id="out" type="text" style="width:99%">\
		<!--p style="text-align:right;margin:0px; padding:0px;">\
		<input type="button" id="run" value="ok">\
		</p-->\
		\
		<p style="text-align:left; margin:0px; padding:0px;">\
		<input type="button" id="menu" value="Menu">\
		</p>\
		';
		$('#console').html(s);
	}
	tpl();
	
	window.settingsObject = new SettingsObject('appsettings.json');
	
	var nsTool = new NamespacesTool(settingsObject);
	$('#menu').click(function() {
		Menu.show();
	});
	
	
	var lastId = settingsObject.storage('lastClickedFile');
	if ($('#' + lastId)[0]) {
		$('#' + lastId).focus();
	} else {
		$('#in').focus();
	}
	
	window.onkeydown = onQuit;
	function onQuit(e){
		if (e.keyCode == 27) {
			Qt.quit();
		}
	}
	$('#outDesc')[0].onclick = function() {
		settingsObject.storage('lastClickedFile', 'outDesc');
	}
	/**
	 * @description
	 * @param int $nCompanyId
	 * @param string $stamp
	 * @param float $nLat
	 * @param float $nLng
	 * @return StdClass
	*/

	$('#outDesc')[0].onkeydown = function(e) {
		if (e.keyCode == 13) {
			var rTpl = '/**\n\t * @description\n{content}\n\t*/';
			var paramTpl = '@param {s}', retTpl = '@return {s}', data = $('#outDesc').val(), i, a,
			isHasReturn = 0, sReturn = '', sParam = '';
			a = data.split(') : ');
			if (a.length == 2) {
				isHasReturn = 1;
				sReturn = '\t * ' + retTpl.replace('{s}', a[1].trim()) + '\n';
				data = a[0].trim();
			} else {
				data = data.trim();
			}
			a = data.split(',');
			for (i = 0; i < a.length; i++) {
				sParam += '\t * ' + paramTpl.replace('{s}', a[i].trim()) + '\n';
			}
			if (isHasReturn) {
				sParam += sReturn;
			}
			sParam = rTpl.replace('{content}', sParam);
			$('#outDesc').val(sParam);
			setTimeout(function(){
				$('#outDesc')[0].select();
			}, 200);
		}
	}
	
	$('#in')[0].onclick = function() {
		settingsObject.storage('lastClickedFile', 'in');
	}
	
	$('#in')[0].onkeydown = function() {
		setTimeout(function() {
			var a = $('#in').val(), i, r = '';
			if (isCamelCase(a)) {
				for (i = 0; i < a.length; i++) {
					var ch = a.charAt(i);
					if (ch == ch.toUpperCase()) {
						ch = ch.toLowerCase();
						if (i > 0) {
							ch = '_' + ch;
						}
					}
					r += ch;
				}
			}
			if (isSnakeCase(a)) {
				var arr = a.split('_'), i, r = '', s;
				for(i = 0; i < arr.length; i++) {
					s = $.trim(arr[i]);
					if (i > 0) {
						s = s.charAt(0).toUpperCase() + s.substring(1);
					}
					r += s;
				}
			}
			if (isEnum(a)) {
				r = namesToPhpArrayDerfinion(a);
			}
			$('#out').val(r);
		}, 100);
	}
	function isCamelCase(s) {
		if (s.indexOf('_') == -1) {
			return true;
		}
		return false;
	}
	function isSnakeCase(s) {
		return !isCamelCase(s) && !isEnum(s);
	}
	function isEnum(s) {
		if (~s.indexOf(',') || ~s.indexOf(' ')){
			return true;
		}
		return false;
	}
	function namesToPhpArrayDerfinion(s) {
		var sep, a, i, w, r = [];
		if (~s.indexOf(',')) {
			sep = ',';
		} else {
			sep = /\s+/;
		}
		a = s.split(sep);
		for (i = 0; i < a.length; i++) {
			w = $.trim(a[i]);
			if (w) {
				r.push("'" + w + "' => $" + w);
			}
		}
		return '[' + r.join(', ') + ']';
	}
	
}

window.onload=Camel2Snake;
