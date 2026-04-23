function CAppCreator() {}
CAppCreator.prototype.init = function() {
	var self, s = storage("testvalue");
	self = this;
	if (s) {
		v("iExampleStorage", s);
	}
	e("iExampleStorage").oninput = function(ev){self.onInput();}
	//alert(L("It new aplication!"));
}

CAppCreator.prototype.onInput = function() {
	storage("testvalue", v("iExampleStorage"));
}
