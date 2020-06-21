/**
 * @depends from https://github.com/lamzin-andrey/php2jstranslator (branch functions!)
 * @class Получает список методов PHP класса исходя из 
 * 	пути к корневой директории проекта, 
 * 	полного имени класса
 *  подстроки имени метода
*/
function PhpClassMethodsList() {
}
/***
 * @param {String} sProjectDir
 * @param {String} sClassName
 * @param {String} sSubstring
 * @return Array of String
*/
PhpClassMethodsList.prototype.parse = function(sProjectDir, sClassName, sSubstring) {
	//TODO грепнуть каталог проекта по имени класса
	//для каждого найденного файла
		//сравнить неймспейс с полученным в подстроке sClassName
		//выход их цикла
	//Если найден файл, передать его методу, юзающему php2js
	//Phpjs.translate
	//ClassParser.parse
	// В них посмотреть, помозговать
	return ['TODO PhpClassMethodsList.prototype.parse'];
}
