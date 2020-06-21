var o = self, n = 1;
setInterval(function(){
	o.postMessage('tick ' + n);
	n++;
}, 1000);
