function showScreen(id) {
	var ls = cs(D, 'screen'), SZ = sz(ls), i;
	for (i = 0; i < SZ; i++) {
		hideScreen(ls[i]);
	}
	removeClass(id, 'hide');
	show(id);
}
function hideScreen(i) {
	hide(i);
}
