function MoonPhase() {
	var period = 29.5305882 * 24 * 3600, 	//средняя продолжительность лунных суток
		startPoint = '2015-01-05T07:52:04', //точка отсчета
		isFull = 1,							//признак, что начинаем считать от полнолуния
		DAY = 24 * 3600;
	if ( window.navigator.userAgent.toLowerCase().indexOf('android') != -1 ) {
		startPoint = '2015-01-05 07:52:04';
	}
		
	var startDate = new Date(startPoint),
		startStamp = (startDate.getTime() / 1000),
		currentDate = new Date(),
		current = ( (currentDate.getTime() / 1000) -  startStamp) % period;
		writeln( getPhaseStr(), current );
		setTimeout(function(){
			Qt.quit();
		}, 5 * 1000);
	function getPhaseStr() {
		if (current < period / 4) {
			if (Math.abs(current - period / 4) < DAY ) {
				return('Где-то рядом полнолуние!');
			} else {
				return('Убывающая луна, третья четверть, ' + numH24(current));
			}
		}
		if (current > period / 4 && current < period / 2 ) {
			if (Math.abs(current - period / 2) < DAY ) {
				return('Где-то рядом новолуние, ' + numH24(current));
			} else {
				return('Убывающая луна, последняя четверть, ' + numH24(current));
			}
		} else if (current > period / 2 && current < 3 * period / 4 ) {
			if (Math.abs(current - 3 * period / 4) < DAY ) {
				return('Где-то рядом вторая четверть, ' + numH24(current));
			} else {
				return('Возрастающая луна, первая четверть, ' + numH24(current));
			}
		 } else if (current > 3 * period / 4 && current <  period ) {
			if (Math.abs(current - period / 2) < DAY ) {
				return('Где-то рядом полнолуние, ' + numH24(current));
 			} else {
				return('Возрастающая луна, вторая четверть, ' + numH24(current));
			}
		}
	}
	/**
	 * @description Склоняет лексему (eд. измерения) в зависимости от значения k
	 * На примере "день"
	 * pluralize(n, 'день', 'дня', 'дней');
	 * потому что 'один день' (one),
	 * 			  'три дня'(less4, 3 <= 4),
	 *			  '20 дней' (more19, 20 > 19)
	*/
	function pluralize(n, one, less4, more19) {
		var m, lex, r, i;
		m = String(n);
		if (m.length > 1) {
			m =  parseInt( m.charAt(m.length - 2) + m.charAt(m.length - 1) );
		}
		lex = less4;
		if (m > 20) {
			r = String(n);
			i = parseInt( r.charAt( r.length - 1 ) );
		   if (i == 1) {
				lex = one;
			} else {
				if (i == 0 || i > 4) {
				   lex = more19;
				}
			}
		} else if (m > 4 || m == '00'|| m == '0') {
			lex = more19;
		} else if (m == 1) {
			lex = one;
		}
		return lex;
	}
	function numH24(n) {
		n = getDay(n);
		s = ' возраст ' + n + ' ' + pluralize(n, 'день', 'дня', 'дней');
		return s;
	}
	
	function writeln(s, n) {
		n = getHalfDay(n);
		e('text').innerHTML = s;
		setImage(n);
	}
	/**
	 * @description Устанавливает изображение фазы луны
	 * @param {Number} n сколько земных "полусуток" прошло после новолунияя
	*/
	function setImage(n) {
		var img = e('mi');
		e('danger').style.display = 'none';
		img.onerror = function() {
			e('danger').style.display = null;
			img.src = './i/m' + n + '.gif';
		}
		img.src = './i/m' + n + '.gif';
	}
	/**
	 * @description Вычисляет, сколько земных суток прошло после новолуния
	 * @param {Number} n количество секунд после новолуния
	 * @return Number номер земных суток после новолуния
	*/
	function getDay(n) {
		//Здесь -15 потому что точка отсчёта полнолуние
		var k = isFull ? -15 : 0, s;
		k = Math.round(n / (24 * 3600) ) + k;
		k = k < 0 ? k + 30 : k;
		return k;
	}
	/**
	 * @description Вычисляет, сколько земных "полусуток" прошло после новолуния
	 * @param {Number} n количество секунд после новолуния
	 * @return Number номер земных суток после новолуния
	*/
	function getHalfDay(n) {
		//Здесь -30 потому что точка отсчёта полнолуние
		var k = isFull ? -30 : 0, s;
		k = Math.round(n / (12 * 3600) ) + k;
		k = k < 0 ? k + 60 : k;
		return k;
	}
	function e(i){return document.getElementById(i);}
}
window.onload = MoonPhase;
