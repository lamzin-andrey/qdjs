function PBar() {}

PBar.prototype.set = function(v, total) {
	var p1 = total / 100, srcV = v;
	v = Math.ceil(v / p1);
	e('dompb').style.width = (v + '%');
	e('progressState').innerHTML = srcV + ' / ' + total + ' (' + v + '%)';
}
