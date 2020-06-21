Итак, 13 09 2019

Распаковывать gz пока будем через запуск php скрипта.

Нужно добавить аргумент offset, limit в функцию Qt.readFileAsBinaryString.
Также нужна Qt.copyFileBytes(src, dest, srcOffset, srcLimit = -1); //if -1 - бесконечно.






------------
File libpepflashplayer.so
из архива flash_player_ppapi_linux.x86_64-2019-03-27.tar.gz (дата в конец добавлена мной)
просто скопирован в /usr/lib
 - и в FF после перезапуска заработало всё.
 
Теперь проверить, будет ли работать в qt

 - Очень печально, но не работает на ноуте с такой же системой.
 И вычисление для полноэкранного режима всё-таки нужно

Код из index.html не работает в FF при открытии в браузере локальной страницы, но это скорее всего не страшно
Bingo = в qt работает.
Осталось вспомнить, как там определялись размеры)
Понятно, что начиная с 9-ого байта идёт структура RECT определяющая размер файла
Перейти к её описанию
итак, 9-ый байт - это unsigned длина каждой из 4-ёх переменной
Умножаем на 4, прибавляем 5, делим на 8  и получаем кол-во байт с 9-ого по X в которых хранится инфа.

RECT
Field Type Comment
Nbits UB[5] Bits in each rect value field
Xmin SB[Nbits] x minimum position for rect
Xmax SB[Nbits] x maximum position for rect
Ymin SB[Nbits] y minimum position for rect
Ymax SB[Nbits] y maximum position for rect

header curveball
70,87,83,5,181,8,1,0,112,0,13,172,0,0,156,64,0,30,115,0,67,2,0,0,0,191,3,185,5,0,0,1,0,38,111,21,0,0,125,6,255,227,32,192,0,0,0,2,88,1,64,0,0,240,51,200,129,102,27,32,6,60,24,19,17,173,48,55,246,192,225,139,238,132,14,187,80,14,78,109,253,128,196,141,3,34,68,5,11,131,99,159,248,130,130,148,30,200,0,224,255,240,109,152,90,56,156,196,0,40,142,63,255,192,8,32,54,208,64,1,31,148,136,128,92,255,255,254,24,172,64,48,219,8,33,20,26,100,48,136,12,127,255,255,255,227,32,192,91,37,67,230,128,1,148,160,0,248,96,49,0,196,160,44,129,192,61,151,13,8,24,173,199,24,98,79,255,255,255,199,3,14,97,4,42,40,128,21,8,161,0,42,22,199,32,112,10,95,255,255,255,255,252,116,10,80,46,12,78,229,113,65,139,44,151,38,255,155,233,186,225,77,171,145,10,75,88,141,237,33,179,64,141,197,106,165,76,152,148,11,24,191,197,218,136,187,180,92,255,227,32,192,33,18,136,226,201,145,216,48,1,181,41,169,158,47,27,218,154,170,127,237,85,109,143,56,242,212,79,65,249,52,177,190,111,197,248,255,253,228,73,23,32,167,154,18,239,224,86,177,21,245,0,192,16,113,88,172,104,152,29,6,109,13,82,37,141,178,180,183,61,127,255,255,255,252,124,24,8,103,255,255,255,229,14,23,18,59,255,255,253,77,56,40,71,255,255,253,11,155,49,228,255,227,32,192,49,16,195,38,211,242,74,142,218,142,60,223,255,245,48,241,169,167,29,255,155,25

real size (php) 350 x 250
 - для несжатого сошлось..
 
 Так как минмумы равны 0 ширина и высота в прямом коде
 
Декомпресс с костылем на питоне (работает)
Есть файл test.py
по быстрому сделанный из 
https://github.com/jspiro/swf2lzma/blob/master/swf2lzma.py

Пока ручками так делаю:
test.py swcfile.swf swf.swf
Затем в полученный swf.swf дописываю 8 любых байт, и уже из него заголовок отдаю своей 
getSwfSize.
Пока только на двух файлах проверил, один оказался на flex, но работает!
Найти аналог Qt.zlibdecompress или как-то так, не хочется зависеть ещё и от питона...
В сжатом файле данные разжимать начиная с 8 байта

Возможно тут есть что-то путное на php
https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=8&cad=rja&uact=8&ved=2ahUKEwiL69mDmLLhAhXlwYsKHRsmAU0QFjAHegQIBRAB&url=https%3A%2F%2Fphp.net%2Fmanual%2Fru%2Ffunction.gzcompress.php&usg=AOvVaw0IW8_18vFMvVjssC4Ie-mH
Искать по " I tested this by uncompressing compressed SWF file and then compressed th"

Главное что не даёт покоя: это же обычный gz который есть в любой бубунте!
И поидее как-то можно распотрошить его обычным вызовом gzip

testungz.php - справляется, надо только аккуратно первые 8 байт выпилить 

Пример кода на cpp

