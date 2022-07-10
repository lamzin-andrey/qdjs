function NavbarPanel() {
	this.btnUp   = e('btnUp');
	this.btnBack = e('btnBack');
	this.btnFwd  = e('btnFwd');
	this.btnHome = e('btnHome');
}
NavbarPanel.prototype.setPath = function(path) {
	console.log('NavbarPanel get path ' + path);
}
