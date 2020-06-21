window.onload = init;
function init(){
	e('iConvert').onclick = jUrlOnConvertClick;
}
function jUrlOnConvertClick() {
	var s = e('iUrl').value;
	s = str_replace('%2F', '/', s);
	s = str_replace('%3A', ':', s);
	e('iUrl').value = s;
}
