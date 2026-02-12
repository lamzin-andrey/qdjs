var langEn = {
	'Готово!' : 'Done!',
	'hLabelCatalog' : 'Catalog with DTO classes',
	'hAutonullLegend' : 'Auto prefix \'?\' before types',
	'bSelectDirectory' : 'Browse',
	'hLangE' : 'English',
	'hLangR' : 'Russian',
	'bAddField' : 'Add field',
	'bGenerate' : 'Generate',
	'bRemove' : 'Remove',
	'' : ''
};

var jaqedLang = langEn;


window.addEventListener('load', function() {
	e('hCommentSmallText').innerHTML = L('hCommentSmallText');
}, false);

window.addEventListener('load', setLocalePropsDlg, false);

function setLocalePropsDlg() {
	var ls = ee(document, 'legend'), i, sZ = sz(ls),
		textById;
	for (i = 0; i < sZ; i++) {
		if (ls[i].id) {
			ls[i].innerHTML = L(ls[i].id);
		}
	}
	
	ls = ee(document, 'label');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].id) {
			ls[i].innerHTML = L(ls[i].id);
		}
	}
	
	ls = ee(document, 'div');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].hasAttribute('id') && !hasClass(ls[i], "tPerm") && ls[i].id != "tPermContainer") {
			ls[i].innerHTML = L(ls[i].id);
		}
	}
	
	ls = ee(document, 'input');
	sZ = sz(ls);
	for (i = 0; i < sZ; i++) {
		if (ls[i].type == 'button') {
			textById = L(ls[i].id);
			if (textById) {
				ls[i].value = textById;
			} else {
				textById = parseClassForButtonId(attr(ls[i], 'class'));
				ls[i].value = L(textById);
			}
		}
	}
}
