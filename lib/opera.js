var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');

var Opera = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.name="opera";
}

Opera.prototype=new Browser();
Opera.prototype.constructor=Opera;

Opera.prototype.isAvailable=function(onComplete){
	var paths = [ "/usr/bin/opera", "/usr/bin/opera-next", "/usr/bin/operamobile","/Applications/Opera.app/Contents/MacOS/Opera","/Applications/Opera Next.app/Contents/MacOS/Opera","/Applications/Opera Mobile Emulator.app/Contents/Resources/Opera Mobile.app/Contents/MacOS/operamobile", "%PROGRAMFILES%\Opera\opera.exe","%PROGRAMFILES%\Opera Next\opera.exe","%PROGRAMFILES%\Opera Mobile Emulator\OperaMobileEmu.exe"	];

	for(var i in paths){
		if(fs.existsSync(paths[i])){
			return onComplete(null,true);
		}
	}
}

Opera.prototype.openBrowser=function(url,onComplete){
  var OperaWrapper  = Java.import('OperaWrapper');
	var f = new OperaWrapper();
	f.openBrowser(url,onComplete);
}

module.exports=Opera;
