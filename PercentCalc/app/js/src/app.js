var debug = false;

//window.addEventListener('load', onLoad);
//window.onkeyup = onKeyUp;


function onLoad() {
	var vTotal, vPercent, W = 200, H = 240, dbg;
	try {
		MW.resizeTo(W, H);
		MW.setIconImage(App.dir() + "/i/icons/32.png");
		window.moveTo(round((screen.width - W)/2), round((screen.height - H)/2));
		vTotal = 0;
		vTotal = storage("total");
		v("iTotal", vTotal);
		v("iPercent", storage("percent"));
		calculate();
		e("iTotal").onkeydown = onKeyDown;
		e("iPercent").onkeydown = onKeyDown;
	} catch (err) {
		alert("It here " + err.message);
	}
}

function calculate(){
	var p1, n;
	p1 = intval(v("iTotal")) / 100;
	v("iResult", round(intval(v("iPercent")) * p1, 2));
	storage("percent", v("iPercent"));
	storage("total", v("iTotal"));
}

function onKeyDown() {
	setTimeout(calculate, 100);
}

onLoad();
