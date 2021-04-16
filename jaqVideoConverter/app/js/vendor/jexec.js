function jExec() {}
/**
 * @description Run system command.
 * @param {String} command (command for call)
 * @param {Function|Object|Array} onFinish. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Function|Object|Array} onStdout. See onFinish format
 * @param {Function|Object|Array} onError. See onFinish format
 * @return Array [sysId, procId] sysId - system process id in linux; procId - handle for get sysId with PHP.getSysId(procId);
*/
jExec.prototype.run = function(command, onFinish, onStdout, onStderr) {
	var sOnFinishname = this.generateName('onFinish'),
		sOnOutname = this.generateName('onStdout'),
		sOnErrorname = this.generateName('onStderr'),
		o = this;
	
	window[sOnFinishname] = function(stdout, stderr) {
		o.apply(onFinish, [stdout, stderr]);
	}
	window[sOnOutname] = function(stdout) {
		o.apply(onStdout, [stdout]);
	}
	window[sOnErrorname] = function(stderr) {
		o.apply(onStderr, [stderr]);
	}
	
	var procId = PHP.exec(command, sOnFinishname, sOnOutname, sOnErrorname),
		sysId = parseInt(PHP.getSysId(procId));
	sysId = isNaN(sysId) ? 0 : sysId;
	
	return [sysId, procId];
}
/**
 * @param {Function|Object|Array} callable. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Array} args
*/
jExec.prototype.apply = function(callable, args) {
	var cback = callable,
		w = window,
		isF  = ( cback instanceof Function ),
		ctx, f;

	if(cback && isF) {
		ctx = w;
		f = cback;
	}
	  
	if (
		cback && cback.m instanceof Function
		&& (cback.context instanceof Object)
		){
			ctx = cback.context;
			f = cback.m;
	}
	  
	if (cback && cback[0] instanceof Object &&  cback[1] instanceof Function) {
		ctx = cback[0];
		f = cback[1];
	}
	  
	if (f instanceof Function){
		return f.apply(ctx, args);
	}
	  
	return null;
}
/**
 * @param {String}
*/
jExec.prototype.generateName = function(prefix) {
	var dt = new Date(), suffix = String(dt.getTime()) + String(Math.random()).replace('.', '_');
	return prefix + suffix;
}

/**
 * @see Jexec.run
*/
function jexec(command, onFinish, onStdout, onStderr) {
	var o = new jExec();
	return o.run(command, onFinish, onStdout, onStderr);
}
