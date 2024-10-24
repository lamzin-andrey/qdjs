function CTryZavrUI() {}
CTryZavrUI.prototype.init = function() {
	this.setListeners();
}
CTryZavrUI.prototype.setListeners = function() {
	var o = this;
	o.textview = e('iSample');
	o.out = e('iOut');
	e('bStart').onclick = function() {
		o.onClickGenerate();
	};
	
	o.lm = e("iLM");
	o.lmShortDesc = e("hLMComment");
	o.setMlShortdesc();
	o.lm.onchange = function() {
		o.setMlShortdesc();
	}
	
	o.profiles = e("iProfiles");
	o.profilesShortDesc = e("hProfileComment");
	o.setProfilesShortdesc();
	o.profiles.onchange = function() {
		o.setProfilesShortdesc();
	}
}

CTryZavrUI.prototype.setProfilesShortdesc = function() {
	var o = this,
		name = v(o.profiles),
		opts = o.profiles.options,
		i, SZ = sz(opts),
		k = "iNumInferenceSteps",
		g = "iGuidanceScale";
	for (i = 0; i < SZ; i++) {
		if (opts[i].value == name) {
			v(o.profilesShortDesc, attr(opts[i], "data-comm"));
		}
	}
	
	switch (name) {
		case "oldPicture":
			v(k, 12);
			v(g, 0.25);
			break;
		case "standartWebUI":
			v(k, 20);
			v(g, 7.0);
			break;
	}
}

CTryZavrUI.prototype.setMlShortdesc = function() {
	var o = this,
		lmName = v(o.lm),
		opts = o.lm.options,
		i, SZ = sz(opts);
	for (i = 0; i < SZ; i++) {
		if (opts[i].value == lmName) {
			v(o.lmShortDesc, attr(opts[i], "data-comm"));
		}
	}
}
CTryZavrUI.prototype.onClickGenerate = function() {
        var self = this, o = this, prompt = v(self.textview), command2;
        try {
			FS.unlink(App.dir() + "/stable-diffusion/log.log");
			self.setText(prompt);
			self.tickStop = 0;
			self.ival = setInterval(function() {
				self.onTick();
			}, 3*1000);
			
			command2 = "#!/bin/bash\ntime python3 "
			 + App.dir() + "/stable-diffusion/tryZavr.py \"" + prompt + "\""
			 + ' "' + v(o.lm) + '" '
			 + ' ' + v("iNumInferenceSteps") + ' '
			 + ' ' + v("iGuidanceScale") + ' '
			 + " > " + App.dir() + "/stable-diffusion/log.log 2>&1 &";
			FS.writefile(App.dir() + "/data/o.sh", command2);
			Env.exec(App.dir() + "/data/o.sh", DevNull, DevNull, DevNull);
		} catch(err) {
			alert(err);
		}
}

CTryZavrUI.prototype.onTick = function() {
	var c, self = this, a, countPct, percentStr, s, i, sz;
	try {
		if (self.tickStop == 1) {
			return;
		}
		c = FS.readfile(App.dir() + "/stable-diffusion/log.log");
		if (strpos(c, "Done!") !== false) {
			self.tickStop = 1;
			clearInterval(self.ival);
			Env.exec("xdg-open " + App.dir() + "/../0T2.jpg", DevNull, DevNull, DevNull);
		}
		
		a = c.split("\n");
		sz = count(a);
		
		a = this.patchSplit(a, "it]");
		a = this.patchSplit(a, "it/s]");
		sz = count(a);
		
		
		
		s = "";
		i = sz - 4;
		if (i <  0) {
			i = 0;
		}

		countPct = 0;
		percentStr = "";
		while (i < sz) {
			s += a[i] + "\n";
			if (strpos(a[i], "%|", 0) !== false || a[i].trim() == "") {
				countPct += 1;
			}
			if (strpos(a[i], "%|", 0) !== false) {
				percentStr = a[i];
			}
			i += 1;
		}
		if (countPct == 4) {
			s = a[sz - 1];
		}
		if (percentStr != "") {
			s = percentStr;
			percentStr = "";
		}
		
		try {
			self.setText(s);
		} catch(err){
			FS.writefile(App.dir() + "/stable-diffusion/log.log", "");
		}
	} catch(err) {
		alert("onTick:" + err);
	}
}


CTryZavrUI.prototype.setText = function(s) {
	v(this.out, s);
	setCaretPosition(this.out, 10000);
}


CTryZavrUI.prototype.patchSplit = function(a, sp) {
	var b, i, sz, j, bSz, aB;
	b = [];
	sz = count(a);
	for (i = 0; i < sz; i++) {
		aB = explode(sp, a[i]);
		bSz = count(aB);
		for (j = 0; j < bSz; j++) {
			if (bSz > 1) {
				b.push(aB[j] + sp);
			} else {
				b.push(aB[j]);
			}
			
		}
	}
	
	return b;
}

function setCaretPosition(ta, pos)  {
	var input = ta;
	if (input.readOnly) return;	
	if (input.value == "") return;	
	if ((!pos)&&(pos !== 0)) return;
	var f = 0;
	try {f = input.setSelectionRange;}
	catch(e){;}
	if(f)	{
		input.focus();		
		try{
			input.setSelectionRange(pos,pos);
		}catch(e){
			//если находится в контейнере с style="display:none" выдает ошибку
		}
	}else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}
