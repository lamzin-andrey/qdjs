/**
 * @class Назначение отловить окно программы geany
*/
window.geanyDetector = {
	id:0,
	activeFile:'',
	out:''
};
/**
 * @description Результат выполнения xwininfo -root -children -tree
*/
function goOnFin(o, e) {
	
	/*if (e) {
		goOnErr(e);
	}*/
	if (o) {
		var success = goParseXWinInfoOut(o);
		if (!success) {
			goOnStd('Next!');
			//setTimeout(runGeanyObserver, 200);
			runGeanyObserver();
		} else {
			goOnStd('Ok!');
			//TODO запустить другой наблюдатель мониторящий геометрию окна
		}
	}
}
/**
 * @description 
*/
function goParseXWinInfoOut(text) {
	var a = text.split('\n'),sr = 'geany', i, r = [], targetStr = '', m = '("geany" "Geany")';
	
	for (i = 0; i < a.length; i++) {
		if (~a[i].indexOf(sr)) {
			goOnStd(a[i]);
			r.push(a[i]);
		}
	}
	if (r.length) {
		while (r.length) {
			s = r.pop();
			if (~s.indexOf(m)) {
				targetStr = s;
				break;
			}
		}
		goOnStd(targetStr);
		if (~targetStr.indexOf(m)) {
			a = targetStr.split(/\s+/);
			r = [];
			for (i = 0; i < a.length; i++) {
				if (a[i].trim()) {
					r.push(a[i].trim());
				}
			}
			
			//r = r.join('').split(',');
			//goOnStd(r);
			geanyDetector.id = r[0];
			//goOnStd(geanyDetector.id);
			geanyDetector.activeFile = r[3] + r[1].replace('"', '/');
			//goOnStd(geanyDetector.activeFile);
			return true;
		}
	}
	return false;
}
function goOnStd(s) {
	geanyDetector.out += '\n' + s;
	var v = con.html();
	v += goPar('out:', '#28C0F3');
	v += goPar(s, '#FFFFFF');
	con.html(v);
	window.scrollTo(0, 10000)
}
function goOnErr(s) {
	var v = con.html();
	v += goPar('err:', '#28C0F3');
	v += goPar(s, '#F34B28');
	con.html(v);
}

function runGeanyObserver() {
	geanyDetector.out = '';
	window.con = $('#console');
	con.html('');
	PHP.exec('xwininfo -root -children -tree', 'goOnFin', 'goOnStd', 'goOnErr');
}
function goPar(s, clr) {
	s = '<p style="color:' + clr + ';margin:1px;">' + s + '</p>';
	return s;
}
function goPatch(){}
