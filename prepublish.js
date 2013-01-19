var cp = require('child_process');

cp.exec("rm -rf ext/").on("close",function(){;
	cp.exec("mkdir ext/");
});
