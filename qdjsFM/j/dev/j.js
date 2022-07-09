function AddJ(){

//1.0.1
//location this file relative djs.exe: "default/tools/js/j.js"
window.QtBrige = {
	/**
	 * {String} callback
	 * {String} stdout
	 * {String} stderr
	*/
	onFinish:function(callback, stdout, stderr) {
		if (window[callback] instanceof Function) {
			var re = new RegExp(Qt.getLineDelimeter(), 'mg');
			var out = stdout.replace(re, '\n'),
				stderr = stderr.replace(re, '\n');
			window[callback](out, stderr);
		}
	}
};

PHP.scandir = function(path) {
	var re = new RegExp(Qt.getLineDelimeter(), 'mg');
	var arr = PHP._scandir(path).split(re), i, b = [];
	for (i = 0; i < arr.length; i++) {
		b.push(arr[i].replace(path + '/', ''));
	}
	return b;
}

window.FILE_APPEND = 1;

/** @class localize */
window.addEventListener('load', __jqtCreateLocalizator, false);
function __jqtCreateLocalizator()
{
	// Set xdg-open for all links
	__jqtSetXdgOpenForLinks();
	
	var locale = document.getElementsByTagName('html')[0].getAttribute('lang'),
		filePath = Qt.appDir() + '/js/ru.json', loc;
	if (PHP.file_exists(filePath)) {
		try {
			loc = JSON.parse( PHP.file_get_contents(filePath) );
			//TODO здесь будет локализация
		} catch(e) {;}
		if (!loc) {
			//alert('Unable parse JSON data');
			return;
		}
		//Локализуем все value в input[type=button] и весь label.innerHTML
	} else {
		//alert(filePath);
	}
}


// class jexec
function jExec() {}
/**
 * @description Run system command.
 * @param {String} command (command for call)
 * @param {Function|Object|Array} onFinish. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Function|Object|Array} onStdout. See onFinish format
 * @param {Function|Object|Array} onError. See onFinish format
 * @return Array [sysId, procId] sysId - system process id in linux; procId - handle for get sysId with PHP.getSysId(procId);
*/
jExec.prototype.run = function(command, onFinish, onStdout, onStderr) {
	var sOnFinishname = this.generateName('onFinish'),
		sOnOutname = this.generateName('onStdout'),
		sOnErrorname = this.generateName('onStderr'),
		o = this;
	
	window[sOnFinishname] = function(stdout, stderr) {
		o.apply(onFinish, [stdout, stderr]);
	}
	window[sOnOutname] = function(stdout) {
		o.apply(onStdout, [stdout]);
	}
	window[sOnErrorname] = function(stderr) {
		o.apply(onStderr, [stderr]);
	}
	
	var procId = PHP.exec(command, sOnFinishname, sOnOutname, sOnErrorname),
		sysId = parseInt(PHP.getSysId(procId));
	sysId = isNaN(sysId) ? 0 : sysId;
	
	return [sysId, procId];
}
/**
 * @param {Function|Object|Array} callable. Object: {context:Object, method:Function}. Array: [context:Object, method:Function]
 * @param {Array} args
*/
jExec.prototype.apply = function(callable, args) {
	var cback = callable,
		w = window,
		isF  = ( cback instanceof Function ),
		ctx, f;

	if(cback && isF) {
		ctx = w;
		f = cback;
	}
	  
	if (
		cback && cback.m instanceof Function
		&& (cback.context instanceof Object)
		){
			ctx = cback.context;
			f = cback.m;
	}
	  
	if (cback && cback[0] instanceof Object &&  cback[1] instanceof Function) {
		ctx = cback[0];
		f = cback[1];
	}
	  
	if (f instanceof Function){
		return f.apply(ctx, args);
	}
	  
	return null;
}
/**
 * @param {String}
*/
jExec.prototype.generateName = function(prefix) {
	var dt = new Date(), suffix = String(dt.getTime()) + String(Math.random()).replace('.', '_');
	return prefix + suffix;
}

/**
 * @see Jexec.run
*/
window.jexec = function(command, onFinish, onStdout, onStderr) {
	var o = new jExec();
	// return o.run(command, onFinish, onStdout, onStderr);
	if (command.indexOf('/user.sh') != -1) {
		onFinish[1].call(onFinish[0], `user
vasya
isXfce
PID
xfdesktop
isKde
PID
isMint
xfceThemeName
oxygen
qdjsVersion
3.1.1
		`);
		return 1;
	}
	
	if (command.indexOf('ls -l /dev/disk/by-label') != -1) {
		onFinish[1].call(onFinish[0], `итого 0
lrwxrwxrwx 1 root root 10 июл  9 08:30 D -> ../../sdb4
lrwxrwxrwx 1 root root 10 июл  9 08:30 home -> ../../sdb6
lrwxrwxrwx 1 root root 10 июл  9 08:30 KINGSTON -> ../../sdc1
lrwxrwxrwx 1 root root 10 июл  9 08:30 root -> ../../sdb5
`);
	}
	
	if (command.indexOf('ls -l /dev/disk/by-uuid') != -1) {
		onFinish[1].call(onFinish[0], `итого 0
lrwxrwxrwx 1 root root 10 июл  9 08:30 0abf242d-4b8f-44a3-ae15-0bd886a54a87 -> ../../sdb6
lrwxrwxrwx 1 root root 10 июл  9 08:30 1857dfb3-8de2-4471-9568-893470302fed -> ../../sda2
lrwxrwxrwx 1 root root 10 июл  9 08:30 4382E231601357E1 -> ../../sdb4
lrwxrwxrwx 1 root root 10 июл  9 08:30 7742B4FB466F3284 -> ../../sda5
lrwxrwxrwx 1 root root 10 июл  9 08:30 9bcc8b5c-210d-4baa-af30-fc42b4bce565 -> ../../sda3
lrwxrwxrwx 1 root root 10 июл  9 08:30 BEB1-4B9F -> ../../sdb1
lrwxrwxrwx 1 root root 10 июл  9 08:30 CC1EB9EA1EB9CDA8 -> ../../sdb3
lrwxrwxrwx 1 root root 10 июл  9 08:30 e69e2dbe-9e21-41a7-98e7-7a918da9c85a -> ../../sdb5
lrwxrwxrwx 1 root root 10 июл  9 08:30 EE7E-2D3A -> ../../sdc1
`);
	}
	
	if (command.indexOf('mount') != -1) {
		onFinish[1].call(onFinish[0], `sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
udev on /dev type devtmpfs (rw,nosuid,relatime,size=15355148k,nr_inodes=3838787,mode=755)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,noexec,relatime,size=3082652k,mode=755)
/dev/sda2 on / type ext4 (rw,relatime,errors=remount-ro)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k)
tmpfs on /sys/fs/cgroup type tmpfs (ro,nosuid,nodev,noexec,mode=755)
cgroup on /sys/fs/cgroup/unified type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate)
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,name=systemd)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)
cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls,net_prio)
cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpu,cpuacct)
cgroup on /sys/fs/cgroup/rdma type cgroup (rw,nosuid,nodev,noexec,relatime,rdma)
cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)
cgroup on /sys/fs/cgroup/hugetlb type cgroup (rw,nosuid,nodev,noexec,relatime,hugetlb)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,relatime,pagesize=2M)
mqueue on /dev/mqueue type mqueue (rw,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,relatime)
systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=32,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=19729)
fusectl on /sys/fs/fuse/connections type fusectl (rw,relatime)
configfs on /sys/kernel/config type configfs (rw,relatime)
/dev/sda3 on /home type ext4 (rw,relatime)
tmpfs on /home/andrey/.config/fastxampp type tmpfs (rw,relatime,size=1024k)
tmpfs on /home/andrey/.config/fastxampp type tmpfs (rw,relatime,size=1024k)
overlay on /var/lib/docker/overlay2/45d6d648ac626c0521ba446b22fe81b2f2b7055b10a9cc87a0efa8621196e90f/merged type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/IB6LLUEYS6HRYYAYD4LUFIDXZO:/var/lib/docker/overlay2/l/FYOQR2D3YCOBZHXP4UNS6B2DEE:/var/lib/docker/overlay2/l/WLARTSBWLIWBLHBNMVSY6N34GU:/var/lib/docker/overlay2/l/SKFGWALH73WJD2BSCZFD323AJM:/var/lib/docker/overlay2/l/ZAOWIX5DCOPNOGGJ2ECNZRBBRE:/var/lib/docker/overlay2/l/PTU363OZSTOG26VZJUHNDKJBVF:/var/lib/docker/overlay2/l/5HP43DZZJT4ATM3ZYH7BPTWPT4,upperdir=/var/lib/docker/overlay2/45d6d648ac626c0521ba446b22fe81b2f2b7055b10a9cc87a0efa8621196e90f/diff,workdir=/var/lib/docker/overlay2/45d6d648ac626c0521ba446b22fe81b2f2b7055b10a9cc87a0efa8621196e90f/work,xino=off)
overlay on /var/lib/docker/overlay2/ddb21d3c0d507fa268571537762629fc365d09d663bc5b833c86dccd5bb8016b/merged type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/2LA42LIUUOGDZ3WFFQ6IZO5LUV:/var/lib/docker/overlay2/l/4XW3BRDMBRKNN22ZJ4UNXVZVVW:/var/lib/docker/overlay2/l/ROOENCO7CVCWDQUWWOZH7PCUY5:/var/lib/docker/overlay2/l/G4R3CWSICEUP5LXZB3B52MD652:/var/lib/docker/overlay2/l/VRZ6JQ3NAXQNJ5FGBN56CBNUNY:/var/lib/docker/overlay2/l/F4NMJVETA3XBBDQYMZ6CCEP3YV:/var/lib/docker/overlay2/l/KGN3VFU2BBMMPF2OZPNF2QALKS:/var/lib/docker/overlay2/l/TSUOXMJGRWHPFJU2ULI7AYM7FY:/var/lib/docker/overlay2/l/BJGBEQA5TLEKCQY7HTMF5L4JKP:/var/lib/docker/overlay2/l/XEDLSCDI43MSTLEK5QMACLFRWR:/var/lib/docker/overlay2/l/NO3EJTH6TUMXHM5KD3GBE77R7T:/var/lib/docker/overlay2/l/ECFAFW7OSWXUCGCJ6PSVUZLAYM,upperdir=/var/lib/docker/overlay2/ddb21d3c0d507fa268571537762629fc365d09d663bc5b833c86dccd5bb8016b/diff,workdir=/var/lib/docker/overlay2/ddb21d3c0d507fa268571537762629fc365d09d663bc5b833c86dccd5bb8016b/work,xino=off)
nsfs on /run/docker/netns/20794928ce69 type nsfs (rw)
nsfs on /run/docker/netns/67224f9a93a4 type nsfs (rw)
tmpfs on /run/user/1000 type tmpfs (rw,nosuid,nodev,relatime,size=3082648k,mode=700,uid=1000,gid=1000)
gvfsd-fuse on /run/user/1000/gvfs type fuse.gvfsd-fuse (rw,nosuid,nodev,relatime,user_id=1000,group_id=1000)
/dev/sdc1 on /media/andrey/KINGSTON type vfat (rw,nosuid,nodev,relatime,uid=1000,gid=1000,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,showexec,utf8,flush,errors=remount-ro,uhelper=udisks2)

/dev/sdb4 on /media/andrey/D type fuseblk (rw,nosuid,nodev,relatime,user_id=0,group_id=0,default_permissions,allow_other,blksize=4096,uhelper=udisks2)`);
	}
	// /dev/sdb3 on /media/andrey/CC1EB9EA1EB9CDA8 type fuseblk (ro,nosuid,nodev,relatime,user_id=0,group_id=0,default_permissions,allow_other,blksize=4096,uhelper=udisks2)
	
	if (command.indexOf('df -h') != -1) {
		onFinish[1].call(onFinish[0], `Файл.система   Размер Использовано  Дост Использовано% Cмонтировано в
udev              15G            0   15G            0% /dev
tmpfs            3,0G         1,7M  3,0G            1% /run
/dev/sda2        398G         265G  114G           71% /
tmpfs             15G          27M   15G            1% /dev/shm
tmpfs            5,0M         4,0K  5,0M            1% /run/lock
tmpfs             15G            0   15G            0% /sys/fs/cgroup
/dev/sda3        229G         207G   11G           95% /home
tmpfs            1,0M         4,0K 1020K            1% /home/andrey/.config/fastxampp
tmpfs            3,0G          68K  3,0G            1% /run/user/1000
/dev/sdc1        7,3G         6,6G  736M           91% /media/andrey/KINGSTON
/dev/sdb3        195G          44G  151G           23% /media/andrey/CC1EB9EA1EB9CDA8
/dev/sdb4        185G         169G   17G           92% /media/andrey/D
`);
	}
}

// end class jexec

// Set xdg-open for all links

function __jqtSetXdgOpenForLinks() {
	var ls = document.getElementsByTagName('a'), 
		i,
		lnk,
		ctx,
		isWindows = false,
		Null = new Function();
	if (OS.getTempFolderPath()[1] == ':') {
		isWindows = true;
	}
	for (i = 0; i < ls.length; i++) {
		lnk = ls[i].getAttribute('href');
		if (lnk.indexOf('http') === 0) {
			ctx = ls[i];
			ls[i].addEventListener('click', function(evt){
				evt.preventDefault();
				var link = this.getAttribute('href');
				if (!isWindows) {
					PHP.exec('xdg-open ' + link, Null, Null, Null);
				} else {
					try {
						OS.ShellExecuteQ('open', link, '', '', false);
					} catch(err) {
						alert(err);
					}
				}
				return false;
			}, false);
		}
	}
}

window.FS = {
	unlink:function(path) {
		return PHP.unlink(path);
	},
	isDir:function(path) {
		return PHP.is_dir(path);
	},
	readfile:function(path){
		return PHP.file_get_contents(path);
	},
	writefile:function(path, content, flags){
		return PHP.file_put_contents(path, content, flags);
	},
	fileExists:function(path){
		return PHP.file_exists(path);
	},
	scandir:function(path){
		return PHP.scandir(path);
	},
	filesize:function(path){
		return PHP.filesize(path);
	},
	savePng:function(path, base64Str, iQuality) {
		Qt.savePng(path, base64Str, iQuality);
	},
	saveJpeg:function(path, base64Str, iQuality) {
		Qt.saveJpeg(path, base64Str, iQuality);
	}
};

window.Env = {
    openFileDialog: function(caption, dir, filter){
		return Qt.openFileDialog(caption, dir, filter);
	},
	openFilesDialog: function(caption, dir, filter){
		return Qt.openFilesDialog(caption, dir, filter);
	},
	openDirectoryDialog: function(caption, dir) {
		return Qt.openDirectoryDialog(caption, dir, '');
	},
	saveFileDialog: function(caption, dir, filter) {
		return Qt.saveFileDialog(caption, dir, filter);
	},
	exec: function(command, onFinallyExecute, onStdOut, onStdErr) {
		return jexec(command, onFinallyExecute, onStdOut, onStdErr);
	},
	isRun: function(innerProcId) {
		return PHP.isRun(innerProcId);
	}
};

window.App = {
	dir: function(){
		return Qt.appDir();
	},
	getArgs: function(){
		return Qt.getArgs();
	},
	quit:function(){
		Qt.quit();
	}
};

window.MW = {
	getLastKeyChar: function(){
		return Qt.getLastKeyChar();
	},
	getLastKeyCode: function(){
		return Qt.getLastKeyCode();
	},
	moveTo: function(x, y) {
		Qt.moveTo(x, y);
	},
	resizeTo: function(w, h) {
		Qt.resizeTo(w, h);
	},
	showFullScreen: function() {
		Qt.showFullScreen();
	},
	showNormal: function() {
		Qt.showNormal();
	},
	minimize: function() {
		Qt.minimize();
	},
	maximize: function() {
		Qt.maximize();
	},
	showMainMenu: function() {
		Qt.showMainMenu();
	},
	setIconImage: function(path) {
		Qt.setWindowIconImage(path);
	},
	hideMainMenu: function() {
		Qt.hideMainMenu();
	},
	setTitle: function(s) {
		Qt.setTitle(s);
	},
	close: function() {
		Qt.quit();
	}
};
}
