var element34 = require('../index.js');
var assert = require('assert');

element34.browsers(function(error,browsers){
	
	var testBrowser = function(){
		var browser = browsers.shift();
		console.log("\n\n");
		console.log("Testing ",browser);
		console.log("---------------------------------");

		if(browser!=undefined){
			var b = new element34[browser]();

			b.open("http://seleniumhq.org",function(error,browser){
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
								testBrowser();
							});
						},1000);
					});	
				});
			});
		}
	}

	testBrowser();

});
