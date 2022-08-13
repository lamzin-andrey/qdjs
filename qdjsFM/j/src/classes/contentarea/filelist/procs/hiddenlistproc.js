function HiddenListProc(){}
extend(AbstractListProc, HiddenListProc);
HiddenListProc.prototype.getProcName = function(){
	return 'lsh';
}
