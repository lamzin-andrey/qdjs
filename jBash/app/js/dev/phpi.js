
window.PHPShadow = {
	isRun(n){console.log(`call PHP.isRun`);},
	file_get_contents(file){
		console.log("read " + file);
		return String(localStorage.getItem(file));
	},
	file_put_contents(file, data, flag){
		var t;
		if (flag) {
			t = localStorage.getItem(file);
			t = t ? t : '';
			data = t + data;
		}
		localStorage.setItem(file, data); 
		return String(data).length;
	},
	file_exists(file){
		var k = localStorage.getItem(file);
		return null !== k;
	},
	unlink(file){localStorage.removeItem(file);},
	is_dir(file){return true;},
	scandir(file){return [
		'bin',
		'dev',
		'etc'
	];},
	filesize(file) {
		var c = this.file_get_contents(file);
		return c.length;
	},
	savePng(file, data, q) {
		this.file_put_contents(file, data);
	},
	saveJpeg(file, data, q) {
		this.file_put_contents(file, data);
	},
	getSysId(){return 1;},
	exec(cmd, onFin, onStdout){console.log(`PHP run ${cmd}`);}
};
