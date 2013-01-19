var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');

var Firefox = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.name="firefox";
}

Firefox.prototype=new Browser();
Firefox.prototype.constructor=Firefox;

Firefox.prototype.isAvailable=function(onComplete){
	var paths = ["/Applications/Firefox.app/Contents/MacOS/firefox-bin", "%PROGRAMFILES%\\Mozilla Firefox\\firefox.exe" ]
	if(os.platform()=="linux"){
		which("firefox",function(err,res){
			if(res!=null)
				return onComplete(null,true);
			else return onComplete(null,false);
		});	
	} else {
		for(var i in paths){
			if(fs.existsSync(paths[i])){
				return onComplete(null,true);
			}
		}
	}
}

Firefox.prototype.openBrowser=function(url,onComplete){
  var FirefoxWrapper  = Java.import('FirefoxWrapper');
	var f = new FirefoxWrapper();
	f.openBrowser(url,onComplete);
}

module.exports=Firefox;
