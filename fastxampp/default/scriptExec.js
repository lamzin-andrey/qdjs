function onCFinish(output, errors) {
	output += "\nComplete";
	if (output.length) {
		onCOut(output);
	}
	if (errors.length) {
		onCErr(errors);
	}
	var a = PHP.scandir('/home/andrey');
	if (a instanceof Array) {
		for (var i = 0; i < a.length; i++) {
			onCOut(a[i]);
		}
	} else {
		alert('No Atray');
	}
}
function onCOut(s) {
	document.getElementById('cout').innerHTML =  document.getElementById('cout').innerHTML + '<div style="color:blue">' + s + '</div>';
}
function onCErr(s) {
	document.getElementById('cout').innerHTML =  document.getElementById('cout').innerHTML + '<div style="color:red">' + s + '</div>';
}
function executeCCommand() {
	var s = document.getElementById('cepath').value;
	PHP.execCProcess(s, 'onCFinish', 'onCOut', 'onCErr');
}
