var Lib = {
	acme:function() {
		alert(101  + " A.C.M.E " + 102);
	},
	setListeners:function() {
		var o = this;
		e("bClose").onclick = function() {
			o.onClickClose();
		};
	},
	onClickClose:function() {
		alert("IO clicked!");
		window.location.reload();
	}
};
