window.QtShadow = {
	resizeTo(w, h){console.log(`Qt resizeTo ${w}, ${h}`);},
	maximize(){console.log(`Qt maximize`);},
	minimize(){console.log(`Qt minimize`);},
	showFullScreen(){console.log(`Qt show fulscreen`);},
	showNormal(){console.log(`Qt show normal`);},
	hideMainMenu(){console.log(`Qt hide menu`);},
	showMainMenu(){console.log(`Qt show menu`);},
	moveTo(x, y){console.log(`Qt move to ${x}, ${y}`);},
	setWindowIconImage(s){console.log(`Qt set image ${s}`);},
	setTitle(s){console.log(`Qt set title ${s}`);},
	quit(){console.log(`Qt quit`);},
	exec(cmd, onFin, onStdout){console.log(`Qt run ${cmd}`);},
	appDir(){ return '.';},
	getArgs(){console.log(`Qt run getArgs`);},
	getLastKeyChar(evt){console.log(`Qt getLastKeyChar`); return 't';},
	getLastKeyCode(evt){console.log(`Qt getLastKeyCode`); return 101;},
	openFileDialog(caption, directory, filter){console.log(`Qt openFileDialog(${caption}, ${directory}, ${filter})`);},
	openDirectoryDialog(caption, directory, filter){console.log(`Qt openDirectoryDialog(${caption}, ${directory}, ${filter})`);},
	saveFileDialog(caption, directory, filter){console.log(`Qt saveFileDialog(${caption}, ${directory}, ${filter})`);},
	openFilesDialog(caption, directory, filter){console.log(`Qt openFilesDialog(${caption}, ${directory}, ${filter})`);},
	renameMenuItem(x, y, text){console.log(`Qt renameMenuItem(${x}, ${y}, ${text})`);}
};

