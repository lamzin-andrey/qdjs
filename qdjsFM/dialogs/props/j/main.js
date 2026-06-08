window.onload = function(){
	try {
		MW.setIconImage(App.dir() + "/../../i/exec32.png");
		MW.setTitle(L("Properties"))
		W.app = W.propDlgApp = new PropsDlg();
		W.propDlgApp.setListeners(1);
		W.propDlgApp.getData();
	} catch(err){
		alert(err);
	}
}
function DevNull(){}
