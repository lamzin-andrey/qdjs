var d = document;
var debug = false;

//Вынести в настройки
window.yCorrect = 20;
window.xCorrect = 0;

/** @var baseW  - реальный размер ролика, ширина */
/** @var baseH  - реальный размер ролика, высота  */

/** @var pW  - ширина, необходимо вычислить перед запуском resizePlayer */
/** @var pH  - высота, необходимо вычислить перед запуском resizePlayer  */

/** @var needFullscreen  - устанавливается только при успешном чтении из файла настроек в onClickSelectSwfFile. Используется только в resizePlayer где тут же сбрасывается. */

function e(i){return d.getElementById(i);}


function _toFullByte(n) {
	var n = Number(n).toString(2);
	while (n.length < 8) {
		n = '0' + n;
	}
	return n;
}

/**
 * @description Биты в структуре RECT считать справа налево, отступив 5 бит. Первые 5 бит (которые отступили) содержад длину одного uint числа в битах
 * @return {Object} {w:Number,h:Number}- - размеры кадра swf ролика
*/
function getSwfSize(data) {
	var numRByte = 8, a = data.split(','),
		szByte = a[numRByte], s, n, i, k, aB = [], j, aR = [], q = '', szSide, nBytes, nBits, 
		wTwips, hTwips, w, h, r = {};
		
	//Тут пытаемся работать с сжатой
	
	/*decompressSwc(a);
	return;/**/
	
	//Ниже код для декомпресс- версии
	s = _toFullByte(szByte);
	log(s);
	//get side length
	s = s.substring(0, 5);
	//s = s.substring(3);
	log('size in unsigned bits:' + s);
	n = parseInt(s, 2);
	log('size in dec:' + n);
	szSide = n;
	//calculate num bits
	n = n*4 + 5;
	nBits = n;
	log('bits in rect structure:' + n);
	n = Math.ceil(n / 8);
	nBytes = n;
	log('bytes in rect structure:' + n);
	//get binary str
	s = '';
	for (i = numRByte; i < numRByte + nBytes + 1; i++) {
		n = Number(a[i]);
		if (String(n) == 'undefined') {
			alert('ATAS');
		}
		s += _toFullByte(n);
	}
	log('rect:' + s);
	log('strlen(rect):' + s.length);
	log('szSide:' + szSide);
	for (j = 0, i = 5; i < nBits; i++, j++) {
		aB.push(s.charAt(i));
		if (j + 1 == szSide) {
			aR.push( aB.join('') );
			j = -1;
			aB = [];
		}
	}
	/*debug for (i = 0; i < aR.length; i++) {
		log('side ' + i + ' = "' + aR[i] + '", dec = ' + parseInt(aR[i], 2));
	}/**/
	wTwips = parseInt(aR[1], 2);
	hTwips = parseInt(aR[3], 2);
	log('wTwips:' + wTwips);
	log('hTwips:' + hTwips);
	w = Math.round(wTwips / 20);
	h = Math.round(hTwips / 20);
	log('w:' + w);
	log('h:' + h);
	r.w = w;
	r.h = h;
	return r;
}
/**
 * @description ПОка просто считываем байты в текстовое поле
*/
function onClickSelectSwfFile(sPath)
{
	//По этому признаку определяем, удалось ли получить размер экрана ролика
	window.baseW = 0;
	window.baseH = 0;
	var s, firstByte,
		/** @var oSize {w, h} */
		oSize,
		sDir, shell, dd;
	if (sPath) {
		s = sPath;
	} else {
		//s = Qt.openFileDialog('Select swf file', getRecentDir(), '*.swf');
		s = jqlOpenFileDialog('Select swf file', '*.swf');
		if (!s) {
			return;
		}
	}
	window.swfPath = s;
	var oFileInfo = RecentFileInfo.getFileInfo(s);
	if (oFileInfo.w) {
		if (oFileInfo.fs) {
			window.needFullscreen = true;
		}
		setSwfOnPage(oFileInfo.w, oFileInfo.h, s);
		return;
	}
	
	sDir = getFolder(s);
	firstByte = Qt.readFileAsBinaryString(s, 0, 1);
	window.fileForUnzip = Qt.appDir() + '/0.swf.gz';
	window.unzippedFile = Qt.appDir() + '/1.php.swf';
	
	if (firstByte == 70) {
		s = Qt.readFileAsBinaryString(s, 0, 32);
		oSize = getSwfSize(s);
		setSwfOnPage(oSize.w, oSize.h, window.swfPath);
		return;
	}
	//Qt.copyFile(s, sDir + '/0.swf.gz', 8, -1); - это очень медленно, надо будет более продвинуто сделать.
	//запустить testungz.php
	shell = Qt.appDir() + '/rununpack.sh';
	window.sDir = sDir;
	dd = 'dd if="' + s + '" of="' + fileForUnzip + '" skip=8 ibs=1';
	PHP.file_put_contents(shell, '#! /bin/bash\n' + dd + '\nphp ' + Qt.appDir() + '/testungz.php\n');
	PHP.exec(shell, 'onUnpackFin', 'Z', 'onUnpackError');
}

