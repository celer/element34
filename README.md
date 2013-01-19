# element34

element34 is a relatively small wrapper around selenium for nodejs

## Goals
 
 * Works on MacOSX and Linux
 * Can automatically detect which browsers are available and will take the necessary steps to use them
 * Supported browsers: firefox, chrome, opera, safari, android, ios
 

## Example

element34 primarily focuses on setting up the browser and performing all the necessary steps to just make things work, and when it does it will hand back
a browser object which implements the selenium API as documented here: http://seleniumhq.org/docs/02_selenium_ide.jsp#selenium-commands-selenese 

```javascript
	var element34 = require('../index.js');
	var assert = require('assert');


	element34.browsers(function(err,browsers){
		console.log("Installed browsers are:",browsers);
	});

	var b = new element34.chrome();

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
					});
				},1000);
			});	
		});
	});
```

## Installation 

```shell
	npm install element34
```

## Browsers

### Firefox

Firefox should just work

### Chrome

element34 will download a platform specific driver to get Chrome to work

### Opera

Opera should just work

### Safari

element34 will prompt for the installation of a safari extension which is required for Safari to work

### Android

element34 will attempt to locate the android sdk by looking in ~/  ~/Desktop/ and ANDROID_SDK for the location of the android SDK, if it is found
then element34 will see if any android devices are either being emulated or attached to the emulator, and if so it will install the requisite android
test application and connect to it. If it fails to detect an available device run 'adb devices' and see what is listed there.

### iOS / iPhone / iPad

Unfortunately the steps required to automate testing of iOS platforms aren't implemented yet, but if you follow the directions here and have an iOS emulator
running with the WebDriver app running then element34 will attempt to connect to it and perform testing. See here for details on how to install and compile the iOS webdriver:

http://code.google.com/p/selenium/wiki/IPhoneDriver

# Known issues
 
 * The chrome driver will occasional fail to download all the required drivers, re-running it will usually work
 * It is uncertain if iOS support works, make sure your using an iOS 5.x device
 
# License
	
element34 is under a MIT license 

# Attribution

element34 is based upon node-selenium-inproc by ddopson (https://github.com/ddopson/node-selenium-inproc)

