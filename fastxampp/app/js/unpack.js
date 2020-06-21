window.Extractor = {
	init:function() {
		this.labelId = 'progressStateLabel';
		e(this.labelId).innerHTML = __('Start_copy') + '..';
		this.dataDir    = Qt.appDir() + '/data';
		this.FINAL_SIZE = 691148;
		this.sizeProcess = 0;
		this.setPBar(0, 0);
		Multihost.init(this);
		Autorun.init(this);
	},
	onFolderSize:function(s) {
		var a = s.split(/\s+/);
		var n = parseInt( $.trim(a[0]) );
		var p = Math.round(n / (this.FINAL_SIZE / 100));
		this.setPBar(n, p);
		Extractor.sizeProcess = 0;
	},
	extract:function() {
		var cmd = 'cp -f ' + this.dataDir + '/unpack.tpl.sh' + ' ' + this.dataDir + '/unpack.sh';
		PHP.exec(cmd, 'Extractor_onCopyExtractTpl')
	},
	onCopyExtractTpl:function(stdout, stderr) {
		if (stderr) {
			alert(stderr);
		}
		var c = PHP.file_get_contents(this.dataDir + '/unpack.sh');
		c = c.replace('[[source]]', this.dataDir + '/xampp-php7.tar.gz');
		c = c.replace('[[Start_copy]]', __('Start_copy'));
		c = c.replace('[[Extract_files_please_wait]]', __('Extract_files_please_wait'));
		PHP.file_put_contents(this.dataDir + '/unpack.sh', c);
		Multihost.createCommand(this.dataDir + '/unpack.sh');
		Autorun.createCommand(this.dataDir + '/unpack.sh');
		Exec.exec('pkexec ' + this.dataDir + '/unpack.sh &', 'Extractor_onFinExtract', 'Extractor_onExtractOut', 'Extractor_onExtractError');
		
		this.interval = setInterval(
			function() {
				if (Extractor.sizeProcess == 0) {
					if (PHP.file_exists('/opt/lampp')) {
						Extractor.sizeProcess = 1;
						PHP.exec('du -s /opt/lampp', 'F', 'Extractor_onFolderSize');
						//PHP.exec('du -hs /opt/lampp', 'F', 'Extractor_onHumanFolderSize');
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
		if (~s.indexOf(__('Extract_files_please_wait') ) ) {
			$('#' + this.labelId).text(__('Extract_files_please_wait'));
		}
		if (~s.indexOf('extract_complete')) {
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
		$('#' + this.labelId).text(__('thank_now_must_be_fastxampp'));
		Exec.exec(EXEC_FOLDER + '/fastxampp.sh', EXEC_NULL);
		setTimeout(
			function(){
				Qt.quit();
			},
			3000
		);
	}
};


function Extractor_onCopyExtractTpl(out, err) {Extractor.onCopyExtractTpl(out, err);}
function Extractor_onFolderSize(out) { Extractor.onFolderSize(out);}
function Extractor_onHumanFolderSize(out) { Extractor.onHumanFolderSize(out);}
function Extractor_onFinExtract(out) { Extractor.onFinExtract();}
function Extractor_onExtractOut(s) {Extractor.onExtractOut(s);}
function F(){}
