class PropsDlg {
	// interface
	setListeners(n) {
		let o = this, fr = "из";
		o.n = n;
		o.p = e(window.dlgMgr.getIdPref() + n);
		o.zAddE("bPerm");
		o.zAddE("bShared");
		o.zAddE("tPerm");
		o.zAddE("tProps");
		o.zAddE("bOk");
		o.zAddE("bCc");
		o.zAddE("nm");
		o.bShared.onclick = () => {o.showShared()}
		o.bPerm.onclick = () => {o.showPerm()}
		o.bOk.onclick = () => {o.onClickOk()}
		o.bCc.onclick = () => {o.onClickCancel()}
	}
	
	getDlgBtns() {
		return "001";
	}
	
	getDefaultTitle() {
		return L("Properties");
	}
	
	getIcon() {
		return "/d/drive/pc/i/cm/exec16.png";
	}
	
	getUniqName() {
		return "WUSBPropsModal";
	}
	
	getName() {
		return L("Properties");
	}
	
	// /interface
	
	h(d, i, id) {
	   let tpl, meas, bSz, szBytes, o = this;
	   o.id = id;
	   o.currentCid = fmgr.tab.currentFid;
	   o.srcName = d.name;
	   o.srcType = (d.type == "c" ? 'c' : 'f');
	   o.wid = currentCmTargetId;
	   bSz = o.zToBytesFrm(d.s);
	   szBytes = bSz.b;
	   meas = bSz.meas;
	   tpl = `<div c="props-dlg">
		   ${o.zTabsHtml()}
			<div c="w">
				<div c="tProps">
				   <div c="rLogo r">
					<img src="${i}" c="ic" onerror="fmgr.dlgProp.onErrLoadPreview(window.event)">
					<input type="text" c="nm" value="${d.name}">
					<div c="cf"></div>
				   </div>
				   <div c="brd">SP</div>
				   <div class="r">
					 <div c="kv">
					   <div c="k">${L("Location")}:</div>
					   <div c="v">${fmgr.tab.currentPath}</div>
					   <div c="cf"></div>
					 </div>
					 <div c="kv">
					   <div c="k">${L("Size")}:</div>
					   <div c="v">${bSz.h} (${szBytes} <span>${meas}</span>)</div>
					   <div c="cf"></div>
					 </div>
				   </div>
				   <div c="brd">SP</div>
				   <div class="r">
					 <div c="kv">
					   <div c="k">${L("Changed")}:</div>
					   <div c="v">${o.zDt(d.ct)}</div>
					   <div c="cf"></div>
					 </div>
					 <div c="kv">
					   <div c="k">${L("Uploaded")}:</div>
					   <div c="v">${o.zDt(d.ut)}</div>
					   <div c="cf"></div>
					 </div>
				   </div>
				 </div><!-- tProps -->
				 <div c="tPerm d-none">
					Here will permissions screen
				 </div>
			 </div><!-- /white -->
			 <div c="btns">
			   <input type="button" value="${L("OK")}" c="bOk">
			   <input type="button" value="${L("Cancel")}" c="bCc">
			 </div>
	   </div>`;
	   tpl = str_replace(" c=\"", " class=\"", tpl);
	   tpl = str_replace("SP", "&nbsp;", tpl);
	   return tpl;
	}
	
	zToBytesFrm(s) {
		let r;
		r = {};
		r.b = fmgr.tab.unpackHexSz(s, 1);
		r.h = fmgr.tab.unpackHexSz(s, 0);
		r.meas = TextFormatU.pluralize(intval(r.b), L("byte"), L("bytes"), L("bytesMore19"));
		r.b = TextFormatU.money(S(r.b));
		return r;
	}
	
	zDt(s) {
		let a, t, o = this;
		s = SqzDatetime.desqzDatetime(s, 1);
		a = s.split(' ');
		t = a[1];
		a = a[0].split('-');
		return o.zZ(a[2]) + ' ' + o.zM(a[1]) + ' ' + a[0] + ' ' + L("y.") + ", " + t;
	}
	
	zZ(d){
		if (d.charAt(0) == '0') {
			return d.replace('0', '');
		}
		return d;
	}
	
	zM(m) {
		let a = [0, "january", "february", "march", "april", "may", "june", "august", "septemper", "october", "november", "december"];
		m = this.zZ(m);
		return L(a[m]);
	}
	
	zTabsHtml() {
		return `<div c="tbs">
			<div c="bShared a">${L("Share")}</div>
			<div c="bPerm">${L("Permissions")}</div>
			<div c="cf"></div>
		</div>`;
	}
	
	
	zAddE(s) {
		this[s] = cs(this.p, s)[0];
	}
	
	onErrLoadPreview(evt) {
		let s;
			s = root + "/i/mi/unknown32.png";
			if (ctrg(evt).src != s) {
				ctrg(evt).src = s;
			}
	}
	
	onQuit() {
		fmgr.kbListener.activeArea = KBListener.AREA_TAB;
	}
	
	showShared() {
		let o = this;
		removeClass(o.bPerm, "a");
		addClass(o.bShared, "a");
		hide(o.tPerm);
		show(o.tProps);
	}
	
	showPerm() {
		let o = this;
		removeClass(o.bShared, "a");
		addClass(o.bPerm, "a");
		hide(o.tProps);
		show(o.tPerm);
	}
	
	onClickCancel() {
		fmgr.kbListener.activeArea = KBListener.AREA_TAB;
		dlgMgr.close(this.n);
	}
	
	onClickOk() {
		let o =  this, idx, cmId, newName, item;
		newName = v(o.nm);
		idx = intval(fmgr.tab.toI(o.wid));
		if (o.srcName != newName) {
			Rest2._post({
					i: o.id,
					s: newName,
					c: o.currentCid,
					t: o.srcType
				},
				DevNull, `${br}/drivern.json`, defaultResponseError, o
			);
			
			cmId = attr(o.wid, 'data-cmid');
			if (cmId) {
				item = fmgr.tab.list[idx];
				item.name = newName
				item.src.name = newName
				fmgr.tab.listRenderer.updateItem(idx, item);
			}
		}
		fmgr.kbListener.activeArea = KBListener.AREA_TAB;
		dlgMgr.close(o.n);
	}
}
