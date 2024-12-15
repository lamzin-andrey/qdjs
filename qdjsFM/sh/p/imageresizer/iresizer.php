<?php
// За всё про всё 21 минута


function utils_getImageMime($path, &$w = null, &$h = null) {
	$sz = @getImageSize($path);
	if (is_array($sz) && count($sz)) {
		$w = $sz[0];
		$h = $sz[1];
		return $sz["mime"];
	}
}
/**
 * @desc Функция ресайза jpg
 * @param string $srcFilename   - путь к файлу изображения в формате png
 * @param string $destFilename  - путь к файлу изображения в формате png
 * @param int   $destW - требуемая ширина изображения
 * @param int   $destH - требуемая высота изображения
 * @param int $quality = 80 - качество jpg
 * @param int $bgW = 0 ширина бэкграунда. Если она передана, уменьшенное изображение будет отцентровано по горизонтали на прямоугольники данной ширины
 * @param int $bgH = 0 высота бэкграунда. Если она передана, уменьшенное изображение будет отцентровано по вертикали на прямоугольнике данной высоты
 * @param array of int $color = [0, 0, 0] Цвет бэкграунда. Если переданы bgH и bgW, фон ыне уменьшенного изображения будет залит этим цветом
 * */
function utils_jpgResize($srcFilename, $destFilename, $destW, $destH, $quality = 80, $bgW = 0, $bgH = 0, $color = [0, 0, 0])
{
	if (!$img = imagecreatefromjpeg($srcFilename)) {
		throw new Exception('Ошибка формата изображения');
	}
	$sz = getImageSize($srcFilename);
	$srcW = $sz[0];
	$srcH = $sz[1];
	
	$outW = $bgW ? $bgW : $destW;
	$outH = $bgH ? $bgH : $destH;
	$dstX = 0;
	$dstY = 0;
	if ($bgH && $bgW) {
		$dstX = round(($bgW - $destW) / 2);
		$dstY = round(($bgH - $destH) / 2);
	}
	
	$output = imagecreatetruecolor($outW, $outH);
	$color = imagecolorallocate($output, $color[0], $color[1], $color[2]);
    
	imagefill($output, 0, 0, $color);
    imagecopyresampled($output, $img, $dstX, $dstY, 0, 0, $destW, $destH, $srcW, $srcH);
	if (!@imagejpeg($output, $destFilename, $quality)) {
    	throw new Exception('Ошибка сохранения изображения');
	}
}

function main($firstFile) {
	$maxW = 679;
	
	
	$a = explode('/', $firstFile);
	unset($a[count($a) - 1]);
	
	$dir = implode('/', $a);
	$ls = scandir($dir);
	foreach ($ls as $shortname) {
		if ($shortname == '.' || $shortname == '..') {
			continue;
		}
		$file = $dir . '/' . $shortname;
		$mime = utils_getImageMime($file);
		if ('image/jpeg' === $mime) {
			$sz = getImageSize($file);
			
			
			$destW = $sz[0];
			$destH = $sz[1];
			
			if ($sz[0] > $maxW) {
				$destW = $maxW;
				$sc = $maxW / $sz[0];
				$destH = round($destH * $sc);
				utils_jpgResize($file, $file, $destW, $destH, 100);
			}
			
		}
	}
}
main((isset($argv[1]) ? $argv[1] : '0'));
