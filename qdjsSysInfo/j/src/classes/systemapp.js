function SysApp() {
	var o = this;
	o.slot = App.dir() + '/sh/o.sh';
	o.run();
}
/**
 * @param 
 * @param 
*/
SysApp.prototype.run = function() {
	var o = this;
	o.onSystemData();
	MW.setIconImage(App.dir() + '/i/exec32.png');
	AppEnv.init([o, o.onEnv], [o, o.onPreEnv]);
}
SysApp.prototype.onPreEnv = function() {
	// alert('ok');
}

SysApp.prototype.onEnv = function() {
	var batch = 'uname -v > ' + App.dir() + '/sh/v.txt\n';
	batch += 'ls -la > ' + App.dir() + '/sh/ls.txt\n';
	batch += 'lscpu > ' + App.dir() + '/sh/cpu.txt\n';
	batch += 'free > ' + App.dir() + '/sh/mem.txt\n';
	this.exec(batch, [this, this.onSystemData]);
}
SysApp.prototype.parseUser = function() {
	var file = App.dir() + '/sh/ls.txt', s, b = [], i, SZ, k, v, a, r = {name: (window.USER ? USER : '...'), grp:''};
	if (FS.fileExists(file)) {
		a = FS.readfile(file).split('\n');
		if (a[1]) {
			a = a[1].split(/\s/);
			
			SZ = sz(a);
			for (i = 0; i < SZ; i++) {
				if (a[i].trim()) {
					b.push(a[i].trim());
				}
			}
			a = b;
			
			r.name = a[2];
			r.grp = a[3];
		}
	}
	
	return r;
}

SysApp.prototype.parseSystemName = function() {
	var file = App.dir() + '/sh/v.txt', s, b = [], i, SZ, k, v, a, r = {name:'GNU/Linux', img:''};
	if (FS.fileExists(file)) {
		b = FS.readfile(file);
		s = b.split('~')[1];
		s = s.split('-')[0];
		if (b.indexOf('Ubuntu') != -1) {
			r.name = 'Ubuntu';
			if (FS.fileExists('/etc/xdg/xdg-xubuntu')) {
				r.name = 'Xubuntu';
				r.img = App.dir() + '/i/x.png';
			}
		} else {
			r.name = 'Linux';
		}
		r.name += ' ' + s;
	}
	
	return r;
}

SysApp.prototype.parseCPU = function() {
	var file = App.dir() + '/sh/cpu.txt', a = [], b = [], i, SZ, k, v, svHz,
		r = {
			vendor: '',
			model: '',
			hz: ''
		};
	if (FS.fileExists(file)) {
		a = FS.readfile(file).split('\n');
		SZ = sz(a);
		for (i = 0; i < SZ; i++) {
			b = a[i].split(':');
			k = String(b[0]).trim();
			v = String(b[1]).trim();
			if (k.indexOf('ID прроизводителя') != -1 || k.indexOf('ID производителя') != -1 || k.indexOf('Vendor ID') != -1) {
				r.vendor = v.trim();
			}
			if (k.indexOf('Имя модели') != -1 || (k.toLowerCase().indexOf('model') != -1 && k.toLowerCase().indexOf('name') != -1) ) {
				r.model = v.trim();
			}
			
			if (k.indexOf('CPU МГц') != -1 || k.indexOf('CPU MHz') != -1 && !r.hz) {
				r.hz = v.trim();
				r.hz = parseFloat(r.hz);
				if (!isNaN(r.hz)) {
					r.hz = round((r.hz / 1000), 2);
				} else {
					r.hz = v.trim();
				}
				svHz = r.hz;
			}
			
			if (k.indexOf('CPU max MHz') != -1) {
				r.hz = v.trim();
				r.hz = parseFloat(r.hz);
				if (!isNaN(r.hz)) {
					r.hz = round((r.hz / 1000), 2);
				} else {
					r.hz = v.trim();
				}
				if (!r.hz) {
					r.hz = svHz;
				}
			}
			
			
			
			/*if (r.hz && r.vendor && r.model) {
				break;
			}*/
		}
		
		if (!r.model) {
			r.model = r.vendor;
		}
	}
	return r;
}

SysApp.prototype.parseMem = function() {
	var file = App.dir() + '/sh/mem.txt', s = '', b = '', i, SZ,
		t, r = '', basic, swap, c;
	if (FS.fileExists(file)) {
		c = FS.readfile(file).split('\n');
		basic = c[1];
		if (basic) {
			basic = this.parseMemItem(basic);
		} else {
			basic = 0;
		}
		swap = c[2];
		if (swap) {
			swap = this.parseMemItem(swap);
		} else {
			swap = 0;
		}
		s = basic + swap;
		r = s / (1024*1024);
		b = 'GB';
		if (r < 1.0) {
			r *= 1024;
			b = 'MB';
		}
		r = Math.round(r) + ' ' + b;
	}
	
	return r;
}

SysApp.prototype.parseMemItem = function(s) {
	var SZ, i, t;
	s = s.split(/\s/);
	SZ = sz(s);
	for (i = 0; i < SZ; i++) {
		t = s[i];
		if (parseInt(t)) {
			s = parseInt(t);
			if (s) {
				return s;
			}
			
		}
	}
	return 0;
}

SysApp.prototype.onSystemData = function() {
	
	var systemName = this.parseSystemName(),
		userData = this.parseUser(),
		cpu = this.parseCPU(),
		mem = this.parseMem();
	e('hSyslemValue').innerHTML = systemName.name;
	if (systemName.img) {
		attr(e('icon'), 'src', systemName.img);
	}
	e('hUserNameValue').innerHTML = userData.name;
	e('hUserGroupValue').innerHTML = userData.grp;
	
	e('hPCVendorValue').innerHTML = cpu.vendor;
	e('hModel').innerHTML = cpu.model;
	e('hGz').innerHTML = cpu.hz;
	
	e('hRam').innerHTML = mem;
	
}
SysApp.prototype.exec = function(cmd, onFinish, onStd, onErr) {
	onFinish = onFinish ? onFinish : DevNull;
	onStd = onStd ? onStd : DevNull;
	onErr = onErr ? onErr : DevNull;
	
	cmd = '#!/bin/bash\n' + cmd;
	
	cmd += '\n';
	FS.writefile(this.slot, cmd);
	jexec(this.slot, onFinish, onStd, onErr);
}

window.onload = function(){
	try {
		new SysApp();
	} catch(err) {
		alert(err);
	}
}
