window.onload=function(){
	// iPercentDemo.oninput = setVal;
	// var n = 25;
	// setVal({target:{value:n}});
	// iPercentDemo.value = n;
}

function setVal(evt){
	var n = parseInt(evt.target.value);
	// pBarSetPrcVal(n);
	pBarSetPureVal(n, 100);
}

function pBarSetPrcVal(n) {
	n = isNaN(n) ? 0 : n;
	n = n > 100 ? 100 : n;
	n = n < 0 ? 0 : n;
	dompb.style.width = n + '%';
	// progressState.innerHTML = (n * 10) + ' / ' + 1000 (' + n + '%)';
}

function pBarSetPureVal(done, total) {
	var p = total / 100, x;
	x = Math.ceil(done / p);
	pBarSetPrcVal(x);
}

function pBarAnimateStart(){
	var i;
	window.pBarX = 0;
	window.ival = setInterval(function() {
		var x = window.pBarX + 4;
		x = (dompb.parentNode.offsetWidth > (x - dompb.offsetWidth)) ? x : 0;
		dompb.style['margin-left'] = x + 'px';
		window.pBarX = x;
	}, 44);
}
function pBarAnimateStop(){
	clearInterval(window.ival);
	dompb.style['margin-left'] = '0px';
}
