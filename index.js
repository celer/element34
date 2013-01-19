var path = require('path');

var browsers = [ "firefox","chrome","safari","ios","android","opera" ];

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

module.exports=element34;
