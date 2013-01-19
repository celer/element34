var Java = require('java');
var Browser = require('./browser');
var fs = require('fs');
var which = require('which');
var os = require('os');
var request = require('request');
var cp = require('child_process');
var path = require('path');

var Chrome = function(options){
	Browser.prototype.constructor.apply(this,arguments);
	this.name="chrome";
}

Chrome.prototype=new Browser();
Chrome.prototype.constructor=Chrome;

Chrome.prototype.prepare=function(onComplete){
	var self=this;
	var drivers = {
		linux_ia32: "http://chromedriver.googlecode.com/files/chromedriver_linux32_26.0.1383.0.zip",
		linux_ia64: "http://chromedriver.googlecode.com/files/chromedriver_linux64_26.0.1383.0.zip",
		darwin_x64: "http://chromedriver.googlecode.com/files/chromedriver_mac_26.0.1383.0.zip"
	}
	var what = os.platform()+"_"+os.arch();
	if(drivers[what]!=null){
		if(fs.existsSync(path.join(__dirname,"../ext/chrome_"+what,"chromedriver"))){
				self.options=self.options||{};
				self.options.properties=self.options.propertes||{};
				self.options.properties["webdriver.chrome.driver"]=path.join(__dirname,"../ext/chrome_"+what,"chromedriver");
				return onComplete(null,true);
		} else {
			fs.mkdir(path.join(__dirname,"../ext/chrome_"+what),function(){
				var file = path.join(__dirname,"../ext/chrome_"+what,"driver.zip");
				self.log("Downloading chrome driver to ",file);
				request(drivers[what]).pipe(fs.createWriteStream(file)).on("close",function(){
					self.log("Extracting chrome driver");
					var proc = cp.exec("(cd "+path.join(__dirname,"../ext/chrome_"+what)+" && unzip -q driver.zip)");
					proc.on("exit",function(){
						self.options=self.options||{};
						self.options.properties=self.options.propertes||{};
						self.options.properties["webdriver.chrome.driver"]=path.join(__dirname,"../ext/chrome_"+what,"chromedriver");
						setTimeout(function(){
							self.log("Ready to start chrome");
							return onComplete(null,true);
						},500);
					})
					proc.on("close",function(){
						console.log("done");
					});	
					proc.on("error",function(e){
						self.log("Error installing chrome driver",e);
						return onComplete("Error installing chrome driver:"+e);
					});
					proc.stdout.on("data",self.log);
					proc.stderr.on("data",self.warn);
				}).on("error",function(e){
					return onComplete("Error downloading chrome driver:"+e);
				});
			});
		}
	}	
}

Chrome.prototype.isAvailable=function(onComplete){
	var paths = [ "/usr/bin/google-chrome", "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome", "%HOMEPATH%i\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe", "C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe" ];
	for(var i in paths){
		if(fs.existsSync(paths[i])){
			return onComplete(null,true);
		}
	}
	if(os.platform()=="linux"){
		which("google-chrome",function(err,res){
			if(res!=null)
				return onComplete(null,true);
			else return onComplete(null,false);
		});	
	} 
}

Chrome.prototype.openBrowser=function(url,onComplete){
  var ChromeWrapper  = Java.import('ChromeWrapper');
	var f = new ChromeWrapper();
	var self=this;
	if(self.options && self.options.properties){
		for(var prop in self.options.properties){
			self.log("Setting ",prop,self.options.properties[prop]);
			f.setProperty(prop,self.options.properties[prop]);
		}
	}
	f.openBrowser(url,onComplete);
}

module.exports=Chrome;
