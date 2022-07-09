function AbstractList(){}


AbstractList.prototype.init = function(id, title) {
	this.id = id;
	this.title = title;
	this.contentBlock = cs(id, 'sectionContent')[0];
	this.titleBlock = cs(id, 'sectionTitle')[0];
}

AbstractList.prototype.render = function() {
	console.log(this.list);
	var i, SZ = sz(this.list), s, item, o = this;
	
	this.contentBlock.innerHTML = '';
	this.titleBlock.innerHTML = this.title;
	
	for (i = 0; i < SZ; i++) {
		s = this.tpl();
		s = s.replace('{img}', this.list[i].icon);
		s = s.replace('{name}', this.list[i].displayName);
		if (this.list[i].path) {
			s = s.replace('{opacity}', '');
		} else {
			s = s.replace('{opacity}', 'op05');
		}
		item = appendChild(this.contentBlock, 'div', s, {
			title: this.list[i].displayName, 
			id: this.itemIdPrefix + String(i),
			"class": 'pointer sectionItem'
		}, {});
		item.onclick = function(evt) {
			o.setActiveView(evt);
			o.onClick(evt);
		}
	}
}


AbstractList.prototype.setActiveView = function(evt)  {
	var ls = cs(this.contentBlock, 'sectionItem'), i, SZ = sz(ls), sel = 'selected';
	for (i = 0; i < SZ; i++) {
		removeClass(ls[i], sel);
	}
	addClass(ctrg(evt), sel);
}

AbstractList.prototype.setPath = function(path)  {
	var ls = cs(this.contentBlock, 'sectionItem'), i, SZ = sz(ls), sel = 'selected', targetItem;
	for (i = 0; i < SZ; i++) {
		removeClass(ls[i], sel);
		if (this.list[i] && this.list[i].path == path) {
			targetItem = ls[i];
		}
	}
	if (targetItem) {
		addClass(targetItem, sel);
	}
}

AbstractList.prototype.tpl = function()  {
	return '<img src="{img}" class="i24 {opacity}">\
						<span class="i24Text">{name}</span>';
}
