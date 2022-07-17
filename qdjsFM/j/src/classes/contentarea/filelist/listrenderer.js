function ListRenderer(){
	this.iterator = 0;
	this.context = null;
	this.sz = 0;
	this.part = 100;
	this.ls = [];
	this.processing = false;
}

ListRenderer.prototype.renderPart = function(){
	var start = this.iterator,
		end = this.iterator + this.part, i,
		item, block, s,
		done = false,
		o, self = this;
	if (end >= this.sz) {
		done = true;
		end = this.sz;
	}
	this.context.setStatus.call(this.context, this.iterator + ' / ' + this.sz, 1);
	o = this.context;
	for (i = start; i < end; i++) {
		item = this.ls[i];
		s = this.context.tpl.call(this.context);
		// s = str_replace('{name}', item.name, s);
		s = s.replace('{name}', item.name);
		s = s.replace('{name}', item.name);
		s = s.replace('{img}', item.i);
		s = s.replace('{sz}', item.sz);
		// s = str_replace('{type}', item.type, s);
		s = s.replace('{type}', item.type);
		s = s.replace('{type}', item.type);
		s = s.replace('{mt}', item.mt);
		block = appendChild(this.context.contentBlock, 'div', s, {
			'data-cmid': "cmExample",
			'data-id': "f" + i,
			id: 'f' + i
		});
		
		block.onclick = function(evt) {
			// o.onClickItem(evt);
			o.onClickItem.call(o, evt);
		}
		this.iterator++;
	}
	// this.setStatus();
	if (done) {
		this.processing = false;
		clearInterval(this.iVal);
		this.context.setStatus.call(this.context, this.sz + ' ' + TextTransform.pluralize(this.sz, L('Objects'), L('Objects-voice1'), L('Objects-voice2')));
	}
}

ListRenderer.prototype.run = function(sz, context, ls){
	if (this.processing) {
		return false;
	}
	this.iterator = 0;
	this.context = context;
	this.sz = sz;
	this.ls = ls;
	
	var o = this;
	this.iVal = setInterval(function() {
		try {
			o.renderPart();
		} catch(err) {
			alert(err);
		}
	}, 1*10);
	this.processing = true;
	o.renderPart();
	
	return true;
}
