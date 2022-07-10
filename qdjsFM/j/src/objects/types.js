window.Types = {
	get:function(path) {
		var a = path.split('.'),
			ext = a[sz(a) - 1].toLowerCase(),
			r = {
				t: L('File'),
				i: App.dir() + '/i/mi/unknown32.png',
			},
			targetIcon,
			images = In('png', 'jpg', 'jpe', 'jpeg', 'jfif', 'gif', 'bmp'),
			texts  = In('txt', 'cpp', 'c', 'py', 'pas', 'json', 'rb', 'cs', 'pl', 'ini', 'conf'),
			docs   = In('doc', 'docx', 'odf', 'xlsx', 'xls', 'csv', 'pdf', 'ppt'),
			audio  = In('mp3', 'wav', 'ogg', 'flac', ''),
			video  = In('mp4', 'avi', 'wma', 'mov', 'vob'),
			exe    = In('exe', 'run'),
			arch    = In('gz', 'zip', 'bzip', 'tar', '7z', 'rar'),
			web    = In('html', 'htm'),
			sh     = In('bat', 'sh');
		if (images[ext]) {
			r.t = L('Image') + ' ' + ext.toUpperCase();
			r.i = path;
		} else if (texts[ext]) {
			r.t = L('Text file');
			r.i = App.dir() + '/i/mi/txt32.png';
		} else if (docs[ext]) {
			r.t = L('Document') + ' ' + ext.toUpperCase();
			r.i = App.dir() + '/i/mi/document32.png';
		} else if (audio[ext]) {
			r.t = L('Audio') + ' ' + ext.toUpperCase();
			r.i = App.dir() + '/i/mi/sound32.png';
		} else if (video[ext]) {
			r.t = L('Video') + ' ' + ext.toUpperCase();
			r.i = App.dir() + '/i/mi/video32.png';
		} else if (arch[ext]) {
			r.t = L('Archive') + ' ' + ext.toUpperCase();
			r.i = App.dir() + '/i/mi/tar32.png';
		} else if (web[ext]) {
			r.t = L('Web page') + ' ' + ext.toUpperCase();
			r.i = App.dir() + '/i/mi/html32.png';
		} else if (ext == 'desktop') {
			r.t = L('Desktop file');
			r.i = App.dir() + '/i/exec32.png';
		} else if (ext == 'swf') {
			r.t = L('Shockwave Flash Application');
		}
		
		targetIcon = App.dir() + '/i/mi/' + ext + '32.png';
		if (FS.fileExists(targetIcon)) {
			r.i = targetIcon;
		}
		
		return r;
	}
};