gzFile inFileZ = gzopen(fileName, "rb");
if (inFileZ == NULL) {
    printf("Error: Failed to gzopen %s\n", filename);
    exit(0);
}
unsigned char unzipBuffer[8192];
unsigned int unzippedBytes;
std::vector<unsigned char> unzippedData;
while (true) {
    unzippedBytes = gzread(inFileZ, unzipBuffer, 8192);
    if (unzippedBytes > 0) {
        unzippedData.insert(unzippedData.end(), unzipBuffer, unzipBuffer + unzippedBytes);
    } else {
        break;
    }
}
gzclose(inFileZ);

Но делать буду скорее всего как тут
https://eax.me/zlib/
а рабочий код он выложил тут:
https://github.com/afiskon/c-zlib-example

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdint.h>
#include <errno.h>
#include <limits.h>
#include <zlib.h>

int main(int argc, char* argv[])
{
	int res;

	if(argc < 2)
	{
		fprintf(stderr, "Usage: %s <fname>\n", argv[0]);
		return 1;
	}

	char* fname = argv[1];

	struct stat file_stat;
	res = stat(fname, &file_stat);
	if(res == -1)
	{
		fprintf(stderr, "stat(...) failed, errno = %d\n", errno);
		return 1;
	}

	size_t temp_file_size = (size_t)file_stat.st_size;
	if(temp_file_size >= INT_MAX)
	{
		fprintf(stderr, "Error: filze_size >= INT_MAX (%d)\n", INT_MAX);
		return 1;
	}

	int file_size = (int)temp_file_size;
	int buff_size = file_size + 1;
	void* file_buff = malloc(buff_size);
	if(file_buff == NULL)
	{
		fprintf(stderr, "malloc(buff_size) failed, buff_size = %d\n",
			file_size);
		return 1;
	}

	int fid = open(fname, O_RDONLY);
	if(fid == -1)
	{
		fprintf(stderr, "open(...) failed, errno = %d\n", errno);
		free(file_buff);
		return 1;
	}

	if(read(fid, file_buff, file_size) != file_size)
	{
		fprintf(stderr, "read(...) failed, errno = %d\n", errno);
		free(file_buff);
		close(fid);
		return 1;
	}

	close(fid);

	uLongf compress_buff_size = compressBound(file_size);
	void* compress_buff = malloc(compress_buff_size);
	if(compress_buff == NULL)
	{
		fprintf(stderr,
			"malloc(compress_buff_size) failed, "
			"compress_buff_size = %lu\n",
			compress_buff_size);
		free(file_buff);
		return 1;
	}

	uLongf compressed_size = compress_buff_size;
	res = compress(compress_buff, &compressed_size, file_buff, file_size);
	if(res != Z_OK)
	{
		fprintf(stderr, "compress(...) failed, res = %d\n", res);
		free(compress_buff);
		free(file_buff);
		return 1;
	}

	memset(file_buff, 0, buff_size);
	uLongf decompressed_size = (uLongf)file_size;
	res = uncompress(file_buff, &decompressed_size,
		compress_buff, compressed_size);
	if(res != Z_OK)
	{
		fprintf(stderr, "uncompress(...) failed, res = %d\n", res);
		free(compress_buff);
		free(file_buff);
		return 1;
	}

	printf(
		"%s\n----------------\n"
		"File size: %d, compress_buff_size: %lu, compressed_size: %lu, "
		"decompressed_size: %lu\n",
		(char*)file_buff, file_size, compress_buff_size, compressed_size,
		decompressed_size);

	free(compress_buff);
	free(file_buff);
}


Тем не менее пока делаю с использованием php

------------------------------------------------------------------------ 
Оставляю для общего развития

Декомпресс на AS (пока с ним не справился, скорее всего дело элементарно в том, что это алгоритм разжатия LZMAа в моих флешках используется zlib)

 
 The following is an example for uncompressing a file using ActionScript.

var data:ByteArray = File.readByteArray(file) data.endian = "littleEndian" var version:uint = data.readUnsignedInt() switch (version&0xffffffff) { ... case 90|87<<8|83<<16: // SWZ = lzma compressed     if (doDecompressOnly)     System.exit(0)     udata=new ByteArray     udata.endian = "littleEndian"     var ptr;

// put lzma properties in 0-4 for (ptr=0;ptr<5;ptr++) {     udata[ptr]=data[12+ptr] } // calculate uncompressed length, subtract 8 (remove header bytes) var scriptlen:uint=data[4]+(data[5]<<8)+(data[6]<<16)+(data[7]<<24)-8; // write lzma properties bytes: 0-4 for (ptr=0;ptr<4;ptr++) {     udata[5+ptr]=data[8+ptr] }

// write the uncompressed length: 5-8  udata[5]=scriptlen&0xFF; udata[6]=(scriptlen>>8) & 0xFF; udata[7]=(scriptlen>>16) & 0xFF; udata[8]=(scriptlen>>24) & 0xFF;// add 4 extra 0 to compressed length: 9-12 for (ptr=0;ptr<4;ptr++) {     udata[9+ptr]=0 }

data.position = 17 data.readBytes(udata,13,data.length-data.position) udata.position=0 csize = udata.length udata.uncompress(CompressionAlgorithm.LZMA) infoPrint("decompressed swf "+csize+" -> "+udata.length) /*var swf:Swf =*/ new Swf(udata) break




