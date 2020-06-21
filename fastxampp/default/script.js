function save() {
	//var path = Qt.appDir() + "/out.txt";
	//var n = PHP.file_put_contents(path, document.getElementById('in').value);
	//alert(n);
	var s = document.getElementById('in').value;
	var re = new RegExp( document.getElementById('re').value,  document.getElementById('qu').value);
	s = s.replace(re, document.getElementById('rp').value);
	document.getElementById('out').value = s;
}
