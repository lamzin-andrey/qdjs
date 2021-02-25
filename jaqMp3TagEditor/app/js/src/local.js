var langEn = {
	'Готово!' : 'Done!',
	'В каталоге не найдено mp3 файлов' : 'Mp3 files not found in selected catalogue',
	'Нажмите кнопку ниже' : 'Press bottom button',
	'В каталоге найдено' : 'In catalogue found',
	'Выберите язык' : 'Select a language',
	'mp3 файлa' : 'mp3 files',
	'devicesListLegend' : 'Mp3 tags editing',// Редактирование тегов mp3 файлов
	'hNumberLabel' : 'Number', // Номер
	'hAutoincrement' : 'Autoincrement for next files',
	'hYearLabel' : 'Year',
	'hArtistLabel' : 'Artist',
	'hTitleLabel' : 'Title',
	'hCopyOrigin' : 'Copy title from file name',
	'hAlbumLabel' : 'Album',
	'hCommentLabel' : 'Comment',
	'hCommentSmallText' : 'In comment allow latin symbols only',
	'hGenreLabel' : 'Genre',
	'selectFileLegend' : 'Select catalogue with mp3 files',
	'bConvertNow' : 'Set tags',
	'bSelectDirectory' : 'Browse',
	'pBarLabel' : 'Progress',
	'hLangE' : 'English',
	'hLangR' : 'Russian',
	'bApplyLang' : 'Apply',
	'' : '',
	'' : ''
};

var jaqedLang = langEn;


window.addEventListener('load', function() {
	e('hCommentSmallText').innerHTML = L('hCommentSmallText');
}, false);
