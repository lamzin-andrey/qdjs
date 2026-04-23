function CStyleCodeTranslator() {}

/**
 * @override
 * Здесь трансляция в C код javascript написанного по очень специфическим правилам
 * В других приложениях понадобится другая логика
 * */
CStyleCodeTranslator.prototype.translate = function(code){
	var ls, z, i;
	code = str_replace("/*typedef", "typedef", code);
	code = str_replace("/*t", "", code);
	code = str_replace("t*/", "", code);
	code = str_replace("/*&*/", "&", code);
	code = str_replace("function ", " ", code);
	code = str_replace(" = {};", ";", code);
	ls = code.split('\n');
	z = sz(ls);
	for (i = 0; i < z; i++) {
		if (this.isLinkStr(ls[i])) {
			ls[i] = ls[i].replace("/*r", "");
			ls[i] = ls[i].replace("r*/", "");
			ls[i + 1] = "";
		} else if (this.isVar(ls[i])) { // тут можно в лог писать если строка не вполне валидная
			ls[i] = this.processVar(ls[i]);
		}
	}
	return ls.join('\n');
}

/**
 * @override
 * Здесь путь выходного файла считается как root + "/output/relativePath"
 * Возможно в других приложениях понадобится другая логика
 * */
CStyleCodeTranslator.prototype.getOutputName = function(root, src){
	var pi, shortPath = src.replace(root, '');
	pi = pathinfo(shortPath);
	shortPath = pi.dirname + "/" + pi.filename + ".c";
	return root + "/output" + shortPath;
}

/**
 * @override Если хочешь
 */
CStyleCodeTranslator.prototype.process = function(root, src){
	var dest, src, code, o = this;
	o.src = src;
	dest = o.getOutputName(root, src);
	if (o.checkDest(dest)) {
		code = FS.readfile(src);
		code = o.translate(code);
		FS.writefile(dest, code);
	}
}

CStyleCodeTranslator.prototype.processVar = function(s) {
	var a, off, type, z, i, at, br, ch;
	a = s.split("var ");
	off = String(a[0]);
	a = a[1].split(",");
	type = a.shift().trim();
	z = sz(type) - 1;
	at = [];
	for (i = z; i > -1; i--) {
		ch = type.charAt(i);
		if (ch == 'z' && br != 1) {
			at.push('*');
		} else if (ch != 'z') {
			br = 1;
			at.push(ch);
		} else {
			at.push(ch);
		}
	}
	at.reverse();
	return off + at.join("") + a.join(",");
}

CStyleCodeTranslator.prototype.isVar = function(s) {
	var z, a, varP, q = s.trim();
	z = sz(q);
	varP = q.indexOf("var ");
	if (varP == 0 && q.charAt(z - 1) == ';' && q.indexOf(',', varP) > varP) {
		a = q.split(",");
		if (a[0].indexOf('=') == -1) {
			return true;
		}
	}
	return false;
}

CStyleCodeTranslator.prototype.isLinkStr = function(s) {
	var z, q = s.trim();
	z = sz(q);
	if (q.indexOf('/*r') == 0 && q.charAt(z - 1) == '/' && q.charAt(z - 2) == '*' && q.charAt(z - 3) == 'r') {
		return true;
	}
	return false;
}

CStyleCodeTranslator.prototype.checkDest = function(file){
	var shortPath, pi = pathinfo(file);
	if (FS.fileExists(pi.dirname) && FS.isDir(pi.dirname)) {
		return true;
	}
	FS.mkdir(pi.dirname);
	if (FS.fileExists(pi.dirname) && FS.isDir(pi.dirname)) {
		return true;
	}
	return false;
}
