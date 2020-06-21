function Abc() {
	function tpl() {
		var s = '<input id="abcfull"  style="width:99%">\
		<input id="lat" type="text" style="width:99%">\
		<input id="cyr" type="text" style="width:99%">\
		<input id="smallfull" type="text" style="width:99%">\
		<input id="smallcyr" type="text" style="width:99%">\
		<input id="smalllat" type="text" style="width:99%">\
		<input id="num" type="text" style="width:99%">\
		<!--p style="text-align:right;margin:0px; padding:0px;">\
		<input type="button" id="run" value="ok">\
		</p-->\
		<p style="text-align:left; margin:0px; padding:0px;">\
		<input type="button" id="menu" value="Menu">\
		</p>\
		';
		$('#console').html(s);
	}
	function selectListener(id) {
		$(id).click(function(){ $(id)[0].select() });
	}
	tpl();
	$('#menu').click(function() {
		Menu.show();
	});
	
	var cyr = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', lat = 'abcdefghijklmnopqrstuvwxyz', num = '0123456789';
	$('#smalllat').val(lat);
	$('#smallcyr').val(cyr);
	$('#num').val(num);
	$('#smallfull').val(String(num) + cyr + lat);
	cyr = cyr + cyr.toUpperCase();
	lat = lat + lat.toUpperCase();
	$('#abcfull').val(String(num) + cyr + lat);
	$('#lat').val(lat);
	$('#cyr').val(cyr);
	
	selectListener('#smalllat');
	selectListener('#smallcyr');
	selectListener('#num');
	selectListener('#smallfull');
	selectListener('#abcfull');
	selectListener('#lat');
	selectListener('#cyr');
}
