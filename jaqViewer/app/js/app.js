function cp(s) {
	var t = new Date().getTime(), le = log && log.innerHTML;
	if (!W.tcp) {
		W.tcp = t;
		if (le) {
			log.innerHTML = log.innerHTML + 'Start ' + (t - W.tcp) + "<br>";
		}
	} else {
		if (le) {
			log.innerHTML = log.innerHTML + s + ' ' + (t - W.tcp) + "<br>";
		}
	}
	
}
window.onload = init;
window.onkeydown=function(evt) {
	var c = evt.keyCode;
	if(c == 27) {
		if (W.isPfsMode) {
			D.body.style.backgroundColor = viewContainer.style.backgroundColor = thumb.style.display = bar.style.display = null;
			viewWrap.style.overflow = 'scroll';
			W.isPfsMode = 0;
			onPlayClick();
		} else {
			Qt.quit();
		}
	}
	if(c == 32){
		onPlayClick();
	}
	if(c == 39){
		onNextClick();
	}
	if(c == 37){
		onPrevClick();
	}
}
function init(){
	W.wasResize = 1;
	W.T = 1000;
	W.data = data = getFolderImages();
	buildPreviews(data);
	setThumbBehavior();
	W.onresize = onResizeWindow;
	bNextFile.onclick = onNextClick;
	bPrevFile.onclick = onPrevClick;
	W.playInterval = 5;
	bPlay.onclick = onPlayClick;
	bZoomIn.onclick = onZoomIn;
	bZoomBreak.onclick = onZoomBreak;
	bZoomOut.onclick = onZoomOut;
	bAdjust.onclick = onAdjustClick;
	bSlideRun.onclick = onSlideRunClick;
	setCurrentImage(data[0]);
	W.currentImgN = 0;
	setActiveThumb();
	//Qt.showFullScreen();
}
function onSlideRunClick() {
	W.wasResize = 1;
	thumb.style.display = bar.style.display = 'none';
	W.playProc = 0;
	W.isPfsMode = 1;
	onPlayClick();
	D.body.style.backgroundColor = viewContainer.style.backgroundColor = 'black';
	setCurrentImage(W.currentOnfoObj);
	viewWrap.style.overflow = null;
}
function onAdjustClick() {
	if (!W.adjustMode) {
		W.adjustMode = 1;
		bAdjust.src = './img/a/transform-move-pick.png';
	} else {
		W.percent = 0;
		W.adjustMode = 0;
		bAdjust.src = './img/a/transform-move.png';
	}
	setCurrentImage(W.currentOnfoObj);
}
function onZoomIn() {
	W.adjustMode = 0;
	W.percent = W.percent || '0';
	W.percent = +W.percent;
	W.percent += 20;
	setCurrentImage(W.currentOnfoObj);
}
function onZoomOut() {
	W.adjustMode = 0;
	W.percent = W.percent || '0';
	W.percent = +W.percent;
	W.percent -= 20;
	if (W.percent < 0) {
		W.percent = 0;
	}
	setCurrentImage(W.currentOnfoObj);
}
function onPlayClick() {
	if (!W.playProc) {
		W.playProc = 1;
		bPlay.src = './img/a/media-playback-stop.png';
		W.playIval = setInterval(onNextClick, W.playInterval * W.T);
	} else {
		bPlay.src = './img/a/media-playback-start.png';
		clearInterval(W.playIval);
		W.playProc = 0;
	}
}
function getInactiveImage() {
	if (bigView1.style.opacity == 0) {
		return bigView1;
	}
	return bigView2;
}
function getActiveImage() {
	if (bigView1.style.opacity == 1) {
		return bigView1;
	}
	return bigView2;
}
function buildPreviews(data) {
	var t = '<div class="activeQ absolute">&nbsp;</div><img src="[SRC]">', i, li;
	e('gallery').innerHTML = '';
	for (i = 0; i < data.length; i++) {
		s = t.replace('[SRC]', data[i].src);
		li = appendChild('gallery', 'li', s, {}, {id:i});
		addClass(li, 'relative');
	}
}
function setCurrentImage(infoObj) {
	if (infoObj) {
		W.currentOnfoObj = infoObj;
		var i = getInactiveImage(),
			wV,
			j = getActiveImage();
		
		wV = getViewport();
		
		if (W.wasResize) {
			wV.w -= (e('thumb').offsetWidth + 20);
			wV.h -= (bar.offsetHeight + 20);
			gallery.style.height = gallery.style.maxHeight = (wV.h - bar.offsetHeight - 20) + 'px';
			viewContainer.style.height = wV.h + 'px';
			viewContainer.style.width  = wV.w + 'px';
			W.wasResize = 0;
		}
		i.src = infoObj.src;
		
		i.style.height = i.style.width = null;
		j.style.height = j.style.width = null;
		
		
		var pW = i.offsetWidth / 100,
				pH = i.offsetHeight / 100,
				pWJ = j.offsetWidth / 100,
				pHJ = j.offsetHeight / 100;
		
		zoomPlace(i, wV);
		zoomPlace(j, wV);
		
		if (W.adjustMode) {
			var  n, m;
			n = i.offsetHeight > i.offsetWidth ? i.offsetHeight : i.offsetWidth;
			m = i.offsetHeight > i.offsetWidth ? getWorkViewport().h : getWorkViewport().w;
			if (m - n > 5) {
				W.percent = Math.round(m / n) *100;
			}
		}
		
		if (W.percent) {
			i.style.width = i.style.width ? i.style.width : i.offsetWidth + 'px';
			i.style.height = i.style.height ? i.style.height : i.offsetHeight + 'px';
			j.style.width = j.style.width ? j.style.width : j.offsetWidth + 'px';
			j.style.height = j.style.height ? j.style.height : j.offsetHeight + 'px';
			if (i.style.width) {
				i.style.width = (parseInt(i.style.width) + pW*W.percent) + 'px';
			}
			if (i.style.height) {
				var t = parseInt(i.style.height, 10);
				var kk = pH*W.percent;
				i.style.height = (t + kk) + 'px';
			}
			pW = pWJ,
			pH = pHJ;
			if (j.style.width) {
				j.style.width = (parseInt(j.style.width) + pW*W.percent) + 'px';
			}
			if (j.style.height) {
				j.style.height = (parseInt(j.style.height) + pH*W.percent) + 'px';
			}
		}
		if (W.adjustMode) {
			zoomPlace(i, wV);
			zoomPlace(j, wV);
		}
		
		i.style.left = ((wV.w - i.offsetWidth) / 2) + 'px';
		i.style.top =  ((wV.h - i.offsetHeight) / 2) + 'px';
		j.style.left = ( (wV.w - j.offsetWidth) / 2) + 'px';
		j.style.top =  ((wV.h - j.offsetHeight) / 2) + 'px';
		
		if (parseInt(i.style.top) < 0) {
			i.style.top = '0px';
		}
		if (parseInt(j.style.top) < 0) {
			j.style.top = '0px';
		}
		if (parseInt(i.style.left) < 0) {
			i.style.left = '0px';
		}
		if (parseInt(j.style.left) < 0) {
			j.style.left = '0px';
		}

		j.style.opacity = 0.0;
		i.style.opacity = 1.0;/**/

		/*W.procAnim = 1;
		var inter = setInterval(function(){
			i.style.opacity += 0.15;
			j.style.opacity -= 0.15;
			if (i.style.opacity > 1.0 || j.style.opacity < 0.0) {
				j.style.opacity = 0.0;
				i.style.opacity = 1.0;
				clearInterval(inter);
				W.procAnim = 0;
			}
		},(1000/24)
		);/**/
	}
}
function setThumbBehavior() {
	var ls = ee('gallery', 'div'), i, j, s, q, o, tG;
	for(i = 0; i < ls.length; i++) {
		//onClick
		ls[i].onclick = onClickThumb;
	}
}

