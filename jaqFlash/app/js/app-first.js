var d = document,
//example="70,87,83,5,181,8,1,0,112,0,13,172,0,0,156,64,0,30,115,0,67,2,0,0,0,191,3,185,5,0,0,1,0,38,111,21,0,0,125,6,255,227,32,192,0,0,0,2,88,1,64,0,0,240,51,200,129,102,27,32,6,60,24,19,17,173,48,55,246,192,225,139,238,132,14,187,80,14,78,109,253,128,196,141,3,34,68,5,11,131,99,159,248,130,130,148,30,200,0,224,255,240,109,152,90,56,156,196,0,40,142,63,255,192,8,32,54,208,64,1,31,148,136,128,92,255,255,254,24,172,64,48,219,8,33,20,26,100,48,136,12,127,255,255,255,227,32,192,91,37,67,230,128,1,148,160,0,248,96,49,0,196,160,44,129,192,61,151,13,8,24,173,199,24,98,79,255,255,255,199,3,14,97,4,42,40,128,21,8,161,0,42,22,199,32,112,10,95,255,255,255,255,252,116,10,80,46,12,78,229,113,65,139,44,151,38,255,155,233,186,225,77,171,145,10,75,88,141,237,33,179,64,141,197,106,165,76,152,148,11,24,191,197,218,136,187,180,92,255,227,32,192,33,18,136,226,201,145,216,48,1,181,41,169,158,47,27,218,154,170,127,237,85,109,143,56,242,212,79,65,249,52,177,190,111,197,248,255,253,228,73,23,32,167,154,18,239,224,86,177,21,245,0,192,16,113,88,172,104,152,29,6,109,13,82,37,141,178,180,183,61,127,255,255,255,252,124,24,8,103,255,255,255,229,14,23,18,59,255,255,253,77,56,40,71,255,255,253,11,155,49,228,255,227,32,192,49,16,195,38,211,242,74,142,218,142,60,223,255,245,48,241,169,167,29,255,155,25";
//example="67,87,83,7,74,12,19,0,120,156,212,123,7,84,83,77,183,246,156,16,122,239,4,80,66,47,2,210,65,165,4,4,164,247,34,40,82,67,239,69,138,168,161,40,69,164,137,20,1,69,17,4,4,5,233,96,65,108,116,145,38,8,40,136,8,136,130,93,65,52,255,57,65,17,223,247,123,191,251,173,251,151,187,254,147,69,146,179,103,102,207,179,159,189,103,246,204,28,18,1,40,182,0,192,116,17,0,174,66,104,55,10,0,192,71,1";
//example="49,49,49,49,49,49,49,49,120,0,6,29,0,0,16,164,0,0,24,157,1,67,2,0,0,0,31,6,0,0,36,49,36,111";
example="17,17,17,17,17,17,17,17,120,0,6,64,0,0,18,192,0,0,30,3,0,68,17,25,0,0,0,127,19,202,1,0,0,60,114,100,102,58,82,68,70,32,120,109,108,110";
function e(i){return d.getElementById(i);}
function log(s) {
	e('log').innerHTML += '<div style="color:blue;">' + s + '</div>';
}
function testGetSwfSize() {
	getSwfSize(example);
	e('bSelectSwf').onclick = onClickSelectSwfFile;
}

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
function onClickSelectSwfFile()
{
	var s = Qt.openFileDialog('Select swf file', Qt.appDir(), '*.swf'),
		buf = Qt.readFileAsBinaryString(s);
	e('iFiledata').value = buf;
	
}
/**
 *
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

window.onload=testGetSwfSize;
