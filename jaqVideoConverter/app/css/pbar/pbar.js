window.onload=function(){
	iPercentDemo.oninput = setVal;
	var n = 25;
	setVal({target:{value:n}});
	iPercentDemo.value = n;
}

function setVal(evt){
	var n = parseInt(evt.target.value);
	n = isNaN(n) ? 0 : n;
	n = n > 100 ? 100 : n;
	n = n < 0 ? 0 : n;
	dompb.style.width = n + '%';
	progressState.innerHTML = `${n * 10} / 1000 (${n}%)`;
}
