function ClickEditElement(view, value) {
	this.view = view;
	this.value = value;
	this.inp = null;
	var o = this;
	this.view.onclick = function(e){ o.onClick(e); }
}

ClickEditElement.prototype.onClick = function(evt) {
	evt.preventDefault();
	if (this.inp) {
		return;
	}
	this.view.innerHTML = '';
	this.inp = appendChild(this.view, 'input', '', {value: this.value, type: 'text'}),
		o = this;
	this.inp.onkeydown = function(evt){
		return o.onKeyDown(evt);
	}
	setTimeout(function(){
		o.inp.focus();
	}, 100);
}

ClickEditElement.prototype.onKeyDown = function(evt) {
	// evt.preventDefault();
	
	if (evt.keyCode == 13) {
		this.value = this.inp.value;
		this.view.innerHTML = this.value;
		this.inp = null;
		if (this.onChange && (this.onChange.m instanceof Function) ) {
			this.onChange.m.call(this.onChange.context, this.value);
		} else {
			alert('You must set clickEditElement.onChange = {m:this.onChangeValue, context:this}');
		}
	}
	if (evt.keyCode == 27) {
		this.view.innerHTML = this.value;
		this.inp = null;
	}
	return true;
}
