/**
 * Handlers:
 * var diskList = new DiskList();
 * diskList.onBuild = {
 * 	m: 'onBuildComplete',
 *  context: this
 * };
*/
function DiskList() {
	W.DiskListInstance = this;
}

DiskList.prototype.load = function() {
	PHP.exec('mount', 'DiskListControllerOnFin', 'Null', 'Null');
}

DiskList.prototype.onListSecondData = function(output, errors) {
//	alert(output);
if (errors) {
	alert(errors);
}
	
	var i, s, dls = [], ls = [], buf, item, q, j, line;
	s = output.split('\n');
	for (i = 0; i < this.firstLs.length; i++) {
		item = this.firstLs[i];
		buf = item.device.split('/');
		q = buf[sz(buf) - 1].substring(0, 3).trim();
		for (j = 0; j < s.length; j++) {
			line = s[j];
			if (line.indexOf(q) == 0) {
				buf = this.parseLsBlkLine(line);
				if (buf[2] == '1') {
					this.firstLs[i].isUsb = 1;
					// dls.push(1);
				} else {
					this.firstLs[i].isUsb = 0;
					// dls.push(0);
				}
			}
		}
		
	}
	
	
	if (this.onBuild && (this.onBuild.m instanceof Function) ) {
		this.onBuild.m.call(this.onBuild.context, this.firstLs);
	} else {
		alert('You must set handler diskList.onBuld = {m, context}');
	}
	
	// this.firstLs = ls;
}

DiskList.prototype.parseLsBlkLine = function(line) {
	var buf, i, j, s, r = [];
	buf = line.split(' ');
	for (i = 0; i < sz(buf); i++) {
		s = buf[i].trim();
		if (sz(s)) {
			r.push(s);
		}
	}
	
	return r;
}

DiskList.prototype.onListFirstData = function(output, errors) {
	
	var i, s, dls = [], ls = [], buf, item, q;
	s = output.split('\n');
	for (i = 0; i < s.length; i++) {
		if (s[i].indexOf('/dev') == 0) {
			item = {};
			buf = s[i].split('type');
			item.typestr = buf[1];
			buf = buf[0].split('on');
			item.device = buf[0].trim();
			item.dir = buf[1].trim();
			buf = item.dir.split('/');
			if (buf[1] == '') {
				item.name = '/';
			} else {
				item.name = buf[sz(buf) - 1];
			}
			dls.push(item.name + ' : ' + item.device);
			ls.push(item);
		}
	}
	
	this.firstLs = ls;
	// alert(dls.join('\n'));
	PHP.exec('lsblk', 'DiskListControllerOnLsBlk', 'Null', 'Null');
}




window.DiskListControllerOnFin = function(output, erros) {
	W.DiskListInstance.onListFirstData(output, erros);
}
window.DiskListControllerOnLsBlk = function(output, erros) {
	W.DiskListInstance.onListSecondData(output, erros);
}
