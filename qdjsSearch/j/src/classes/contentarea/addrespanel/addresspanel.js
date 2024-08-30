function AddressPanel() {
	this.name = "AddressPanel";
	this.buttonAddress   = new ButtonAddress();
	this.textAddress     = new TextAddress();
	this.addressSwitcher = new AddressSwitcher(this.textAddress, this.buttonAddress);
}
AddressPanel.prototype.setPath = function(s) {
	this.buttonAddress.setPath(s);
	this.textAddress.setPath(s);
}

AddressPanel.prototype.resize = function(s) {
	this.textAddress.resize();
	this.buttonAddress.render();
}

AddressPanel.prototype.showTextAddress = function() {
	this.buttonAddress.hide();
	this.textAddress.show();
}

AddressPanel.prototype.showButtonAddress = function() {
	this.textAddress.hide();
	this.buttonAddress.show();
}
AddressPanel.prototype.showTextAddressShort = function() {
	this.buttonAddress.hide();
	this.textAddress.setShortDisplayMode();
	this.textAddress.show();
	this.textAddress.focus();
}
AddressPanel.prototype.show = function() {
	if (1 == intval(Settings.get('addressLineMode'))) {
		this.textAddress.show();
	} else {
		this.buttonAddress.show();
	}
}

