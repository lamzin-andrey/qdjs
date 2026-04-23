function CSourceListCreator() {
	this.targetExts = ["js"];
}

/**
 * @override Мне абсолютно всё равно, перепишешь ли ты этот файл, или унаследуешь новый.
 * @description получает список файлов, которые надо обработать.
 * В данном случае это рекурсивный сбор всех js файлов из каталога,
 *  но логика в целом может быть любой, например сбор файлов в том же порядке, в каком они указаны
 *   в index.html
*/
CSourceListCreator.prototype.getFilesList = function(root) {
	return this.scandir(root);
}


CSourceListCreator.prototype.scandir = function(root) {
	var ls, z, i, j, r, pi, o;
	o = this;
	r = [];
	ls = FS.scandir(root);
	z = sz(ls);
	for (i = 0; i < z; i++) {
		if (ls[i] == '.' || ls[i] == '..') {
			continue;
		}
		j = root + "/" + ls[i];
		if (FS.isDir(j)) {
			r = array_merge(r, o.scandir(j));
			continue;
		}
		pi = pathinfo(j);
		if (pi.extension in In(o.targetExts)) {
			r.push(j);
		}
	}
	return r;
}