function setSwfOnPage(w, h, swfPath) {
	window.mainMenuIsHide = false;
	if (w < 0 || h < 0 || w > 3000 || h > 2000) {
		w = 480;
		h = 320;
	} else {
		//оригинальные размеры
		window.baseW = w;
		window.baseH = h;
		window.flashMovieK = window.baseW / window.baseH;
	}
	if (window.baseW) {
		var oInfo = RecentFileInfo.getFileInfo(swfPath);
		if (!oInfo.w) {
			oInfo = {
				w: baseW,
				h: baseH,
				fs: false
			};
			RecentFileInfo.setFileInfo(swfPath, oInfo);
		}
	}
	//d.getElementsByTagName('body')[0].innerHTML = '';
	var swfPlace = e('swfplace');
	swfPlace.innerHTML = '';
	//id=swf0 or swfKa
	var swfObject = e('swfKa');
	if (swfObject) {
		swfObject.setAttribute('width', w);
		swfObject.setAttribute('height', h);
		swfObject.setAttribute('src', swfPath);
	} else {
		//d.getElementsByTagName('body')[0].innerHTML = swfTpl(w, h, swfPath);
		swfPlace.innerHTML = swfTpl(w, h, swfPath);
	}
	
	window.pW =  w + window.xCorrect;
	window.pH =  h + window.yCorrect;
	setTimeout(resizePlayer, 200);
}
function onResizeWindow(){
	if (!window.baseW || window.skipResizeListener) {
		if (window.skipResizeListener) {
			window.skipResizeListener = false;
		}
		return;
	}
	
	var oV = getViewport(),
		vW = oV.w,
		vH = oV.h, sc;
	
	if (vW > baseW || vH > baseH) {
		if (vW > baseW) {
			sc = baseW / vW;
		} else {
			sc = baseH / vH;
		}
		window.pW = Math.round(baseW / sc);
		window.pH = Math.round(baseH / sc);
		
		var h = getHByW(window.pW);
		if( screen.height < window.pH) {
			var w = getWByH(screen.height);
			window.pH = screen.height;
			window.pW = w;
		}
		
		setTimeout(function(){
			window.skipResizeListener = true;
			var swfObject = e('swfKa');
			if (swfObject) {
				swfObject.setAttribute('width', window.pW);
				swfObject.setAttribute('height', window.pH);
				window.pW += xCorrect;
				window.pH += yCorrect;
				e('swfplace').style.width = window.pW + 'px';
				//resizePlayer();
			}
		}, 200);
	}
}
//getviewport
window.getViewport = function() {
	var W = window, D = document;
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

function resizePlayer(){
	Qt.resizeTo(pW, pH);
	if (window.needFullscreen) {
		window.needFullscreen = false;
		setTimeout(function(){
			onClickShowFullscreen(false);
		}, 200);
	}
}


function onUnpackError(stderr){
	if (~stderr.indexOf('dd') || ~stderr.indexOf('php')) {
		alert('For normal run flash application please install php and dd. Run\nsudo apt-get install dd php\n' + 
			'Error text: \n' + stderr);
	}
}
function onUnpackFin(stdout, stderr){
	log('unpack...');
	//из распакованного (1.php.swf) получить 32 байта , перед ними написать 8 нулей и отдать getSwfSize
	var a = new Array(8), 
		buf = a.join(',') + ',' + Qt.readFileAsBinaryString(unzippedFile, 0, 32),
		oSize;
	oSize = getSwfSize(buf);
	PHP.unlink(unzippedFile);
	PHP.unlink(fileForUnzip);
	setSwfOnPage(oSize.w, oSize.h, window.swfPath);
}
function Z(s){
	//alert('o = ');
}

function getFolder(s){
	var a = s.split('/'), i, b = [];
	for (i = 0; i < a.length - 1; i++) {
		b.push(a[i]);
	}
	return b.join('/');
}
/**
 * Это пляски с бубном, к которым хочется потом вернуться
 * @param {Array} Array of Number data
*/
function decompressSwc(data) {
	//var data:ByteArray = File.readByteArray(file);
	//У нас уже есть как аргумент
	
	//data.endian = "littleEndian";
	//TODO пока непонятно, как с этим быть

	//var version:uint = data.readUnsignedInt();
	//Считывает из потока байтов 32-разрядное целое без знака.
	//32-разрядное целое
	var version = readUnsignedInt(data, 4);
	log('version = ' + version);
	var dbg = 90|87<<8|83<<16;
	log('dbg = ' + dbg);
	log('version & 0xffffffff = ' + (version & 0xffffffff));
	switch (version & 0xffffffff) {
		// SWZ = lzma compressed
		//TODO это проверить в первую очередь, остальное можно потом
		case 90|87<<8|83<<16: 
			log('Aga!');
			break;
		default:
			log('Fail');
	}
	
	/*if (doDecompressOnly)    System.exit(0);
		 udata=new ByteArray;
		 udata.endian = "littleEndian";
		 var ptr;*/

	// put lzma properties in 0-4 for (ptr=0;ptr<5;ptr++) {     udata[ptr]=data[12+ptr] } // calculate uncompressed length, subtract 8 (remove header bytes) var scriptlen:uint=data[4]+(data[5]<<8)+(data[6]<<16)+(data[7]<<24)-8; // write lzma properties bytes: 0-4 for (ptr=0;ptr<4;ptr++) {     udata[5+ptr]=data[8+ptr] }

	// write the uncompressed length: 5-8  udata[5]=scriptlen&0xFF; udata[6]=(scriptlen>>8) & 0xFF; udata[7]=(scriptlen>>16) & 0xFF; udata[8]=(scriptlen>>24) & 0xFF;// add 4 extra 0 to compressed length: 9-12 for (ptr=0;ptr<4;ptr++) {     udata[9+ptr]=0 }

	//data.position = 17 data.readBytes(udata,13,data.length-data.position) udata.position=0 csize = udata.length udata.uncompress(CompressionAlgorithm.LZMA) infoPrint("decompressed swf "+csize+" -> "+udata.length) /*var swf:Swf =*/ new Swf(udata) break
}
/**
 *
 * @param {Array} Array of Number (even from 0 to 255) aData
*/
function readUnsignedInt(aData, offset) {
	var s = '', i, a = [];
	for (i = offset; i < offset + 4; i++) {
		//s += _toFullByte(aData[i]);
		a.push( _toFullByte(aData[i]) );
	}
	s = a.reverse().join('');
	return parseInt(s, 2);
}



function log(s) {
	if (debug) {
		//e('log').innerHTML += '<div style="color:blue;">' + s + '</div>';
		PHP.file_put_contents(Qt.appDir() + '/dev.log', s + "\n", 1);
	}
	
}
/**
 * id=swf0 or swfKa
*/
function swfTpl(w, h, sPath) {
	var s = '<embed style="margin:auto;"  src="' + sPath + '" quality="high" bgcolor="#000"	flashvars="" name="swfKa"\
			id="swfKa" allowscriptaccess="sameDomain" allowfullscreen="sameDomain" type="application/x-shockwave-flash"\
			align="middle"\
			pluginspage="http://www.macromedia.com/go/getflashplayer"\
			width="' + w + '" height="' + h + '"  />';
	return s;
}
function onKeyUp(evt) {
	if (evt.ctrlKey) {
		switch(evt.keyCode) {
			case 70:
				onClickShowFullscreen();
				break;
			case 79:
				onClickSelectSwfFile();
				break;
			case 82:
				onClickRememberFullscreenMenu();
				break;
			case 81:
				onClickExitMenu();
				break;
		}
		
	}
	if (evt.keyCode == 27 && window.mainMenuIsHide) {
		exitFromFullscreen();
	}
}

function onClickRememberFullscreenMenu() {
	setFSOptionForSelectedMovie(true);
}
function onClickForgetFullscreenMenu() {
	setFSOptionForSelectedMovie(false);
}
function setFSOptionForSelectedMovie(v) {
	if (!window.swfPath) {
		return;
	}
	var oInfo = RecentFileInfo.getFileInfo(window.swfPath);
	if (oInfo && oInfo.w) {
		oInfo.fs = v;
		RecentFileInfo.setFileInfo(window.swfPath, oInfo);
	}
}

function exitFromFullscreen(){
	window.mainMenuIsHide = false;
	Qt.showMainMenu();
	Qt.showNormal();
	window.swfPath;
}
function onClickShowFullscreen(bSaveFullscreenInSetting){
	bSaveFullscreenInSetting = String(bSaveFullscreenInSetting) == 'undefined' ? true : false;
	window.mainMenuIsHide = true;
	Qt.hideMainMenu();
	Qt.showFullScreen();
	if (bSaveFullscreenInSetting) {
		rememberFullscreen();
	}
}
function onClickExitMenu() {
	Qt.quit();
}
// Возвращает высоту  ролика по заданной ширине.
function getHByW( w ){
    return ( w / window.flashMovieK );
}

function getWByH(h) {
    var k = window.flashMovieK;
    return k * h;
}
window.onresize = onResizeWindow;
window.onload = onLoad;
window.onkeyup = onKeyUp;
function onLoad() {
	var args = Qt.getArgs();
	if (args.length > 0) {
		onClickSelectSwfFile(args[0]);
	}
}
