window.addEventListener('load', main);

function main() {
	var nH, data, lines, bFlag, iFlag, defaultBFlag, modalFlag, title, text,
		sIco, cmd, sh;
	data = FS.readfile(App.dir() + "/d/params.txt");
	lines = explode("\n", data);
	// TODO parse flags
	bFlag = +lines[0];
	array_shift(lines);
	iFlag = +lines[0];
	sIco = App.dir() + "/i/xpinf.png";
	MW.setIconImage(sIco);
	array_shift(lines);
	defaultBFlag = +lines[0];
	array_shift(lines);
	modalFlag = +lines[0];
	array_shift(lines);
	
	title = lines[0];
	MW.setTitle(title.trim());
	
	array_shift(lines);
	text = '<p>' + implode('</p><p>', lines) + '</p>';
	text = str_replace('<p></p>', '<p>&nbsp;</p>', text);
	v("hText", text);
	
	nH = e("hText").offsetHeight;
	if (nH > 75) {
		MW.resizeTo(328, nH + 37);
	}
	
	
	cmd = "#!/bin/bash\n";
	cmd += "mplayer " + App.dir() + "/s/dzin.mp3\n";
	sh = App.dir() + "/p/u.sh";
	FS.writefile(sh, cmd);
	jexec(sh, N, N,N);
	FS.writefile(App.dir() + "/d/result.txt", 0);
	e("b1").onclick = onClickOK;
}

function onClickOK(){
	FS.writefile(App.dir() + "/d/result.txt", String(IDOK));
	MW.close();
}

function N(){}

