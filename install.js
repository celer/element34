var request = require('request');
var path = require('path');
var fs = require('fs');
var cp = require('child_process');


console.log("Downloading selenium (this could take a while)");
request("http://selenium.googlecode.com/files/selenium-server-standalone-2.29.0.jar").pipe(fs.createWriteStream(path.join(__dirname,"ext/selenium-server-standalone.jar"))).on("close",function(){

	console.log("Compiling java");
	var proc = cp.exec("(cd lib/java && javac -classpath ../../ext/selenium-server-standalone.jar *.java)");

	proc.stdout.on("data",console.log);
	proc.stderr.on("data",console.log);

});
