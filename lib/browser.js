var Java = require('java');
var fs = require('fs');
var path = require('path');
var colors = require('colors');

var extDir = fs.realpathSync(__dirname + '/../ext');

fs.readdirSync(extDir).map(function(jarname) {
	var abspath;
	abspath = fs.realpathSync(extDir + '/' + jarname);
	Java.classpath.push(abspath);
	return found = true;
});
Java.classpath.push(__dirname);
Java.classpath.push(path.join(__dirname,"java"));


var Browser = function(options,name){
	this.options=options||{};
}

Browser.log=function(){
	var args = Array.prototype.slice.call(arguments, 0);
	var line = args.join(" ");
	console.log(line.white);
}

Browser.warn=function(){
	var args = Array.prototype.slice.call(arguments, 0);
	var line = args.join(" ");
	console.log(line.yellow);
}

Browser.error=function(){
	var args = Array.prototype.slice.call(arguments, 0);
	var line = args.join(" ");
	console.log(line.red);
}

Browser.prototype.log=Browser.log;
Browser.prototype.warn=Browser.warn;
Browser.prototype.error=Browser.error;

Browser.prototype.isAvailable=function(onComplete){
	return onComplete(null,true);
}

Browser.prototype.prepare=function(onComplete){
	return onComplete(null,true);
}

Browser.prototype.openBrowser=function(url,onComplete){
	return onComplete("Unimplemented");
}

Browser.prototype.open=function(url,onComplete){
	var self = this;
	self.isAvailable(function(err,available){	
		if(err) return onComplete(err);
		if(available){
			self.prepare(function(err,ready){
				if(err) return onComplete(err);
				if(ready){
					self.openBrowser(url,onComplete);
				} else return onComplete("Failed to prepare browser to run - "+err);	
			});
		} else {
			return onComplete(null,null);
		}
	});
}




module.exports=Browser;
