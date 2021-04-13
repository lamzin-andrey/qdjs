var langEn = {
	'Готово' : 'Done',
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
	
	// qdjsVC keys
	'menuItemFirst' : 'Settings',
	'menuItemFirstFront' : 'Settings',
	'hMMenuSetsConv' : 'Convertation',
	'hMMenuSetsLang' : 'Languauge / Язык',
	'menuItem' : '&nbsp;',
	'hNothingSourceLbl' : 'Nothing to do',
	'hRemoveSourceLbl' : 'Remove source files',
	'hMoveSourceLbl' : 'Move source files in catalog',
	'hRemoveMetaLbl' : 'Remove *.meta files',
	'hSettingsDlgTitle' : 'Convertation parameters',
	'hAfterConvertSubtitle' : 'After processing',
	'bsettingsDlgOk' : 'Save',
	
	'bLangDlgOk' : 'Save',
	'bLangEnLbl' : 'English',
	'bLangRuLbl' : 'Russian',
	
	'toMp3' : 'to MP3',
	'toAVI' : 'to AVI',
	'hPlusVideoText' : 'Video',
	'Выберите mp4 или mts файл': 'Select mp4 or mts file',
	'hConvertationInProcess': 'Convertation in process...',
	'Прервано пользователем' : 'Interrupted from user',
	'' : ''
};

var jaqedLang = langEn;



window.addEventListener('load', onLoadLocale, false);

function onLoadLocale(app) {
	try {
		if (!app) {
			app = window.app;
		}
		var dlg = app.langDlg;
		var sets = dlg.loadSettings();
		if (sets.lang == 'bLangRu') {
			jaqedLang = langRu;
		} else {
			jaqedLang = langEn;
		}
	} catch (errL) {
		// alert(errL);
	}
	
	setOneDivLocale('menuItemFirstFront');
	setOneDivLocale('hSettingsDlgTitle');
	setOneDivLocale('hAfterConvertSubtitle');
	setOneDivLocale('bsettingsDlgOk');
	setOneDivLocale('bLangDlgOk');
	setOneDivLocale('toMp3');
	setOneDivLocale('toAVI');
	if (setLocale instanceof Function) {
		setLocale();
	}
}