function onClickThumb(evt) {
	var tG = evt.target, id, j;
	if (tG.tagName != 'LI') {
		tG = tG.parentNode;
	}
	id = attr(tG, 'data-id');
	var ls = ee('gallery', 'li'), i;
	for(j = 0; j < ls.length; j++) {
		o = ls[j];
		removeClass(o, 'active');
	}
	s = tG.innerHTML;
	addClass(tG, 'active');
	if (attr(tG, 'data-id') && !W.procAnim) {
		W.currentImgN = id;
		setCurrentImage(data[id]);
	}
		
}
function onResizeWindow() {
	W.wasResize = 1;
	if(W.currentOnfoObj) {
		setCurrentImage(W.currentOnfoObj);
	}
}
function onNextClick() {
	var n = ++W.currentImgN;
	if (n >= W.data.length) {
		n = 0;
	}
	W.currentImgN = n;
	setActiveThumb();
	setCurrentImage(W.data[n]);
}
function onPrevClick() {
	var n = --W.currentImgN;
	if (n < 0) {
		n = W.data.length - 1;
	}
	W.currentImgN = n;
	//W.adjustMode = 0;
	setCurrentImage(W.data[n]);
	setActiveThumb();
}
function setActiveThumb() {
	var ls = getThumbList(), i, j;
	for(j = 0; j < ls.length; j++) {
		o = ls[j];
		removeClass(o, 'active');
		if (j == W.currentImgN) {
			i = ls[j];
		}
	}
	addClass(i, 'active');
}
function onZoomBreak() {
	W.percent = 0;
	W.adjustMode = 0;
	bAdjust.src = './img/a/transform-move.png';
	setCurrentImage(W.currentOnfoObj);
}
function getWorkViewport() {
	var wV = getViewport();
	wV.w -= (e('thumb').offsetWidth + 20);
	wV.h -= (bar.offsetHeight + 20);
	return wV;
}
function zoomPlace (i, wV) {
	if (parseInt(i.offsetWidth) > wV.w) {
		i.style.width = wV.w + 'px';
		i.style.height = null;
	} else if (parseInt(i.offsetHeight) > wV.h){
		i.style.height = wV.h + 'px';
		i.style.width = null;
	}
	if (parseInt(i.offsetWidth) > wV.w) {
		i.style.width = wV.w + 'px';
		i.style.height = null;
	}
	if (parseInt(i.offsetHeight) > wV.h){
		i.style.height = wV.h + 'px';
		i.style.width = null;
	}
	if (parseInt(i.offsetWidth) > wV.w) {
		i.style.width = wV.w + 'px';
		i.style.height = null;
	}
}
function getThumbList() {
	if (!W.thumbList) {
		var ls = ee('gallery', 'li'), i;
		W.thumbList = [];
		for (i = 0; i < ls.length; i++) {
			W.thumbList.push(ls[i]);
		}
	}
	return W.thumbList;
}
function getFolderImages() {
	return [
		{src:'./img/data/000.jpg'},
		{src:'./img/data/39.5.jpg'},
		{src:'./img/data/blueEye.png'},
		{src:'./img/data/olenGit.png'},
		{src:'./img/data/patch.jpg'},
		{src:'./img/data/1.jpg'},
		{src:'./img/data/2.jpg'},
		{src:'./img/data/4.jpg'},
		{src:'./img/data/patch-b.jpg'}
	];
}
