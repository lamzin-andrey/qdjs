// An example configuration file.
exports.config = {
	//две следующих строки взаимозаменяемы со следующей после них, но при использовании seleniumAddress
		//требуется запустить селениум отдельной командой в терминале
		//nodejs ./node_modules/protractor/bin/webdriver-manager start
	chromeDriver: './../node_modules/protractor/selenium/chromedriver',
	directConnect: true,/**/
	//seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
	// Capabilities to be passed to the webdriver instance.
	capabilities: {
	'browserName': 'chrome'
	},

  // Framework to use. Jasmine 2 is recommended.
  framework: 'jasmine2',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['../test/e2e/*.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
		showColors:true,
		defaultTimeoutInterval: 30000
  }
};
