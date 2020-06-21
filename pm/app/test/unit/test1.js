describe('appTest', function() {
	describe('appControllersTest', function() {
		beforeEach(module('nameApp'));
		
		it('should be N = 65', inject(function($controller, $injector) {
			var o = {};
			$controller('mainController', {$scope:o});
			expect(o.N == 65 ).toBe(true);
		}));
	});
});
		