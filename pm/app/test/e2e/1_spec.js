//проверяет, содержит ли твой html <div id="helloProtractor">TrakTOR</div>
describe('First selenium test', function() {
	it('should contaiants #helloProtractor with text TrakTOR', function() {
		browser.get('http://0.0.0.0:8000/');
		expect(
			element(by.id('helloProtractor'))
				.getText()
		).toEqual('TrakTOR');
	});
});
