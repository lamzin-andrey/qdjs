function AbstractList(){}


AbstractList.prototype.init = function(id, title) {
	this.id = id;
	this.title = title;
	this.contentBlock = cs(id, 'sectionContent')[0];
	this.titleBlock = cs(id, 'sectionTitle')[0];
}

AbstractList.prototype.render = function() {
	console.log(this.list);
	this.contentBlock.innerHTML = '';
	this.titleBlock.innerHTML = this.title;
	var i, SZ = sz(this.list), s, item, o = this;
	for (i = 0; i < SZ; i++) {
		s = this.tpl();
		s = s.replace('{img}', this.list[i].icon);
		s = s.replace('{name}', this.list[i].displayName);
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

AbstractList.prototype.tpl = function()  {
	return '<img src="{img}" class="i24">\
						<span class="i24Text">{name}</span>';
}
