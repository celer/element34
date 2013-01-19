var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');
var cp = require('child_process');
var path = require('path');

var Safari = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.name="safari";
}

Safari.prototype=new Browser();
Safari.prototype.constructor=Safari;

Safari.prototype.isAvailable=function(onComplete){
	if(os.platform()=="darwin"){	
		return onComplete(null,true);
	} else return onComplete(null,false);
}

Safari.homeDir=function(){
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

Safari.prototype.prepare=function(onComplete){
	var installedExt = path.join(Safari.homeDir(),"Library/Safari/Extensions/WebDriver.safariextz");
	var self=this;
	if(!fs.existsSync(installedExt)){
		var extPath = path.join(__dirname,"../res/safari/SafariDriver.safariextz");		
		var toPath = path.join(__dirname,"../res/safari/element34.SafariDriver.safariextz");
		fs.createReadStream(extPath).pipe(fs.createWriteStream(toPath));
		cp.exec("open "+toPath);
	
		var start = Date.now();
		var waitForInstall=function(){
			fs.exists(installedExt,function(res){
				if(!res){
					self.log("Waiting for safari extension install");
					if(Date.now()-start > 60*1000){
						self.warn("Gave up on waiting for safari extension install");
						return onComplete(null,false);
					} else {
						setTimeout(waitForInstall,1000);
					}
				} else {
					setTimeout(function(){
						return onComplete(null,true);		
					},2000);
				}
			});
		}
		waitForInstall();
		
	} else {
		return onComplete(null,true);
	}
}

Safari.prototype.openBrowser=function(url,onComplete){
  var SafariWrapper  = Java.import('SafariWrapper');
	var f = new SafariWrapper();
	f.openBrowser(url,onComplete);
}

module.exports=Safari;
