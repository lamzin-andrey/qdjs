window.JBash = {
	start:function(){
		var ls, d, i, SZ, cF, dbg;
		d = this.baseDir = FS.getExternalStorage() + "/Android/data/land.learn242.hw/apps";
		if (!FS.fileExists(d)) {
			FS.mkdir(d);
		}
		if (!FS.fileExists(d) || !FS.isDir(d)) {
			dbg = FS.isDir(d) ? "iD true" : "iD false";
			showError("Error read " + d + ", dbg " + dbg); // TODO define it for ant!
			return;
		}
		ls = FS.scandir(this.baseDir);
		SZ = sz(ls);
		for (i = 0; i < SZ; i++) {
			if (ls[i] == "." || ls[i] == "..") {
				continue;
			}
			cF = d + "/" + ls[i];
			try {
				if (this.checkDirAsApp(cF)) {
					this.renderAppLogo(cF);
				}
			} catch (err) {
				console.log(err);
				alert(err);
			}
		}
	},
	renderAppLogo:function(dir){
		var tpl = this.getAppLogoTpl(), s, el, o = this;
		s = tpl.replace('{logo}', this.cAppLogo);
		s = s.replace('{name}', this.cAppName);
		el = appendChild(e("hApps"), "i", s, {
			"class": "hApp",
		}, {
			"dir": dir
		});
		onc(el, function(ev) {
			o.runApp(attr(ev.currentTarget, "data-dir"));
		});
	},
	runApp:function(dir){
		var area = e("hRunnedAppArea");
		// alert("Will run dir " + dir);
		
		try {
			this.clearArea(area);
			this.loadStyles(area, dir);
			this.loadHtml(area, dir);
			this.loadJs(area, dir);
			setTimeout(function() {
				try {
					window.main();
				} catch(err) {
					alert("Try run and err " + err);
				}
				
			}, 1000);
			
		} catch(err) {
			showError("In run App err: " + err);
		}
	},
	loadHtml:function(o, dir) {
		var file, i,
			a, c;
		file = dir + "/index.html";
		c = FS.readfile(file);
		a = c.split("<body>")[1];
		if (a) {
			a = a.split("</body>")[0];
			o.innerHTML += a;
		}
	},
	loadJs:function(o, dir) {
		var file, i,
			jsd = ["j", "js"], jsDirIsFound = 0,
			ls, SZ, cF, c;
		
		for (i = 0; i < sz(jsd); i++) {
			file = dir + "/" + jsd[i];
			if (FS.fileExists(file) && FS.isDir(file)) {
				jsDirIsFound = 1;
				break;
			}
		}
		if (jsDirIsFound) {
			showError("jsDirIsFound!");
			ls = FS.scandir(file);
			SZ = sz(ls);
			for (i = 0; i < SZ; i++) {
				cF = ls[i];
				if (cF == "." || cF == "..") {
					continue;
				}
				c = FS.readfile(file + "/" + cF);
				showError(c);
				eval(c);
			}
		} else {
			showError("jsDirNotFound");
		}
	},
	loadStyles:function(o, dir) {
		var file, i,
			csd = ["s", "css", "styles"], cssDirIsFound = 0,
			ls, SZ, cF, c;
		
		for (i = 0; i < sz(csd); i++) {
			file = dir + "/" + csd[i];
			if (FS.fileExists(file) && FS.isDir(file)) {
				cssDirIsFound = 1;
				break;
			}
		}
		if (cssDirIsFound) {
			ls = FS.scandir(file);
			SZ = sz(ls);
			for (i = 0; i < SZ; i++) {
				cF = ls[i];
				if (cF == "." || cF == "..") {
					continue;
				}
				c = FS.readfile(file + "/" + cF);
				o.innerHTML += "<style>" + c + "</style>";
			}
		}
	},
	clearArea:function(o){
		v(o, "");
	},
	getAppLogoTpl:function(){
		return '<img src="{logo}">\
				<u>{name}</u>';
	},
	checkDirAsApp:function(dir){
		var file = dir + "/logo.png", conf = {},
			log = dir + "/log.txt",
			jsd = ["j", "js"], i, mainIsFound = 0,
			csd = ["s", "css", "styles"], cssDirIsFound = 0, N = "\n";
		if (!FS.fileExists(file)) {
			FS.writefile(log, date("H:i:s") + " Not found " + file + N, 1);
			return 0;
		}
		this.cAppLogo = file;
		file = dir + "/conf.json";
		if (!FS.fileExists(file)) {
			FS.writefile(log, date("H:i:s") + " Not found " + file + N, 1);
			return 0;
		}
		try {
			conf = JSON.parse(FS.readfile(file));
		} catch (err) {
			conf = {};
		}
		if (!conf.name) {
			FS.writefile(log, date("H:i:s") + " Not found name in " + file + N, 1);
			return 0;
		}
		this.cAppName = conf.name;
		file = dir + "/index.html";
		if (!FS.fileExists(file)) {
			FS.writefile(log, date("H:i:s") + " Not found " + file + N, 1);
			return 0;
		}
		for (i = 0; i < sz(jsd); i++) {
			file = dir + "/" + jsd[i] + "/main.js";
			console.log("Check file " + file + N);
			if (FS.fileExists(file)) {
				mainIsFound = 1;
				break;
			}
		}
		if (!mainIsFound) {
			FS.writefile(log, date("H:i:s") + " Not found j/main.js or js/main.js in " + dir + N, 1);
			return 0;
		}
		
		for (i = 0; i < sz(csd); i++) {
			file = dir + "/" + csd[i];
			if (FS.fileExists(file) && FS.isDir(file)) {
				cssDirIsFound = 1;
				break;
			}
		}
		if (!cssDirIsFound) {
			FS.writefile(log, date("H:i:s") + " Not found `styles` or `css` or `s` directory" + N , 1);
			return 0;
		}
		
		return 1;
	}
}
