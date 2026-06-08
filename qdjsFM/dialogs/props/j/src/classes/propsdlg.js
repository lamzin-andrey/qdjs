function PropsDlg() {
	var fst = '-', o = this;
	this.setListeners = function(n) {
		var o = this, fr = "из", i;
		
		o.n = n;
		o.p = cs(D, "props-dlg")[0];
		o.zAddE("bPerm");
		o.zAddE("bShared");
		o.zAddE("tPerm");
		o.zAddE("tProps");
		o.zAddE("bOk");
		o.zAddE("bCc");
		o.zAddE("nm");
		o.zAddE("ic");
		o.zAddE("tbs");
		o.zAddE("fLdr");
		
		o.bShared.onclick = function(){o.showShared()}
		
		e("bPerm").onclick = function() {o.showPerm()}
		e("iPerm").oninput = function(ev) {o.onInputNums(ev)}
		o.chmodMask = e("chmodMask");
		o.chmodMask.oninput = function(ev) {o.onInputSym(ev)}
		
		for (i = 1; i < 10; i++) {
			e("p" + i).onchange = function(){o.onChangeChb()}
		}
		
		
		o.bOk.onclick = function(){ o.onClickOk()}
		o.nm.onkeydown = function(ev){ ev.keyCode == 13 ? o.onClickOk() : 0}
		o.bCc.onclick = function(){o.onClickCancel()}
		o.devicesManager = new Devices();
	}
	
	this.getData = function() {
		o.fileName = App.getArgs()[0];
		o.pi = pathinfo(o.fileName);
		o.srcName = o.pi.basename;
		o.dirName = o.pi.dirname;
		o.exec("cd \"" + o.pi.dirname + "\"\nls -al --full-time \"" + o.pi.basename + "\"", [o, o.onFileData]);
	}
	this.exec = function(cmd, onFinish){
		var sh = App.dir() + "/sh/p.sh";
		cmd = "#!/bin/bash\n" + cmd + "\n";
		FS.writefile(sh, cmd);
		jexec(sh, onFinish, DevNull, DevNull);
	}
	this.onFileData = function(out, err){
		var it, b, c, z;
		it = createItem(out, o.pi.dirname);
		if (it.perms[0] == 'd') {
			b = o.fileName.split('/');
			it.name = b[sz(b) - 1];
			it.sz = '...';
			show(e("toIn").parentNode);
		}
		if (strtolower(it.type).indexOf("image") != -1) {
			o.exec("cp -f \"" + o.fileName + "\" " + App.dir() + "/i/t." + o.pi.extension, onCopyImg);
		}
		o.it = it;
		o.ic.src =  it.i;
		o.setEditName();
		v("hLocV", o.pi.dirname);
		if (it.sz != '...') {
			setSize(it);
		} else {
			v("hSizeV", it.sz);
			o.exec("find " + o.fileName + " -type f -exec stat --format=\"%s\" {} \\; | awk '{s+=$1} END {printf \"%d bytes\\n\", s}'", [o, o.onCatalogSize]);
		}
		v("hChangedV", o.zDt(it.mt));
		fst = it.perms[0];
		o.srcPerms = it.perms;
		
		o.setPermInputs(it.perms);
		
		
		show(o.tbs);
		show(o.tProps);
		hide(o.fLdr);
	}
	
	
	function onCopyImg(){
		var f = App.dir() + "/i/t." + o.pi.extension;
		if (FS.fileExists(f)) {
			e("imLogo").addEventListener("load", onLoadPreview);
			e("imLogo").src = f;
		}
	}
	
	function onLoadPreview(){
		var im = e("imLogo"), vl = e("hDimeV");
		v(vl, im.naturalWidth + " x " + im.naturalHeight + " " + L("px"));
		show(vl.parentNode);
	}
	
	this.onCatalogSize = function(out, err){
		o.it.rsz = intval(out);
		o.it.sz = o.devicesManager.pluralizeSize(o.it.rsz, true);
		try {
			setSize(o.it);
		} catch(err){alert(err)}
	}
	
	function setSize(it){
		var b, z, c;
		b = it.rsz;
		z = TextTransform.money(o.devicesManager.toBytes(String(b)));
		c = TextTransform.pluralize(String(z), L("byte"), L("bytes"), L("byte"));
		v("hSizeV", it.sz + " (" + z + " " + c + ")");
	}
	
	this.setEditName = function(){
		v(o.nm, o.pi.basename);
	}
	
	
	this.h = function(d, i, id) {
	   var tpl, meas, bSz, szBytes, o = this;
	   // TODO есть шанс, что не вызывается никогда
	   alert("Call popsdlg::h()");
	   o.id = id;
	   o.currentCid = fmgr.tab.currentFid;
	   o.srcName = d.name;
	   o.srcType = (d.type == "c" ? 'c' : 'f');
	   o.wid = currentCmTargetId;
	   bSz = o.zToBytesFrm(d.s);
	   szBytes = bSz.b;
	   meas = bSz.meas;
	   tpl = '<div c="props-dlg">';
	   tpl = str_replace(" c=\"", " class=\"", tpl);
	   tpl = str_replace("SP", "&nbsp;", tpl);
	   return tpl;
	}
	this.zToBytesFrm = function(s) {
		var r;
		r = {};
		// TODO check it!
		r.b = fmgr.tab.unpackHexSz(s, 1);
		r.h = fmgr.tab.unpackHexSz(s, 0);
		// TODO check TextFormatU
		r.meas = TextFormatU.pluralize(intval(r.b), L("byte"), L("bytes"), L("bytesMore19"));
		r.b = TextFormatU.money(S(r.b));
		return r;
	}
	
	this.zDt = function(s) {
		var a, t, o = this;
		//s = SqzDatetime.desqzDatetime(s, 1);
		a = s.split(' ');
		t = a[1];
		a = a[0].split('-');
		return o.zZ(a[2]) + ' ' + o.zM(a[1]) + ' ' + a[0] + ' ' + L("y.") + ", " + t;
	}
	
	this.zZ = function(d){
		if (d.charAt(0) == '0') {
			return d.replace('0', '');
		}
		return d;
	}
	
	this.zM = function(m) {
		var a = [0, "january", "february", "march", "april", "may", "june", "august", "septemper", "october", "november", "december"];
		m = this.zZ(m);
		return L(a[m]);
	}
	
	this.zTabsHtml = function() {
		return '<div c="tbs">' + 
			'<div c="bShared a">' + L("Share") + '</div>' + 
			'<div c="bPerm">' + L("Permissions") + '</div>'+ 
			'<div c="cf"></div>' + 
		'</div>';
	}
	
	
	this.zAddE = function(s) {
		this[s] = cs(this.p, s)[0];
	}
	
	this.onErrLoadPreview = function(evt) {
		var s;
		// TODO define root
			s = root + "/i/mi/unknown32.png";
			if (ctrg(evt).src != s) {
				ctrg(evt).src = s;
			}
	}
	
	this.onQuit = function() {
		// TODO это наверняка не нужно
		// fmgr.kbListener.activeArea = KBListener.AREA_TAB;
	}
	
	this.showShared = function() {
		var o = this;
		removeClass(o.bPerm, "a");
		addClass(o.bShared, "a");
		hide(o.tPerm);
		show(o.tProps);
	}
	
	this.showPerm = function() {
		var o = this;
		removeClass(o.bShared, "a");
		addClass(o.bPerm, "a");
		hide(o.tProps);
		show(o.tPerm);
	}
	
	this.onClickCancel = function() {
		App.quit();
	}
	
	this.onClickOk = function() {
		var o =  this, cmId, newName, item, fullNN;
		newName = v(o.nm);
		if (o.srcName != newName) {
			fullNN = o.dirName + "/" + newName;
			if (FS.fileExists(fullNN)) {
				alert(L("File with this name already exists"));
				return;
			}
			o.exec("mv \"" + o.fileName + "\" \"" + fullNN + "\"", [App, App.quit]);
			return;
		}
		o.savePermissions();
		//App.quit();
	}
	
	this.savePermissions = function(){
		var actualPerms = v("chmodMask"), SP = " ", r = "";
		if (fst == "d" && e("toIn").checked) {
			r = "-R"
		}
		if (actualPerms != o.srcPerms) {
			o.exec("chmod " + r + SP + v("iPerm") + SP + "\"" + o.fileName + "\"", onPermsChanged);
		}
	}
	
	function onPermsChanged(out, err){
		var cmd, sh;
		if (err) {
			cmd = "#!/bin/bash\npkexec " + App.dir() + "/sh/p.sh";
			sh = App.dir() + "/sh/r.sh";
			FS.writefile(sh, cmd);
			jexec(sh, onPermsChanged, DevNull, DevNull);
		} else {
			App.quit();
		}
	}
	
	// ====
	
	
	this.setPermInputs = function(s){
		var a = o.fullChmodMaskToANum(s), n;
		n = (a[0] + a[1] + a[2]);
		v("iPerm", n);
		o.prevPrems = n;
		o.onInputNums();
	}
	
	this.onInputMask = function() {
	   var s = v("chmodMask"), a = o.fullChmodMaskToANum(s);
	   v("iPerm", (a[0] + a[1] + a[2]));
	}
	
	this.onChangeChb = function(){
		setTimeout(onChangeChbT,100);
	}
	
	function onChangeChbT(){
		var i, t, s = fst;
		for (i = 1; i < 10; i++) {
			t = e("p" + i).checked ? "1" : "-";
			if (t == "1") {
				if (i == 1 || i == 4 || i == 7) {
					t = 'r';
				}
				if (i == 2 || i == 5 || i == 8) {
					t = 'w';
				}
				if (i == 3 || i == 6 || i == 9) {
					t = 'x';
				}
			}
			s += t;
		}
		o.setPermInputs(s);
	}
	
	this.fullChmodMaskToANum = function(s) {
	   var i, a = [], j;
	   for (i = 1; i < s.length; i++) {
		 if (i >= 1 && i <= 3) {
			 j = 0;
		  }
		 if (i >= 4 && i <= 6) {
			 j = 1;
		  }
		 if (i >= 7 && i <= 9) {
			 j = 2;
		  }
		 if (String(a[j]) == 'undefined') {
			a[j] = '';
		 }
		a[j] += s[i];
		 
	   }//end for s

	   for (i = 0; i < 3; i++) {
		 a[i] = o.chmodMaskToNum(a[i]);
	   }
	   return a;
	}

	this.chmodMaskToNum = function(s) {
	   s = String(s);
	   if (s == 'undefined') {
		  return '0';
	   }
	   var ch, sN = '';
	   ch = s[0];
	   sN += (ch == 'r' ? '1' : '0');
	   ch = s[1];
	   sN += (ch == 'w' ? '1' : '0');
	   ch = s[2];
	   sN += (ch == 'x' ? '1' : '0');
	   var n = parseInt(sN, 2);
	   return String(n); 
	}
	
	this.onInputSym = function(){
		var a, i, s = v(o.chmodMask);
		if (!(s[0] in In('-', 'd', 'l'))) {
			//o.onInputNums();
			return;
		}
		for (i = 1; i < 10; i++) {
			if (!(s[i] in In('-', 'r', 'w', 'x'))) {
				//o.onInputNums();
				return;
			}
		}
		a = o.fullChmodMaskToANum(s);
		v("iPerm", (a[0] + a[1] + a[2]));
		o.onInputNums();
	}

	this.onInputNums = function(ev) {
		var s = String(v("iPerm")), sR, invalid;
		
		if (s.length > 3) {
			s = s.substring(1, 4);
		}
		n = o.chmodReadOneNumber(s[0]);
		if (n > 7) {
			invalid = 1;
		}
		sR = o.chmodNumToMask(n);
		n = o.chmodReadOneNumber(s[1]);
		if (n > 7) {
			invalid = 1;
		}
		sR += o.chmodNumToMask(n);
		n = o.chmodReadOneNumber(s[2]);
		if (n > 7) {
			invalid = 1;
		}
		if (invalid) {
			if (o.prevPerm) {
				v("iPerm", o.prevPerm);
			}
			return;
		}
		sR += o.chmodNumToMask(n);
		sR = fst + sR;
		v(o.chmodMask, sR);
		o.setCheckboxes(sR);
		o.prevPerm = v("iPerm");
	}
	
	this.setCheckboxes = function(sR) {
		var i, id, ch;
		for (i = 1; i < sz(sR); i++) {
			id = "p" + i;
			ch = sR.charAt(i);
			e(id).checked = (ch != '-');
		}
	}

	this.chmodReadOneNumber = function(s) {
		var n = parseInt(s);
		if (isNaN(n)) {
			n = 0;
		}
		return n;
	}
	
	this.chmodNumToMask = function(n) {
		switch (n) {
			case 0:
				return '---';
			case 1:
				return '--x';
			case 2:
				return '-w-';
			case 3:
				return '-wx';
			case 4:
				return 'r--';
			case 5:
				return 'r-x';
			case 6:
				return 'rw-'
			case 7:
				return 'rwx';
		}
	}
	
	// =====
}
