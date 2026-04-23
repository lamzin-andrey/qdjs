function CInputValueStorage() {
	this.inputList = [];
}

CInputValueStorage.prototype.add = function(id)
{
	var o = e(id), self = this, stored;
	if (o) {
		this.inputList.push(id);
		o.addEventListener("input", function(){self.onInput(id);});
		stored = Settings.get(id);
		if (stored) {
			o.value = stored;
		}
	}
}

CInputValueStorage.prototype.onInput = function(id) {
	var o = e(id);
	if (o) {
		Settings.set(id, o.value);
	}
}

window.InputValueStorage = new CInputValueStorage();
