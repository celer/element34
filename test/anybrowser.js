var assert = require('assert');
var element34 = require('../index');

element34.browser("http://seleniumhq.org/",function(error,browser){
	assert.equal(error==null,true);
	if(browser==null){
		return console.error("Browser not found");
	}
	browser.open("/",function(){
		browser.getTitle(function(error,title){
			console.log(title);
			assert.equal(title.indexOf("Selenium"),0);
			setTimeout(function(){
				browser.close(function(){
				});
			},1000);
		});	
	});
});
