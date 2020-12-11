/**
 * Full file php.js here:  https://github.com/lamzin-andrey/php2jstranslator/tree/functions
 * 
 * **/

function intval(i) {
	var r = parseInt(i, 10);
	return isNaN(r) ? 0 : r;
}
/**
 * @description 
 * @param {String} sDatetime 'Y-m-d H:i:s' (php date() format)
 * @return Количество секунд с 01.01.1970 до sDatetime
*/
function time(sDatetime) {
	var re = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/, arr = String(sDatetime).split(' '),
		sDate = arr[0],
		sTime = arr[1], d = new Date(),
		re2 = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
	if (!re.test(sDatetime) && !re2.test(sDatetime)) {
		return parseInt(new Date().getTime()/1000);
	}
	arr = sDate.split('-');
	d.setDate(parseInt(arr[2], 10));
	d.setFullYear(arr[0]);
	d.setMonth(parseInt(arr[1], 10) - 1);
	
	if (sTime) {
		arr = sTime.split(':');
		d.setHours(parseInt(arr[0], 10));
		d.setMinutes(parseInt(arr[1], 10));
		d.setSeconds(parseInt(arr[2], 10), 0);
	} else {
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0, 0);
	}
	return parseInt(d.getTime()/1000);
}
function str_replace(search, replace, subject, oCount) {
	if (oCount && (oCount instanceof Object)) {
		if (!oCount.v) {
			oCount.v = 0;
		}
	}
	while (subject.indexOf(search) != -1) {
		subject = subject.replace(search, replace);
		if (oCount && (oCount instanceof Object)) {
			oCount.v++;
		}
	}
	return subject;
}
function date(pattern, ts){
	ts = ts ? ts : time();
	ts *= 1000;
	var dt = new Date(ts), map = {
		Y : dt.getFullYear(),
		y : dt.getYear(),
		m : dt.getMonth() + 1,
		d : dt.getDate(),
		H : dt.getHours(),
		N : _dateParseN(dt),
		i : dt.getMinutes(),
		s : dt.getSeconds()
	};
	var key;
	for (key in map) {
		if (key != 'N') {
			map[key] = +map[key] < 10 ? ('0' + map[key]) : map[key];
		}
		pattern = str_replace(key, map[key], pattern);
	}
	return pattern;
}
function _dateParseN(dt) {
	var n = dt.getDay();
	n = (n == 0 ? 7 : n);
	return n;
}
