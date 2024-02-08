var d  =  document,
w  =  window,
nav = navigator,
nMs = 0,
nS =  0,
nM = 0,
nH = 0,
intMs,
intSec,
nFirstPoint = 1,
nCurrentPoint = 1,
nCurrentPointReal = 0,
menuIsVisible = 0,
isStop = 0,
p = ':',
points = {},
touchEvents = [],
funcs = [];
function strt(){	
  if (nav.userAgent.toLowerCase().indexOf('android 2.3.6') != -1) {
    astl('2.css');
    funcs.push(onLoadA236);
  } else {
    astl('s.css');
  }
  
  fixScr();
  try{
    smmInit();
    JBash.start();
   } catch(err){
     alert(err);
   }
  setListeners();
}
function  setListeners() {

  e( 'reset').addEventListener( 'click', smmOnClick, true);
/*  e('stop').addEventListener( 'click', onClickStop, true);
  e('menu').addEventListener( 'click', onClickPoint, true );*/
  
  
}


function astl(st) {
  var h  = d.getElementsByTagName('head')[0],
  r  = './s/',
  s  = d.createElement ('link');
  s.type  = 'text/css';
  s.rel = 'stylesheet';
  s.href = r + st;// + '?' + Math.random();
  h.appendChild (s);
}



function fixScr() {
	var imgs = document.getElementsByTagName('img'), k, im, tr, str;
	for (k = 0; k < imgs.length; k++) {
		str = imgs[k].getAttribute('alt');
		if (str == '000webhost logo' || str == 'www.000webhost.com') {
			im = imgs[k];
			while(im.tagName != 'DIV') {
				im = im.parentNode;
				tr++;
				if (tr > 10) {
					break;
				}
			}
			if(im.tagName == 'DIV') {
				im.parentNode.removeChild(im);
				window.rwl = 1;
			}
		}
	}
	for (k = 0; k < funcs.length; k++) {
		if (funcs[k] instanceof Function) {
			funcs[k]();
		}
	}
}
function onLoadA236() {
	d.body.style['min-height'] = '400px';
	d.body.style['border'] = 'black 1px solid';
	var y = 90;
	w.scrollTo(0, y);
	setTimeout(function(){
		w.scrollTo(0, y);
	}, 1000);
}

function showError(s) {
	alert(s);
}


window.onload  = strt;
