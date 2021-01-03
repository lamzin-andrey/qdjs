<?php
namespace Landlib;

class RusLexicon {
	/**
	 * Возвращает форму единицы измерения в зависимости от величины числа n
	 * @param n - число
	 * @param one окончание в ед. числе (один день)
	 * @param less4 окончание при величине числа от 1 до 4 (два дня)
	 * @param more19 окончание при величине числа более 19 (двадцать дней)
	 * @return string
	*/
	static public function getMeasureWordMorph($n, $one, $less4, $more19)
	{
		$m = strval($n);
		if (strlen($m) > 1) {
			$m =  intval( $m[ strlen($m) - 2 ] . $m[ strlen($m) - 1 ] );
		}
		$lex = $less4;
		 if ($m > 20) {
			$r = strval($n);
			$i = intval( $r[ strlen($r) - 1 ] );
			if ($i == 1) {
				$lex = $one;
			} else {
				if ($i == 0 || $i > 4) {
					$lex = $more19;
				}
			}
		} else if ($m > 4 || $m == '00') {
			$lex = $more19;
		} else if ($m == 1) {
			$lex = $one;
		}
		return $lex;
	}
	/**
	 * Change a russian cyrilic city name as answer on question "Is Where?"
	 * Изменяет имя города в соответствии с правилами русского языка, ответ на вопрос "где?"
	 * @param string $s UTF-8 cyrillic name of the city Имя города кириллицей
	 * @return string
	*/
	public static function getCityNameFor_In_the_City(string $s) : string
	{
		//Не изменяется
		if ($s == 'Марий Эл') {
			return $s;
		}
		$s = trim($s);
		$g = 'аеёиоуыэюя';
		$sg = 'бвгджзйклмнпрстфхцчшщъь';
		$g = static::_cp1251($g);
		$sg = static::_cp1251($sg);
		$s = static::_cp1251($s);
		
		if (strpos($s, ' ') !== false) {
			$ar = explode(' ', $s);
			$first = str_replace(
				array( static::_cp1251('ой '), static::_cp1251('ая '),  static::_cp1251('ое '), static::_cp1251('ый '), static::_cp1251('ие '), static::_cp1251('ые '), static::_cp1251('кий '), static::_cp1251('ий '),  ),
				array( static::_cp1251('ом '), static::_cp1251('ой '), static::_cp1251('ом '), static::_cp1251('ом '), static::_cp1251('их '), static::_cp1251('ых '), static::_cp1251('ком '),  static::_cp1251('ем ') ),
				$ar[0]
			);
			$second = $ar[ count($ar) - 1];
			if ($second == static::_cp1251('Яр')) {
				return static::_utf8($s);
			}
			static::_modLastLetter($second, $sg);
			$s = static::_utf8(trim($first)) . ' ' . static::_utf8($second); 
		} else {
			static::_modLastLetter($s, $sg);
			$s = static::_utf8(strval($s));
		}
		return $s;
	}
	/**
	 * Изменяет последнюю букву в имени города
	 * Change last letter in the city name
	 * @param string &$second
	 * @param string $sg
	 * @return string
	*/
	private static function _modLastLetter(&$second, $sg) : void
	{
		$secondSRep = 0;
		$lastLetter = isset($second[strlen($second) - 1]) ? $second[strlen($second) - 1] : '';
		$preLastLetter = ($second[ strlen($second) - 2] ?? '');
		$preLastLetter2 = ($second[ strlen($second) - 3] ?? '' );
		$msog = static::_cp1251('н');
		if ( strpos($sg, $lastLetter) === false ) {
			if ($lastLetter == static::_cp1251('е')) {
				$secondSRep = 1;
				$second = str_replace(
					array( static::_cp1251('ае '),  static::_cp1251('ое '), static::_cp1251('ый '), static::_cp1251('ие '), static::_cp1251('ые ') ),
					array(static::_cp1251('ае'), static::_cp1251('ом'), static::_cp1251('ом'), static::_cp1251('их'), static::_cp1251('ых') ),
					$second . ' ',
					$cnt
				);
			}
			if ($lastLetter == static::_cp1251('а')) {
				$lastLetter = static::_cp1251('е');
			}
			if ($lastLetter == static::_cp1251('ы')) {
				$lastLetter = static::_cp1251('ах');
			}
			if ($lastLetter == static::_cp1251('и')) {
				if (strpos($msog, $preLastLetter) === false) {
					$lastLetter = static::_cp1251('ах');
				} else {
					$lastLetter = static::_cp1251('ях');
				}
			}
			if ($lastLetter == static::_cp1251('я') && $preLastLetter != static::_cp1251('а')) {
				$lastLetter = static::_cp1251('и');
			}
		} else { 
			if ($lastLetter == static::_cp1251('ь')) {
				if (strpos($msog, $preLastLetter) !== false) {
					$lastLetter = static::_cp1251('и');
				} else {
					$lastLetter = static::_cp1251('е');
				}
			}else if ($lastLetter == static::_cp1251('й')) {
				$secondSRep = 1;
				$second = str_replace(
					array( static::_cp1251('ий '),  static::_cp1251('ай '), static::_cp1251('ый '), static::_cp1251('ой '), static::_cp1251('ей') ),
					array(static::_cp1251('ом'), static::_cp1251('ае'), static::_cp1251('ом'), static::_cp1251('ом'), static::_cp1251("ее") ),
					$second . ' '
				);
			}else {
				$lastLetter .= static::_cp1251('е');
			}
		}
		if (!$secondSRep) {
			if ( strlen($lastLetter) == 1 ) {
				$second[ strlen($second) - 1 ] = $lastLetter;
			} else {
				$second = substr($second, 0, strlen($second) - 1);
				$second .= $lastLetter;
			}
		}
		trim($second);
	}
	/**
	 * @param string $s
	 * @return string
	**/
	public static function cp1251(string $s) : string
	{
		return static::_cp1251($s);
	}
	/**
	 * @param string $s
	 * @return string
	**/
	private static function _cp1251(string $s) : string
	{
		return mb_convert_encoding($s, 'WINDOWS-1251', 'UTF-8');
	}
	/**
	 * Конвертит win1251 utf8 если строка в windows-1251
	 * @param string $s
	 * @return string
	**/
	public static function utf8(string $s) : string
	{
		return self::_utf8($s);
	}
	/**
	 * Конвертит win1251 utf8 если строка в windows-1251
	 * @param string $s
	 * @return string
	**/
	private static function _utf8(string $s) : string
	{
		return mb_convert_encoding($s, 'UTF-8', 'WINDOWS-1251');
	}
}
