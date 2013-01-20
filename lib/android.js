var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');
var cp = require('child_process');
var path = require('path');
var request = require('request');

var ADT = function(path){
	this.path=path;
}

ADT.prototype.listDevices=function(onComplete){
	var str="";
	var exec = path.join(this.path,"platform-tools","adb");
	var proc = cp.exec(exec+" devices");


	proc.stdout.on("data",function(data){
		str+=data;	
	});

	proc.on("close",function(){
		var lines = str.split("\n");
		lines = lines.splice(1).filter(function(line){
			return line!='';
		}).map(function(line){
			return line.split("\t")[0];
		});
		return onComplete(null,lines);
	});

	proc.on("error",function(){
		return onComplete("Error listing android devices");
	});
}

ADT.prototype.log=Browser.log;
ADT.prototype.warn=Browser.warn;
ADT.prototype.error=Browser.error;

ADT.prototype.installAPK=function(device,file,onComplete){
	var self=this;
	var proc = cp.exec(path.join(this.path,"platform-tools","adb -s "+device+" -e install -r "+file)).on("close",function(){
		return onComplete(null,true);
	});

	proc.stdout.on("data",function(data) { self.log("Installing APK:", data); });
	proc.stderr.on("data",function(data) { self.log("Installing APK:", data); });
}

ADT.prototype.startApp=function(device,classPath,onComplete){
	var self=this;
	var proc = cp.exec(path.join(this.path,"platform-tools","adb -s "+device+" shell am start -a android.intent.action.MAIN -n "+classPath)).on("close",function(){
		return onComplete(null,true);
	});
	proc.stdout.on("data",function(data) { self.log("Starting APK:", data); });
	proc.stderr.on("data",function(data) { self.log("Starting APK:", data); });
}

ADT.prototype.portForward=function(device,fromPort,toPort,onComplete){
	var self=this;
	var proc = cp.exec(path.join(this.path,"platform-tools","adb -s "+device+" forward tcp:"+fromPort+" tcp:"+toPort)).on("close",function(){
		return onComplete(null,true);
	});
	proc.stdout.on("data",function(data) { self.log("Forwarding port:", data); });
	proc.stderr.on("data",function(data) { self.log("Forwarding port:", data); });
}



var Android = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.name="android";
}

Android.apkURL="http://selenium.googlecode.com/files/android-server-2.21.0.apk"
Android.apkClassPath="org.openqa.selenium.android.app/.MainActivity";

Android.prototype=new Browser();
Android.prototype.constructor=Android;

Android.homeDir=function(){
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

Android.prototype.installAPK=function(adt,device,onComplete){
	var dest = path.join(__dirname,"../ext/android");
	fs.mkdir(dest,function(){
		var file = path.join(dest,"andriod-server.apk");
		request(Android.apkURL).pipe(fs.createWriteStream(file)).on("close",function(){
			adt.installAPK(device,file,onComplete);
		});
	});
}

Android.prototype.isAvailable=function(onComplete,warn){
	var adt = ["adt-bundle-mac/sdk","android-sdk-macosx"];
	var paths = ["Desktop","/","/android" ];


	var ps = [];
	
	if(this.options && this.options.sdkPath){
		ps.push(this.options.sdkPath);
	}
	

	if(process.env["ANDROID_SDK"]){
		ps.push(process.env["ANDROID_SDK"]);
	}
	

	paths.map(function(place){
		adt.map(function(adtPath){
			ps.push(path.join(Android.homeDir(),place,adtPath));
		});
	});

	var foundLocation=null;
	
	var self=this;
	var found=false;
	for(var i in ps){
		var place = ps[i];
		if(fs.existsSync(place)){
				foundLocation=(place);
				break;
		}
	}
				
	if(foundLocation){
			self.adtPath=foundLocation;
			var found=true;
			var adt = new ADT(place);
			adt.listDevices(function(err,devices){
				if(devices.length>0){
					return onComplete(null,true);
				} else {	
					if(warn)
						self.warn("No active android devices found, please ensure that an android emulator or device is attached");
					return onComplete(null,false);
				}
			});
	} else {
		return onComplete(null,false);
	}
}

Android.prototype.isUp=function(onComplete){
	request("http://localhost:8080/wd/hub/status/",function(err,response,body){
		if(!err && response && response.statusCode==200){
				return onComplete(null,true);
		} else {
				return onComplete(null,false);
		}
	});

}

Android.prototype.prepare=function(onComplete){
		var self=this;
		this.isUp(function(err,isUp){

			if(isUp==true)
				return onComplete(null,true);

			var adt = new ADT(self.adtPath);
			adt.listDevices(function(err,devices){
				if(devices.length>0){
					self.log("Found devices: ",devices.join(", "));				

					self.log("* Installing apk");	
					self.installAPK(adt,devices[0],function(err,res){
						adt.startApp(devices[0],Android.apkClassPath,function(err,res){
							self.log("Forwarding port");
							adt.portForward(devices[0],8080,8080,function(err,res){
								self.log("Waiting for web driver to start");
								var pollForHttp=function(){
									self.isUp(function(err,res){
										if(res==true) return onComplete(null,true);
										else setTimeout(pollForHttp,200);
									});
								}
								pollForHttp();
							});
						});
					});
			

				} else {
					self.warn("No android devices found");
					return onComplete(null,false);
				}
			});	
		});

}


Android.prototype.openBrowser=function(url,onComplete){
  var AndroidWrapper  = Java.import('AndroidWrapper');
	var f = new AndroidWrapper();
	f.openBrowser(url,onComplete);
}

module.exports=Android;
