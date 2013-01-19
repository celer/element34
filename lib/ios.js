var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');
var request = require('request');

var iOS = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.options.deviceURL = this.options.deviceURL || "http://localhost:3001/";
	this.name="ios";
}

iOS.prototype=new Browser();
iOS.prototype.constructor=iOS;

iOS.prototype.isAvailable=function(onComplete){	
	if(os.platform()=="darwin"){
		var url = this.options.deviceURL+"wd/hub";
		request(url,function(err,request,body){
			if(!err && request.statusCode==200 && body.indexOf("iWebDriver")!=-1){
				return onComplete(null,true);
			} else {
				return onComplete(null,false);
			}
		});

	} else return onComplete(null,false);
}

iOS.prototype.openBrowser=function(url,onComplete){
  var iOSWrapper  = Java.import('iOSWrapper');
	var f = new iOSWrapper();
	f.setDeviceURL(this.options.deviceURL);
	f.openBrowser(url,onComplete);
}

module.exports=iOS;
