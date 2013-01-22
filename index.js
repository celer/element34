var path = require('path');

var browsers = [ "firefox","chrome","opera","safari","ios","android" ];

var element34 = {
	
}


browsers.map(function(browser){
	element34[browser]=require(path.join(__dirname,"lib",browser));
});

element34.browsers=function(onComplete){
	onComplete=onComplete||function(){};
	var bs = browsers.slice(0);
	var bf = [];
	var checkBrowser = function(){
		var b = bs.shift();
		if(typeof b!="undefined"){
			var browser = new element34[b]();
			browser.isAvailable(function(err,res){
				if(res) bf.push(b);
				checkBrowser();
			},false);
		} else {
			return onComplete(null,bf);
		}
	}
	checkBrowser();	
}

/*
	Open the given URL with any browser, with the preference for browser being listed above in order
*/
element34.browser=function(url,onOpen){
	element34.browsers(function(err,browsers){
		if(browsers.length>0){
			var b = new element34[browsers[0]];
			b.open(url,function(err,browser){
				return onOpen(null,browser);
			});
		} else {
			return onOpen(null,null);
		}	
	});	
}		

module.exports=element34;
