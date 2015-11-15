exports.config = {
	
	specs: ['../test/e2e/**/*.js'],

	onPrepare: function() {
		browser.driver.get('http://localhost:3000');
		browser.driver.findElement(by.id('entrar'))
			.click();
		// Login no GitHub
		browser.driver.findElement(by.id('login_field'))
			.sendKeys('usertest-github');
		browser.driver.findElement(by.id('password'))
			.sendKeys('usertest123');
		browser.driver.findElement(by.name('commit'))
			.click();
	}

}