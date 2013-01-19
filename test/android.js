var element34 = require('../index.js');
var assert = require('assert');

var b = new element34.android();

b.open("http://seleniumhq.org",function(error,browser){
	console.log(arguments);
	assert.equal(error,null);
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
