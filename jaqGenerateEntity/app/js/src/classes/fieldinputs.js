function FieldInputs(container, fieldList, index) {
	var o = this;
	o.container = container;
	o.fieldList = fieldList;
	o.id = index;
	o.createHtml();
	o.setListeners();
	o.restoreValues();
}
FieldInputs.prototype.restoreValues = function (){
	var o = this;
	o.fieldType.value = Settings.get('fieldType' + o.id, '');
	o.fieldDoctrineType.value = Settings.get('fieldDoctrineType' + o.id, '');
	o.fieldName.value = Settings.get('fieldName' + o.id, '');
	o.fieldNotNull.checked = Settings.get('fieldNotNull' + o.id, 1) === 1;
	o.fieldUnsigned.checked = Settings.get('fieldUnsigned' + o.id, 1) === 1;
}
FieldInputs.prototype.setListeners = function (){
	var o = this;
	o.fieldType.onkeyup = function() {
		setTimeout(function(){
			Settings.set('fieldType' + o.id, o.fieldType.value);
		}, 100);
	}
	
	o.fieldDoctrineType.onkeyup = function() {
		setTimeout(function(){
			Settings.set('fieldDoctrineType' + o.id, o.fieldDoctrineType.value);
		}, 100);
	}
	
	o.fieldName.onkeyup = function() {
		setTimeout(function(){
			Settings.set('fieldName' + o.id, o.fieldName.value);
		}, 100);
	}
	
	o.fieldNotNull.onchange = function() {
		setTimeout(function(){
			Settings.set('fieldNotNull' + o.id, (o.fieldNotNull.checked ? 1 : 2));
		}, 100);
	}
	
	o.fieldUnsigned.onchange = function() {
		setTimeout(function(){
			Settings.set('fieldUnsigned' + o.id, (o.fieldUnsigned.checked ? 1 : 2));
		}, 100);
	}
	
	o.buttonDelete.onclick = function() {
		o.fieldList.remove(o.id);
	}
}

FieldInputs.prototype.createHtml = function(){
	var o = this,
		div = appendChild(o.container, 'div', '', {
			'class': 'fieldItem wBorder',
			'id': 'fieldList' + o.id
		}),
		fieldType,
		fieldDoctrineType,
		fieldName,
		fieldNotNull,
		fieldNotNullLabel,
		fieldUnsigned,
		fieldUnsignedLabel,
		buttonDelete;
	o.fieldType = fieldType = appendChild(div, 'input', '', {
		'type': 'text',
		'class': 'fieldType',
		'placeholder': 'DriverDto[]',
	});
	
	fieldDoctrineType = o.fieldDoctrineType = appendChild(div, 'input', '', {
		'type': 'text',
		'class': 'fieldDoctrineType',
		'placeholder': 'doctrine type (bigint)',
	});
	
	fieldName = o.fieldName = appendChild(div, 'input', '', {
		'type': 'text',
		'class': 'fieldName',
		'placeholder': 'updatedTime',
	});
	
	fieldNotNull = o.fieldNotNull = appendChild(div, 'input', '', {
		'type': 'checkbox',
		'class': 'fieldNotNull',
	});
	fieldNotNullLabel = o.fieldNotNullLabel = appendChild(div, 'label', 'Not Null');
	
	fieldUnsigned = o.fieldUnsigned = appendChild(div, 'input', '', {
		'type': 'checkbox',
		'class': 'fieldUnsigned',
	});
	o.fieldUnsignedLabel = fieldUnsignedLabel = appendChild(div, 'label', 'Unsigned');
	
	buttonDelete = o.buttonDelete = appendChild(div, 'input', '', {
		'type': 'button',
		'class': 'inlineBtn',
		'value': 'Remove'
	});
	
}

FieldInputs.prototype.foo = function (){}
