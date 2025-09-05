window.addEventListener('load', dsuiOnLayoutLoad, false);
function dsuiOnLayoutLoad() {
	var h = getViewport().h, g = 'height';
	h = h + 'px';
	stl('sidebarPlace', g, h);
	stl('sidebar', g, h);
}
