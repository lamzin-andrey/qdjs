window.Extractor = {
	init:function() {
		this.labelId = 'progressStateLabel';
		e(this.labelId).innerHTML = __('Start_copy') + '..';
		e('pBarLabel').innerHTML = __('Installation progress');
		this.dataDir    = Qt.appDir() + '/data';
		this.FINAL_SIZE = 1258794;
		this.sizeProcess = 0;
		this.setPBar(0, 0);
		Multihost.init(this);
		Autorun.init(this);
	},
	extract:function() {
		// unpack.tpl.sh распаковывал файлы XAMPP это больше не нужно
		var cmd = 'cp -f ' + this.dataDir + '/unpack.tpl.sh' + ' ' + this.dataDir + '/unpack.sh';
		PHP.exec(cmd, 'Extractor_onCopyExtractTpl')
	},
	onCopyExtractTpl:function(stdout, stderr) {
		if (stderr) {
			alert(stderr);
		}
		var c = PHP.file_get_contents(this.dataDir + '/unpack.sh');
		c = c.replace('[[source]]', this.dataDir + '/' + TARGZ_NAME);
		c = c.replace('[[Start_copy]]', __('Start_copy'));
		c = c.replace('[[Extract_files_please_wait]]', __('Extract_files_please_wait'));
		PHP.file_put_contents(this.dataDir + '/unpack.sh', c);
		Multihost.createCommand(this.dataDir + '/unpack.sh');
		Autorun.createCommand(this.dataDir + '/unpack.sh');
		this.extractComplete = false;
		this.extractBuf = '';
		Exec.exec('pkexec ' + this.dataDir + '/unpack.sh &', 'Extractor_onFinExtract', 'Extractor_onExtractOut', 'Extractor_onExtractError');
		
		this.interval = setInterval(
			function() {
				if (Extractor.sizeProcess == 0) {
					if (PHP.file_exists('/opt/lampp')) {
						Extractor.sizeProcess = 1;
						var n = Extractor.buf.length;
						var p = Math.round(n / (Extractor.FINAL_SIZE / 100));
						Extractor.setPBar(n, p);
						Extractor.sizeProcess = 0;
					}
				}
			}, 1000
		);
		
	},
	setPBar:function(n, p) {
		p = p > 100 ? 100 : p;
		e('dompb').style.width = p + '%';
		$('#progressState').text(n + ' / ' + this.FINAL_SIZE + ' (' + p + '%)');
	},
	onExtractError:function(s) {},
	onExtractOut:function(s) {
		if (!this.extractComplete) {
			this.buf += s;
		}
		if (~s.indexOf(__('Extract_files_please_wait') ) ) {
			$('#' + this.labelId).text(__('Extract_files_please_wait'));
		}
		if (~s.indexOf('extract_complete')) {
			this.extractComplete = true;
			this.setPBar(this.FINAL_SIZE, 100);
			clearInterval(this.interval);
			Multihost.listen = true;
		}
		if (Multihost.listen) {
			Multihost.onProcessOut(s);
		}
	},
	onHumanFolderSize:function(s) {},
	onFinExtract:function() {
		if (Autorun.isUnityEnv()) {
			Autorun.createUnityLauncherItem();
		}
		
		$('#' + this.labelId).text(__('thank_now_must_be_fastxampp'));
		setTimeout(
			function(){
				var timeout = 2000;
				if (!IS_UNITY) {
				  //if (!(window.IS_KDE && !window.IS_KDE5)) {
				    Exec.exec(Qt.appDir() + '/data/fastxamppfirst.sh &', EXEC_NULL);
				    //timeout = 10000;
				  //}
				}
				
				setTimeout(
					function(){
					     Qt.quit();
					},
					timeout
				);
			},
			100
		);
	}
};


function Extractor_onCopyExtractTpl(out, err) {Extractor.onCopyExtractTpl(out, err);}
function Extractor_onHumanFolderSize(out) { Extractor.onHumanFolderSize(out);}
function Extractor_onFinExtract(out) { Extractor.onFinExtract();}
function Extractor_onExtractOut(s) {Extractor.onExtractOut(s);}
function F(){}
