/* Т к использую jQuery тащу из micron.js только то что необходимо*/
var D = document,
W = window, S = String;
function getViewport() {
	var w = W.innerWidth, h = W.innerHeight;
	if (!w && D.documentElement && D.documentElement.clientWidth) {
		w = D.documentElement.clientWidth;
	} else if (!w) {
		w = D.getElementsByTagName('body')[0].clientWidth;
	}
	if (!h && D.documentElement && D.documentElement.clientHeight) {
		h = D.documentElement.clientHeight;
	} else if (!h) {
		h = D.getElementsByTagName('body')[0].clientHeight;
	}
	return {w:w, h:h};
}

/**
 * Улучшеный вид чекбокса
 * 
 * Верстка
 * <div class="iblock matchcaseblock" >
 * 		<input type="checkbox" id="bMatchCase">
 * 		<div for="bMatchCase" class="iblock chbView">&nbsp;</div><label for="bMatchCase">' + L('Match case') + '</label>
 * </div>
 * 
 * css
 * 
	.iblock {
		display:inline-block;
	}
	.matchcaseblock {
		line-height:22px;
	}
	#bMatchCase {
		vertical-align:bottom;
		color:green;
		background-color:white;
		display:none;
	}
	.chbView {
		background: url(../i/unchecked.png) 0 2px no-repeat;
		min-width:16px;
		margin-right:8px;
	}
	label[for=bMatchCase] {
		font-size:12px;
	}

 * @description нужно вызывать всякий раз после того как на страницу добавлен новый чекбокс и после того как сменили программно его значение
 * Обработчики событий добавятся один раз независимо от кол-ва вызовов
*/
function setCheckboxView() {
	var ls = $('.chbView'), i, j, cb;
	window.chbviewshash = window.chbviewshash || {};
	for (i = 0; i < ls.length; i++) {
		j = $(ls[i]);
		cb = $('#' + j.attr('for'));
		if (cb[0]) {
			if (cb[0].checked) {
				j.css('background', 'url(./i/checked.png) 0 2px no-repeat');
			} else {
				j.css('background', 'url(./i/unchecked.png) 0 2px no-repeat');
			}
			
			if (!chbviewshash[cb.attr('id')]) {
				chbviewshash[cb.attr('id')] = 1;
				cb.bind('change', function(e){
					var c = e.currentTarget, v;
					v = $('div[for=' + c.id + ']');
					if (c.checked) {
						v.css('background', 'url(./i/checked.png) 0 2px no-repeat');
					} else {
						v.css('background', 'url(./i/unchecked.png) 0 2px no-repeat');
					}
				});
				j.click(function(e) {
					var c = e.currentTarget, v;
					v = $('#' + c.getAttribute('for'));
					if (v.prop('checked')) {
						$(c).css('background', 'url(./i/unchecked.png) 0 2px no-repeat');
						v.prop('checked', false);
					} else {
						$(c).css('background', 'url(./i/checked.png) 0 2px no-repeat');
						v.prop('checked', true);
					}
				});
			}
		}
	}
}
