function TimeControl() {
	var o = this, hSpinner, mSpinner;
	hSpinner = new Spinner('iHour', L('Hour'), 'hour', 23); // 59
	mSpinner = new Spinner('iMin', L('Minute'), 'min', 59); // 59
	
	o.setDisabled = function(b){
		hSpinner.setDisabled(b);
		mSpinner.setDisabled(b);
	}
	
	o.onTick = function() {
		hSpinner.onTick();
		mSpinner.onTick();
	}
	
	Object.defineProperty(o, 'targetH', {
	  get:function() {
		return hSpinner.value;
	  },
	  set:function(v) {
		hSpinner.value = v;
	  },
	  configurable: true,
	  enumerable: true
	});
	
	Object.defineProperty(o, 'targetM', {
	  get:function() {
		return mSpinner.value;
	  },
	  set:function(v) {
		mSpinner.value = v;
	  },
	  configurable: true,
	  enumerable: true
	});
}


