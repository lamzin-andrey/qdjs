var W = window;
/**
 *  @description 
 *  @param {String} workdir is the directory with teplate shell scripts
 *  
*/
function FFMpeg(workdir) {
	this.workdir = workdir;
	this.statusText = '';
}
/**
 *  @description Set metatags in mp3 file fileName.  Comment Idv3 Support.
 *  @param commentId3V2 yet not support
 *  @param coveryet not support
 *  
*/
FFMpeg.prototype.setMetadata = function(fileName, genre, title, numberOfTrack, artist, album, commentId3v1, year, commentId3V2, cover, oCallback) {
	if (W.ffmpegSetMetadataProcessIsRun) {
		// alert('W.ffmpegSetMetadataProcessIsRun = ' + W.ffmpegSetMetadataProcessIsRun);
		this.statusText = 'Another ffmpeg process already run';
		onFFmpegExecuteSetMetadataCommand('', this.statusText);
		return;
	}
	// tpl = 'ffmpeg -i 011.mp3 -c copy -metadata comment="Просто комментарий"  -metadata genre="Audiobook" -metadata title="011" -metadata track="12" -metadata artist="Пелевин" -metadata album="Ананасная вода для прекрасной дамы" -write_id3v1 true 011-m.mp3';
	var tpl = 'ffmpeg -i "{inputFile}" -c copy -metadata comment="{commentv1}"  -metadata genre="{genre}"\
	 -metadata title="{title}" -metadata track="{track}" -metadata date="{year}" \
	 -metadata artist="{artist}" -metadata album="{album}" {writeIdv3} "{outfile}"',
		s, outFile, shell;
	s = genre ? tpl.replace('{genre}', genre) : tpl.replace('{genre}', '');
	s = title ? s.replace('{title}', title) : s.replace('{title}', '');
	s = numberOfTrack ? s.replace('{track}', numberOfTrack) : s.replace('{track}', '');
	s = artist ? s.replace('{artist}', artist) : s.replace('{artist}', '');
	s = year ? s.replace('{year}', year) : s.replace('{year}', '');
	s = album ? s.replace('{album}', album) : s.replace('{album}', '');
	if (commentId3v1) {
		s = s.replace('{commentv1}', commentId3v1);
		s = s.replace('{writeIdv3}', '-write_id3v1 true');
	} else {
		s = s.replace('{commentv1}', '');
		s = s.replace('{writeIdv3}', '');
	}
	s = s.replace('{inputFile}', fileName);
	outfile = this.createOutfileName(fileName);
	s = s.replace('{outfile}', outfile);
	shell = PHP.file_get_contents(this.workdir + '/metadata.tpl.sh');
	s = shell.replace('{ffmpeg_command}', s);
	s = s.replace('{outfile}', outfile);
	s = s.replace('{outfile}', outfile);
	s = s.replace('{outfile}', outfile);
	s = s.replace('{infile}', fileName);
	s = s.replace('{infile}', fileName);
	PHP.file_put_contents(this.workdir + '/metadata.sh', s);
	W.ffmpegSetMetadataProcessIsRun = true;
	W.ffmpegSetMetadataCallback = oCallback;
	PHP.exec(this.workdir + '/metadata.sh', 'onFFmpegExecuteSetMetadataCommand', 'onNull', 'onNull');
}
FFMpeg.prototype.clearMetadataFile = function() {
	PHP.file_put_contents(this.workdir + '/metadata.sh', '');
}
FFMpeg.prototype.createOutfileName = function(fileName) {
	var ls = fileName.split('/'), s, l2;
	s = '.' + ls[sz(ls) - 1];
	ls[sz(ls) - 1] = s;
	this.shortname = s;
	
	return ls.join('/');
}

/**
 * 
*/
function onFFmpegExecuteSetMetadataCommand(stdin, stdout) {
	// alert('Call onFFmpegExecuteSetMetadataCommand');
	if (W.ffmpegSetMetadataCallback
		&& W.ffmpegSetMetadataCallback.context
		&& (W.ffmpegSetMetadataCallback.m instanceof Function) ) {
			W.ffmpegSetMetadataProcessIsRun = false;
			// alert('Try calling!');
			W.ffmpegSetMetadataCallback.m.call(W.ffmpegSetMetadataCallback.context, stdin, stdout);
			
	}
}
