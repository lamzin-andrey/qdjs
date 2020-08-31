function AMarket() {
	text.innerHTML = 'Я не помню, что тут должно быть';
	setTimeout(function() {
		Qt.quit();
	}, 1000);
}
window.onload = function () {
	new AMarket();
};
