function CAppCreator() {}
CAppCreator.prototype.init = function() {
	var o = this;
	o.bPrev   = e('bPrev');
	o.bNext   = e('bNext');
	o.bCancel = e('bCancel');
	
	attr('imgAppIcon', 'src', App.dir() + "/i/exec32.png");
	
	o.screenWindowButton = new CScreenWindowButton(o);
	o.screenWindowButton.init();
	
	o.screenAppName = new CScreenAppName(o);
	o.screenAppName.init();
	
	o.screenAppIcon = new CScreenAppIcon(o);
	o.screenAppIcon.init();
	
	o.compiler = new CCompiler(o);
	
	o.onEnterHelloScreen();
}

CAppCreator.prototype.onCompile = function() {
	this.compiler.compile();
	
}

CAppCreator.prototype.onEnterAppIconScreen = function() {
	var o = this;
	show(o.bPrev, 1);
	showScreen('hAppIconScreen');
	attr(o.bNext, 'value', L('Done'));
	
	o.bNext.onclick = function(){
		// if (o.screenApp1001.validate()) {
			// alert('Goto forward!');
			// o.onEnterApp1001Screen();
		// }
		o.onCompile();
	}
	o.bPrev.onclick = function(){
		o.onEnterAppNameScreen();
	}
}

CAppCreator.prototype.onEnterAppNameScreen = function() {
	var o = this;
	show(o.bPrev, 1);
	attr(o.bNext, 'value', L('bNext'));
	showScreen('hAppNameScreen');
	o.bNext.onclick = function(){
		if (o.screenAppName.validate()) {
			o.onEnterAppIconScreen();
		}
	}
	o.bPrev.onclick = function(){
		o.onEnterHelloScreen();
	}
}
CAppCreator.prototype.onEnterHelloScreen = function() {
	var o = this;
	hide(o.bPrev);
	showScreen('hScreen1');
	o.bNext.onclick = function(){
		if (o.screenWindowButton.validate()) {
			o.onEnterAppNameScreen();
		}
	}
}


