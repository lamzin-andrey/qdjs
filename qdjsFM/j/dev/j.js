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
	// console.log('jexec: ' + command);
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
	
	
	if (command.indexOf('/ls/') == -1 && command.indexOf('/lsh/') == -1 && (command.indexOf('ls.sh') != -1 || command.indexOf('lsh.sh') != -1) ) {
		onFinish[1].call(onFinish[0], `итого 1,1G
-rw-rw-r--  1 andrey andrey  90K 2021-11-16 09:05:02.030072406 +0300  0000.sh
-rw-rw-r--  1 andrey andrey  70K 2022-06-10 19:05:50.302340682 +0300  0000-ЛАН-10.06-1942.sh
-rw-rw-r--  1 andrey andrey 727K 2022-06-09 09:04:10.968807374 +0300  000_208336_1650706208_Документы_страхового_полиса.zip
-rw-rw-r--  1 andrey andrey 235K 2022-07-06 18:19:24.010071179 +0300  000-doubles-Screenshot_2022-07-06-18-03-29-717_ru.rosfines.android.png
-rw-rw-r--  1 andrey andrey 190K 2022-05-20 10:11:15.833327785 +0300  000.png
-rw-rw-r--  1 andrey andrey 179K 2022-07-06 18:19:30.690202097 +0300  00-long-email-Screenshot_2022-07-06-18-12-26-021_ru.rosfines.android.png
-rw-rw-r--  1 andrey andrey 149K 2022-07-06 18:19:37.082327336 +0300  00-phone-Screenshot_2022-07-06-18-13-09-444_ru.rosfines.android.png
-rw-rw-r--  1 andrey andrey  19K 2021-11-06 10:18:14.462758585 +0300  01.jpg
-rw-rw-r--  1 andrey andrey 374K 2022-05-31 15:00:55.850988347 +0300  01.png
-rw-rw-r--  1 andrey andrey 1,8M 2022-05-31 15:01:08.639205822 +0300  02.png
-rw-rw-r--  1 andrey andrey 589K 2021-10-04 20:39:38.383165547 +0300  09.png
-rw-rw-r--  1 andrey andrey 193K 2022-06-24 13:03:41.692032460 +0300  0c71fa20b71807d9dba6798a9c812359.pdf
-rw-rw-r--  1 andrey andrey  70K 2021-07-10 06:38:40.546993580 +0300  0-covid-qr-from-pdf.png
-rw-rw-r--  1 andrey andrey  43K 2021-07-10 06:20:12.073189507 +0300  0-covid-qr.jpg
-rw-rw-r--  1 andrey andrey  32K 2021-07-10 06:20:20.601507991 +0300  0-covid-qr.png
-rw-rw-r--  1 andrey andrey  77K 2021-01-09 12:25:37.264833476 +0300  0.jpeg
-rw-rw-r--  1 andrey andrey 4,9K 2022-03-01 10:40:10.517533311 +0300  0.jpg
-rw-rw-r--  1 andrey andrey  192 2022-03-03 09:47:53.367122835 +0300  0.php
-rw-rw-r--  1 andrey andrey  18K 2022-05-13 18:59:45.066937503 +0300  0play.png
-rw-r--r--  1 andrey andrey 1,6M 2022-05-23 18:23:44.000000000 +0300  0testdata.log
-rw-rw-r--  1 andrey andrey  95K 2021-07-14 08:58:56.322033000 +0300  0Thank.mp3
-rw-rw-r--  1 andrey andrey 2,1K 2022-05-19 12:29:05.919180439 +0300  0TZ.txt
-rw-rw-r--  1 andrey andrey  153 2022-05-25 12:42:10.285207047 +0300  1
-rw-rw-r--  1 andrey andrey 1,3K 2022-04-01 18:41:52.929462348 +0300  107036_2022_04_01.csv
-rw-rw-r--  1 andrey andrey  148 2022-05-06 17:12:48.743972708 +0300  115493_2022_05_06.csv
-rw-rw-r--  1 andrey andrey  274 2022-05-06 17:43:18.556244968 +0300  115526_2022_05_06.csv
-rw-rw-r--  1 andrey andrey  274 2022-05-06 17:47:32.045148743 +0300  115528_2022_05_06.csv
-rw-rw-r--  1 andrey andrey  13K 2022-05-23 12:50:32.499114531 +0300  119191_2022_05_23.csv
-rw-rw-rw-  1 andrey andrey 7,7K 2022-05-30 14:16:39.880629511 +0300  123.html
-rw-rw-r--  1 andrey andrey 193K 2022-06-24 11:55:17.462762620 +0300  132eec83cb9624708c76412bf8929bd5.pdf
-rw-rw-r--  1 andrey andrey 521K 2022-06-04 11:05:25.890201963 +0300  138c6c6fc0de08b47f2f07d56558ce2c.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-24 13:10:48.114972059 +0300  15aaf8a0209a4a291acc411ba2f14714.pdf
-rw-rw-r--  1 andrey andrey 322K 2022-07-05 12:55:27.151685420 +0300  1cc94c98e4cbee4e83c931b1cb21e058.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-06 09:07:15.447335250 +0300  384d316ed90786f2dbddf3195f5d3f9a.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-24 15:05:09.980715160 +0300  460cb26ba2e2e56242250dda916eae08.pdf
-rw-rw-r--  1 andrey andrey   90 2022-05-01 08:56:16.102195009 +0300  47f4b5f4f680acaf514dd482dbbbbb06.Pdf
-rw-rw-r--  1 andrey andrey 609K 2022-07-05 19:28:34.487492802 +0300  49593089_1650702728_023c4a92db6504fcf131755df8392b8e6b64eef9.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-07-01 13:14:42.103888337 +0300  4e1c79a2cb7191da3ec920dc99cfde8a.pdf
-rw-rw-r--  1 andrey andrey  76K 2022-06-17 18:28:04.222255846 +0300  500.csv
-rw-rw-r--  1 andrey andrey  85K 2022-07-07 09:03:27.372382036 +0300  500-expired_polices-10_-_21_days_2022_07_07.csv
-rw-rw-r--  1 andrey andrey  58K 2022-07-07 10:38:00.550034366 +0300  500-expired_polices-10_-_21_days_2022_07_07.xlsx
-rw-rw-r--  1 andrey andrey  84K 2022-06-29 20:00:10.498407455 +0300  500-prodlentcev-11-21-2.csv
-rw-rw-r--  1 andrey andrey  58K 2022-06-30 10:07:44.509719278 +0300  500-prodlentcev-11-21-2.xlsx
-rw-rw-r--  1 andrey andrey  76K 2022-06-28 09:59:37.176757496 +0300  500-prodlentcev-11-21.csv
-rw-rw-r--  1 andrey andrey  77K 2022-06-22 10:39:54.076946701 +0300  500-prodlentcev-4-15.csv
-rw-rw-r--  1 andrey andrey  56K 2022-06-22 10:40:06.125236752 +0300  500-prodlentcev-4-15.xlsx
-rw-rw-r--  1 andrey andrey  77K 2022-06-22 10:07:00.528578242 +0300  500-prodlentcev.csv
-rw-rw-r--  1 andrey andrey  56K 2022-06-22 10:07:27.148786884 +0300  500-prodlentcev.xlsx
-rw-rw-r--  1 andrey andrey  54K 2022-06-18 13:40:41.655892649 +0300  500.xlsx
-rw-rw-r--  1 andrey andrey   90 2022-05-01 15:24:03.521151824 +0300  558119b95fd58a4369ebdff812bfe370.zip
-rw-rw-r--  1 andrey andrey 193K 2022-06-04 11:27:39.364599209 +0300  56f6672edf8f540215e5eed8eac1ba94.pdf
-rw-rw-r--  1 andrey andrey 188K 2022-06-28 18:16:59.270613829 +0300  608.png
-rw-rw-r--  1 andrey andrey 607K 2022-06-23 09:37:08.179672062 +0300  6225690c56869bb5d45cb33d9507bb90.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-16 15:15:35.789753260 +0300  6d35d15ddd67dcaea309eee181b30863.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-23 09:30:57.453608317 +0300  77ce81967a1af538ad108d9e83c7d28c.pdf
-rw-rw-r--  1 andrey andrey 324K 2022-07-04 11:53:36.011561947 +0300  794e8330b4f6a4c6cbdcf3135a7eec5b.pdf
-rw-rw-r--  1 andrey andrey 521K 2022-06-24 13:26:34.421181258 +0300  7bbb40d70da2d81d394efc33a1c41ce9.pdf
-rw-rw-r--  1 andrey andrey 908K 2022-06-22 12:13:29.751521334 +0300  89608723bf4541638b64a55ebeffdd9354fe52e25314457e93f63d65e206e156.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-23 09:35:47.509578745 +0300  8e3082fb702a2228f25a5e915cd618f0.pdf
-rw-rw-r--  1 andrey andrey 609K 2022-07-05 19:32:39.680019744 +0300  9abd8b9f4c8bb734343e3cdc78de1c1f.pdf
-rw-rw-r--  1 andrey andrey 229K 2022-06-22 19:39:16.504105372 +0300  9B47221A-EC2F-402F-9DC2-0738EA67F4C4.png
-rw-rw-r--  1 andrey andrey 334K 2022-05-05 15:48:10.319307843 +0300  A431DACC-B2EB-46C7-9AA0-6216DF9C9A48.png
-rw-rw-r--  1 andrey andrey 609K 2022-06-23 09:36:48.930205235 +0300  a4b21530d1375e635302ee17ffc48e74.pdf
-rw-rw-r--  1 andrey andrey 324K 2022-07-05 09:04:05.606232094 +0300  ab57b5fa8da4a12054bc3b6e4398758e.pdf
-rw-rw-r--  1 andrey andrey  29K 2022-05-25 19:41:20.855991418 +0300  admin_v_2_4.png
-rw-rw-r--  1 andrey andrey  53K 2022-05-26 21:25:34.261613465 +0300  admin_v_2_5.png
-rw-rw-r--  1 andrey andrey  22K 2022-06-27 10:57:27.724404222 +0300  amplitude_users.csv
drwxrwxr-x  3 andrey andrey 4,0K 2022-07-07 12:56:30.780690843 +0300  Android
-rw-rw-r--  1 andrey andrey 4,6M 2021-01-17 11:44:46.131701979 +0300  android.zip
-rw-rw-r--  1 andrey andrey 2,4K 2022-06-07 13:56:21.110496983 +0300  anket.json
-rw-rw-r--  1 andrey andrey 733K 2022-06-15 17:43:16.073759374 +0300  archive_0247707688.zip
-rw-rw-r--  1 andrey andrey 492K 2022-06-15 17:12:47.468027305 +0300  archive_0247723375.zip
-rw-rw-r--  1 andrey andrey 285K 2022-06-15 19:17:36.521231298 +0300  archive_0247784799.zip
-rw-rw-r--  1 andrey andrey 728K 2022-06-15 19:16:51.672703047 +0300  archive_0247827746.zip
-rw-rw-r--  1 andrey andrey 926K 2022-06-22 11:11:05.508620364 +0300  archive_0249092071.zip
-rw-rw-r--  1 andrey andrey 730K 2022-06-24 12:43:38.943432998 +0300  archive_0249548727.zip
-rw-rw-r--  1 andrey andrey 487K 2022-07-04 11:43:40.197046975 +0300  archive_0250858940.zip
-rw-rw-r--  1 andrey andrey 457K 2022-07-04 11:34:29.601093568 +0300  archive_0251212534.zip
-rw-rw-r--  1 andrey andrey 324K 2022-07-04 11:48:57.367747378 +0300  b2fc9a1e3f430f8e12bd3246cf3056d7.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-24 13:43:01.433253472 +0300  be1192e2437c69af92ef0fec0d8f7a27.pdf
-rw-rw-r--  1 andrey andrey  282 2022-06-16 22:00:55.388224155 +0300  btnLeft.png
-rw-rw-r--  1 andrey andrey 313K 2022-02-18 13:09:36.399947996 +0300  buy_policy.png
-rw-rw-r--  1 andrey andrey 145K 2022-06-22 12:20:24.076749731 +0300  commandOrKibana.png
-rw-rw-r--  1 andrey andrey 141K 2022-07-07 16:08:32.798571887 +0300  control-cohort-payment.png
-rw-rw-r--  1 andrey andrey 180K 2022-02-28 11:05:47.277110853 +0300  currentEmailState.png
-rw-rw-r--  1 andrey andrey 126K 2022-06-23 09:34:23.139390024 +0300  d12259e94cb0a7bee17d1ebf58afc66f.pdf
-rw-rw-r--  1 andrey mail    153 2022-04-14 19:44:55.347730513 +0300  dead.letter
-rw-rw-r--  1 andrey andrey  37K 2022-07-03 10:23:58.129873327 +0300  denis-20-27-jun.csv
-rw-rw-r--  1 andrey andrey  38K 2022-07-03 10:42:52.504924448 +0300  denis-22.06.csv
-rw-rw-r--  1 andrey andrey 489K 2022-04-29 18:02:25.072178250 +0300  df48aee4b786f52ec7bb2e1acfa070cf.zip
drwxrwxr-x  2 andrey andrey 4,0K 2022-07-08 09:07:27.644206641 +0300  Downloads
-rw-rw-r--  1 andrey andrey  27K 2022-02-26 12:40:59.059865296 +0300  dto-code-generator.jpg
-rw-rw-r--  1 andrey andrey 127K 2022-02-26 12:28:21.253215517 +0300  dto-code-generator.png
-rw-rw-r--  1 andrey andrey  93K 2022-03-24 17:11:08.493989334 +0300  dynamic-html-client-generated.zip
-rw-rw-r--  1 andrey andrey 305K 2022-05-04 13:50:42.028317150 +0300  EFCAE41B-0173-448E-813E-F5BE8D1D24E2.png
-rw-rw-r--  1 andrey andrey 1,8K 2022-02-23 21:12:31.106733459 +0300  example1.json
-rw-rw-r--  1 andrey andrey 2,6K 2022-02-23 21:13:05.347361832 +0300  example2.json
-rw-rw-r--  1 andrey andrey  43K 2022-01-28 09:36:09.975093081 +0300  example.png
-rw-rw-r--  1 andrey andrey  64M 2022-03-29 15:50:15.958284160 +0300  experiment_off.log
-rw-rw-r--  1 andrey andrey 1,6M 2022-06-17 18:52:24.479893099 +0300  f0d2c1220f54e057a366979bfcf5fac8.pdf
-rw-rw-r--  1 andrey andrey 608K 2022-07-05 09:07:44.353612916 +0300  f70579e85201cc11194a0dded76e93c8.pdf
-rw-rw-r--  1 andrey andrey  20M 2020-11-11 09:47:10.762755088 +0300  flipcat_dbp4.sql.tar.gz
-rw-rw-r--  1 andrey andrey 319K 2022-02-18 13:09:15.483445892 +0300  funnel_return_1.png
-rw-rw-r--  1 andrey andrey 314K 2022-02-18 13:08:59.355058643 +0300  funnel_return_2.png
drwxrwxr-x 15 andrey andrey 4,0K 2022-04-28 17:17:35.610659257 +0300  hdata
-rw-rw-r--  1 andrey andrey 245K 2022-06-22 17:47:33.791099194 +0300  hello.png
-rw-rw-r--  1 andrey andrey 6,0K 2022-05-26 15:52:45.223997803 +0300  hello.txt
-rw-rw-r--  1 andrey andrey 1,8M 2020-02-21 15:37:38.968864343 +0300  hello_world.zip
-rw-rw-r--  1 andrey andrey 336K 2022-06-15 18:24:52.060148848 +0300  how_view_error_in_kibana.png
-rw-rw-r--  1 andrey andrey 166K 2022-03-24 17:09:57.689320594 +0300  html2-client-generated.zip
-rw-rw-r--  1 andrey andrey 8,7K 2022-03-24 17:09:02.512809369 +0300  html-client-generated.zip
drwxrwxrwx  7 andrey andrey 4,0K 2022-05-30 11:03:56.396770808 +0300  iersa
-rw-rw-r--  1 andrey andrey 355K 2022-06-22 13:58:34.052184634 +0300  IN_CLOUD.png
-rw-rw-r--  1 andrey andrey    0 2022-04-14 16:46:39.545302517 +0300  index.html
-rw-rw-r--  1 andrey andrey  64M 2021-01-17 11:43:03.950820730 +0300  Install_Flash_MX_2004.exe
-rw-rw-r--  1 andrey andrey  15M 2022-06-20 11:59:17.704588000 +0300  ip_log.tar.gz
-rw-rw-r--  1 andrey andrey 290K 2022-03-30 13:22:55.375105359 +0300  it-was-lyorsha.png
drwx------ 11 andrey andrey 4,0K 2022-01-14 09:19:32.196942068 +0300  joxi
-rw-rw-r--  1 andrey andrey 164K 2022-04-17 12:30:01.098232926 +0300  lastGuest.png
-rw-rw-rw-  1 andrey andrey  25K 2021-12-15 12:12:56.558644895 +0300  list.json
-rw-rw-rw-  1 andrey andrey 1,5M 2022-06-30 19:00:29.494103795 +0300  log.log
-rw-rw-rw-  1 andrey andrey  13K 2021-12-23 18:21:04.843903717 +0300  logusers.log
-rw-rw-rw-  1 andrey andrey  12K 2021-12-23 00:47:23.565512898 +0300  logusersp.log
-rw-rw-r--  1 andrey andrey  42K 2022-03-23 12:02:48.598739157 +0300  marks.log
-rw-rw-rw-  1 andrey andrey  69M 2022-03-29 17:08:46.081144121 +0300  master.log
-rw-rw-r--  1 andrey andrey 5,0K 2022-06-20 12:12:04.931046605 +0300  methodNotAllowedBotIp.xlsx
-rw-rw-r--  1 andrey andrey  43K 2022-03-05 09:16:21.873296990 +0300  microsoft_off.png
-rw-rw-rw-  1 andrey andrey  104 2022-03-23 11:32:00.727607628 +0300  models_gw.json
-rw-rw-rw-  1 andrey andrey 3,1K 2022-03-23 11:26:13.879475593 +0300  models_gw.log
-rw-rw-rw-  1 andrey andrey   92 2022-03-23 11:11:25.661040976 +0300  models_kia.json
-rw-rw-rw-  1 andrey andrey 7,6K 2022-03-23 11:07:43.154479054 +0300  models.log
drwxrwxr-x  3 andrey andrey 4,0K 2022-05-18 15:06:08.699998905 +0300  myapps
-rw-rw-r--  1 andrey andrey   26 2022-06-06 09:04:01.469026347 +0300  my.auth.txt.back
-rw-rw-r--  1 andrey andrey  304 2022-07-05 17:24:27.009524422 +0300  New_Query_2022_07_05.csv
-rw-rw-r--  1 andrey andrey  14K 2022-03-21 19:00:57.436427205 +0300  nodesource_setup.sh
-rw-rw-r--  1 andrey andrey 290K 2022-06-22 14:20:08.293454632 +0300  noLogs.png
-rw-rw-r--  1 andrey andrey 126K 2022-07-07 15:56:47.212307000 +0300  NOT_IN_EXPERIMENT.png
-rw-rw-r--  1 andrey andrey  89K 2021-11-29 20:56:52.760412143 +0300  offers1.png
-rw-rw-r--  1 andrey andrey  55K 2021-11-29 21:00:59.007918859 +0300  offers1.svg
-rw-rw-r--  1 andrey andrey  91K 2021-11-29 21:01:38.350545955 +0300  offers2.svg
-rw-rw-r--  1 andrey andrey  35K 2022-03-24 16:44:49.629714961 +0300 'openapi: 3.0.0.yml'
-rw-rw-r--  1 andrey andrey  22K 2022-06-27 17:07:49.457708681 +0300  out.log
-rw-rw-r--  1 andrey andrey 2,9M 2020-10-21 13:05:06.673938602 +0300  pdfedit-0.4.5.tar.bz2
-rw-rw-r--  1 andrey andrey  323 2021-01-17 11:41:32.266484390 +0300  person.txt.gpg
-rw-rw-r--  1 andrey andrey  14K 2020-03-11 11:05:40.345166620 +0300  pgadmin.log
drwxrwxr-x  3 andrey andrey 4,0K 2021-07-24 15:11:05.191682412 +0300  PhpstormProjects
-rwxrwxrwx  1 andrey andrey 2,9M 2016-09-15 10:51:29.000000000 +0300  phpunit-5.5.4.phar
-rw-r--r--  1 root   root   1,0M 2022-01-05 16:11:16.476093812 +0300  plobUSB.img
-rw-rw-r--  1 andrey andrey 544K 2015-02-02 17:21:03.000000000 +0300  plpbt.iso
-rw-rw-r--  1 andrey andrey 354K 2022-05-27 09:35:11.218042672 +0300  policy_0236461747.pdf
-rw-rw-r--  1 andrey andrey 521K 2022-06-01 18:10:25.867394098 +0300  policy_0244518398.pdf
-rw-rw-r--  1 andrey andrey 521K 2022-06-04 11:04:13.077775236 +0300  policy_0245329922.pdf
-rw-rw-r--  1 andrey andrey 298K 2022-06-04 10:49:38.712808745 +0300  policy_0245329923.pdf
-rw-rw-r--  1 andrey andrey 521K 2022-06-04 11:10:41.928676947 +0300  policy_0245334219.pdf
-rw-rw-r--  1 andrey andrey 606K 2022-06-04 11:22:56.524455097 +0300  policy_0245341549.pdf
-rw-rw-r--  1 andrey andrey 453K 2022-06-04 11:24:10.921317218 +0300  policy_0245344414.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-04 11:26:53.155376707 +0300  policy_0245345957.pdf
-rw-rw-r--  1 andrey andrey 192K 2022-06-10 12:48:52.628891044 +0300  policy_0246685660.pdf
-rw-rw-r--  1 andrey andrey 611K 2022-06-10 14:59:03.592262205 +0300  policy_0246708884.pdf
-rw-rw-r--  1 andrey andrey 1,2M 2022-06-10 12:45:15.847260097 +0300  policy_0246728615.pdf
-rw-rw-r--  1 andrey andrey 324K 2022-06-10 15:13:20.834476425 +0300  policy_0246789677.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-10 15:14:02.634963070 +0300  policy_0246798608.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-15 17:43:18.121782949 +0300  policy_0247707688.pdf
-rw-rw-r--  1 andrey andrey 326K 2022-06-15 17:12:49.424054963 +0300  policy_0247723375.pdf
-rw-rw-r--  1 andrey andrey 372K 2022-06-15 19:17:38.781258063 +0300  policy_0247784799.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-15 19:16:53.336722546 +0300  policy_0247827746.pdf
-rw-rw-r--  1 andrey andrey 2,6M 2022-06-22 11:11:09.172709831 +0300  policy_0249092071.pdf
-rw-rw-r--  1 andrey andrey 194K 2022-06-24 12:43:41.215497644 +0300  policy_0249548727.pdf
-rw-rw-r--  1 andrey andrey 324K 2022-07-04 11:43:41.397011843 +0300  policy_0250858940.pdf
-rw-rw-r--  1 andrey andrey 1,2M 2022-07-04 11:34:31.105050023 +0300  policy_0251212534.pdf
-rw-rw-r--  1 andrey andrey 175K 2022-07-04 12:47:03.384642494 +0300  policy_0251314496.pdf
-rw-rw-r--  1 andrey andrey 142K 2022-05-30 19:15:12.058515852 +0300  policy_2499387283.pdf
-rw-rw-r--  1 andrey andrey 609K 2022-07-05 19:28:09.636250903 +0300  Policy.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-10 11:54:16.298474696 +0300  POLIS-ARBUZOVIP-XXX-0213726798_polis_Sber.pdf
-rw-rw-r--  1 andrey andrey 193K 2022-06-09 09:03:25.696269941 +0300  POLIS-AREFEVUN-XXX-0236309776_polis_Sber.pdf
-rw-rw-r--  1 andrey andrey 344K 2022-02-18 13:08:46.022738472 +0300  prolongation_insurance_company_offer.png
-rw-rw-r--  1 andrey andrey 335K 2022-02-18 14:45:25.867658937 +0300  prolongation.png
-rw-rw-r--  1 andrey andrey 348K 2022-02-18 13:08:34.194454379 +0300  prolongation_with_number.png
-rw-rw-r--  1 andrey andrey  18K 2021-11-04 08:13:54.197165711 +0300  putty_ssh.tar.gz
-rw-rw-r--  1 andrey andrey  498 2021-10-19 14:52:29.496817579 +0300  qr_code-perepis.png
-rw-rw-r--  1 andrey andrey  169 2022-05-19 13:34:52.541400121 +0300  questionToSravniRu.txt
-rw-rw-r--  1 andrey andrey 1,2K 2020-02-11 09:28:36.078938409 +0300  quick_sort1.php
-rw-rw-r--  1 andrey andrey  742 2020-02-11 10:20:47.342979264 +0300  quick_sort2020.php
-rw-rw-r--  1 andrey andrey  614 2020-02-11 09:24:08.328211691 +0300  quicksort.php
-rw-rw-r--  1 andrey andrey  22K 2022-06-14 21:05:24.971229286 +0300  readme.docx
-rw-rw-r--  1 andrey andrey 330K 2022-02-18 14:46:29.029074169 +0300  ready_policy_rsa.png
-rw-rw-r--  1 andrey andrey 2,5K 2022-06-08 19:05:14.178183826 +0300  replika.txt
-rw-rw-r--  1 andrey andrey 8,6K 2022-06-20 12:04:21.432733650 +0300  report.php.ods
-rw-rw-r--  1 andrey andrey 5,0K 2022-06-20 12:11:23.310480115 +0300  report.xlsx
-rw-rw-r--  1 andrey andrey 2,3K 2021-11-10 11:30:54.648356717 +0300  request.json
-rw-rw-r--  1 andrey andrey 323K 2021-12-08 11:21:09.052276602 +0300  request.png
-rw-rw-r--  1 andrey andrey 2,4K 2022-04-24 11:10:49.685148516 +0300  resume.2020.txt
-rw-rw-r--  1 andrey andrey  32K 2022-04-01 17:55:25.540841196 +0300  SC20220401-175011.png
-rwxr-----  1 andrey andrey 2,4M 2022-07-07 17:13:09.000000000 +0300  Screenrecorder-2022-07-07-17-12-23-70.mp4
-rwxr-----  1 andrey andrey  13M 2022-07-07 18:46:44.000000000 +0300  Screenrecorder-2022-07-07-18-45-06-390.mp4
-rw-rw-r--  1 andrey andrey 226K 2022-07-06 19:05:49.675528847 +0300  Screenshot_2022-07-06-19-03-29-407_ru.rosfines.android.png
drwxrwxr-x  2 andrey andrey 4,0K 2022-06-23 11:01:41.823894406 +0300  screenshots
-rw-rw-r--  1 andrey andrey 158K 2022-04-01 18:48:01.461566968 +0300  scrn20220401161303.png
-rw-rw-r--  1 andrey andrey 3,6M 2020-12-20 12:06:00.031772200 +0300  sega.7z
-rwxrwxrwx  1 andrey andrey  12K 2021-01-07 13:13:29.781256000 +0300  settings.zip
-rw-rw-r--  1 andrey andrey 309K 2020-03-18 18:04:08.618136443 +0300  simptoms.jpg
-rw-rw-r--  1 andrey andrey 8,5M 2021-12-07 12:17:55.987254917 +0300  source.csv
-rw-rw-r--  1 andrey andrey  515 2022-07-04 12:40:22.886690150 +0300  sravhiru_files_data.json
-rw-rw-r--  1 andrey andrey  441 2022-07-04 12:36:25.859303861 +0300  sravhiru_history.json
-rw-rw-rw-  1 andrey andrey  242 2022-03-23 11:02:05.362539322 +0300  sr_marks.json
-rw-rw-r--  1 andrey andrey  41K 2021-12-17 13:02:26.496604544 +0300  success.png
-rw-rw-r--  1 andrey andrey 389K 2021-01-13 10:47:59.072290626 +0300  Symfony.7z
-rw-rw-r--  1 andrey andrey  15K 2022-04-17 10:35:41.603175718 +0300  SymResume.txt
-rw-rw-r--  1 andrey andrey  69K 2022-05-04 23:06:04.438915813 +0300  tAdmin2.3.png
-rw-rw-r--  1 andrey andrey  41K 2022-05-04 23:08:03.601424639 +0300  tAdmin2.3-s2.png
-rw-rw-r--  1 andrey andrey 3,4K 2022-05-24 20:32:11.670264075 +0300  temp.php
-rw-rw-r--  1 andrey andrey 135K 2022-07-07 15:58:04.229474000 +0300  test_cohort_payment.png
-rw-rw-r--  1 andrey andrey 2,7K 2020-08-25 18:35:53.459072884 +0300  test.mid
-rw-rw-r--  1 andrey andrey 121K 2022-05-26 14:30:05.532525101 +0300  time_parsing.png
drwxrwxrwx  7 andrey andrey  12K 2022-07-03 11:24:57.678095760 +0300  tmp
-rw-rw-r--  1 andrey andrey  293 2022-07-08 10:52:48.382896603 +0300  tmp.txt
-rwxrwxrwx  1 andrey andrey    0 2022-04-24 11:08:49.210920886 +0300  today.txt
-rw-rw-r--  1 andrey andrey 698M 2022-06-14 22:00:35.986540893 +0300  u910.dd.tar.gz
-rw-rw-r--  1 andrey andrey 191K 2022-04-18 16:01:15.883145614 +0300  unsortedNulls.png
-rw-rw-r--  1 andrey andrey 2,5K 2022-05-26 17:05:40.017282143 +0300  validCaptchaFalse-SeconAttempt.html
drwxrwxr-x  7 andrey andrey 4,0K 2022-06-16 21:17:09.536090091 +0300 'VirtualBox VMs'
-rw-rw-r--  1 andrey andrey  12M 2020-12-27 17:59:42.300719952 +0300  v_lapah_cyberoper.mp3
-rw-rw-r--  1 andrey andrey  15M 2020-12-27 17:55:09.640156973 +0300  v_lapah_vk-27-12-2020.mp3
-rw-rw-r--  1 andrey andrey 1,6K 2022-02-08 10:38:39.456181507 +0300  w64-1.jpg
-rw-rw-r--  1 andrey andrey 5,5K 2022-02-08 10:38:29.343897043 +0300  w64-1.png
-rw-rw-r--  1 andrey andrey 1,9K 2022-02-08 10:39:38.881573273 +0300  w-64-2.jpg
-rw-rw-r--  1 andrey andrey 7,5M 2020-02-26 16:02:35.758108991 +0300  Werewars-Fight.swf
-rw-rw-r--  1 andrey andrey  21K 2022-04-27 13:40:03.567476384 +0300  widgetList.json
-rw-rw-r--  1 andrey andrey 8,3K 2022-03-18 13:40:40.202341075 +0300  WinAPI.jpg
-rw-rw-r--  1 andrey andrey 4,7K 2022-02-08 11:06:25.505695621 +0300  win-xp-big.jpg
-rw-rw-r--  1 andrey andrey  34K 2022-02-08 11:06:16.361510566 +0300  win-xp-big.png
-rw-rw-r--  1 andrey andrey 1,4K 2022-04-28 09:36:24.651795962 +0300  ya.jpeg
-rw-rw-r--  1 andrey andrey 5,3M 2020-11-26 10:33:34.988037326 +0300 'База данных имен и фамилий в формате MySql.zip'
drwxr-xr-x  2 andrey andrey  20K 2022-07-08 19:13:18.460946865 +0300  Видео
drwxr-xr-x  2 andrey andrey 4,0K 2022-06-13 19:19:33.005051896 +0300  Документы
-rw-rw-r--  1 andrey andrey 1,5K 2022-03-11 14:37:44.664671739 +0300  еуые-здфтюече
drwxr-xr-x 10 andrey andrey  16K 2022-07-08 18:52:40.851229632 +0300  Загрузки
drwxr-xr-x  2 andrey andrey 4,0K 2021-07-24 11:12:58.664592395 +0300  Изображения
-rw-rw-r--  1 andrey andrey  26K 2022-06-01 19:56:33.466505580 +0300  Мерседес-и-ниссан-Запрос_№947623447.pdf
drwxr-xr-x  2 andrey andrey 4,0K 2021-07-24 11:12:58.664592395 +0300  Музыка
-rw-rw-r--  1 andrey andrey 278K 2022-05-30 11:10:28.017011253 +0300 'Мы показываем сбер всем.png'
drwxr-xr-x  2 andrey andrey 4,0K 2021-07-24 11:12:58.664592395 +0300  Общедоступные
-rw-rw-r--  1 andrey andrey 343K 2022-05-01 08:56:54.748608067 +0300  _полис_ОСАГО_ХХХ0234213902.Pdf
-rw-rw-r--  1 andrey andrey 129K 2022-06-16 13:05:54.941252229 +0300 'Продажи ОСАГО в РШ - CRM.csv'
drwxr-xr-x  2 andrey andrey 4,0K 2022-07-01 18:41:28.713692634 +0300 'Рабочий стол'
-rw-rw-r--  1 andrey andrey 6,6M 2022-06-05 15:41:20.066605490 +0300  смородина.png
drwxr-xr-x  2 andrey andrey 4,0K 2021-07-24 11:12:58.952592400 +0300  Шаблоны
-rw-rw-r--  1 andrey andrey  20K 2021-10-23 23:24:06.000000000 +0300 'Электронный полис ОСАГО.html'
`
		);
		
		
	}
	return [1, 1];
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
	},
	mkdir:function(d){
		console.log("mkdir " + d);
		PHP.mkdir(d);
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
	},
	renameMenuItem: function(x, y, text) {
		Qt.renameMenuItem(x, y, text);
	}
};
}
