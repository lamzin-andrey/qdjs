function ListRenderer(){
	this.iterator = 0;
	this.context = null;
	this.sz = 0;
	this.part = 100;
	this.ls = [];
	this.processing = false;
	this.filesSize = 0;
}

ListRenderer.prototype.renderPart = function(){
	var start = this.iterator,
		end = this.iterator + this.part, i,
		item, block, s,
		done = false,
		o, self = this,
		statusText, freeSpaceText = '', sizeText = '',
		cmId;
	if (end >= this.sz) {
		done = true;
		end = this.sz;
	}
	this.context.setStatus.call(this.context, this.iterator + ' / ' + this.sz, 1);
	o = this.context;
	for (i = start; i < end; i++) {
		item = this.ls[i];
		/*s = this.context.tpl.call(this.context);
		s = s.replace('{name}', item.name);
		s = s.replace('{name}', item.name);
		s = s.replace('{img}', item.i);
		s = s.replace('{sz}', item.sz);
		s = s.replace('{type}', item.type);
		s = s.replace('{type}', item.type);
		s = s.replace('{mt}', item.mt);
		block = appendChild(this.context.contentBlock, 'div', s, {
			'data-cmid': item.cmId,
			'data-id': "f" + i,
			'data-handler': "onContextMenu",
			'data-handler-context': "tab",
			id: 'f' + i
		});*/
		
		/*block = this.createElement(item, i);
		this.setListeners(block);*/
		this.appendNew(i, item);
		
		this.iterator++;
		this.incSize(item.sz);
	}
	// this.setStatus();
	if (done) {
		this.processing = false;
		clearInterval(this.iVal);
		freeSpaceText = app.devicesManager.getPluralFreeSpaceOfDiskPartByPath(app.tab.currentPath);
		if (freeSpaceText) {
			freeSpaceText = ', ' + freeSpaceText;
		}
		statusText = this.sz + ' ' 
						+ TextTransform.pluralize(this.sz, L('Objects'), L('Objects-voice1'), L('Objects-voice2'))
						+ ' (' + this.getHumanFilesize(intval(this.filesSize), 2, 3, false) + ')'
						+ freeSpaceText;
		this.context.setStatus.call(this.context, statusText);
		this.context.listUpdater.run.call(this.context.listUpdater);
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
	this.filesSize = 0;
	
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

ListRenderer.prototype.incSize = function(sz){
	var aSz = sz.split(','), fSz, m = 1024;
	aSz[1] = (aSz[1] ? aSz[1] : '').replace(/\D/mig, '');
	fSz = aSz[0] + '.' + aSz[1];
	fSz = parseFloat(fSz);
	if (sz.indexOf(L('K')) != -1) {
		fSz *= m;
	} else if (sz.indexOf(L('M')) != -1) {
		fSz *= m * m;
	} else if (sz.indexOf(L('G')) != -1) {
		fSz *= m * m * m;
	} else if (sz.indexOf(L('T')) != -1) {
		fSz *= m * m * m * m;
	}
	this.filesSize += fSz;
	
	return fSz;
}



ListRenderer.prototype.getHumanFilesize = function($n, $percision, $maxOrder, $pack) {
    var fileSize = new FileSize();
    return fileSize.getHumanValue($n,
		['b', 'KB', 'MB', 'GB', 'TB'],
		1024,
		$percision,
		$maxOrder,
		$pack
    );
}



ListRenderer.prototype.createElement = function(item, i) {
	var s;
	s = this.context.tpl.call(this.context);
	s = s.replace('{name}', item.name);
	s = s.replace('{name}', item.name);
	s = s.replace('{img}', item.i);
	s = s.replace('{sz}', item.sz);
	s = s.replace('{type}', item.type);
	s = s.replace('{type}', item.type);
	s = s.replace('{mt}', item.mt);
	block = appendChild(this.context.contentBlock, 'div', s, {
		'data-cmid': item.cmId,
		'data-id': "f" + i,
		'data-handler': "onContextMenu",
		'data-handler-context': "tab",
		id: 'f' + i
	});
	
	return block;
}

ListRenderer.prototype.updateItem = function(i, newItem) {
	var el = e('f' + i), child;
	if (!el) {
		return;
	}
	attr(el, 'data-cmid', newItem.cmId);
	attr(el, 'data-id', 'f' + i);
	attr(el, 'id', 'f' + i);
	this.renderItemName(i, newItem.name);
	this.renderItemIcon(i, newItem.i);
	this.renderItemSize(i, newItem.sz);
	this.renderItemType(i, newItem.type);
	this.renderItemModifyDate(i, newItem.mt);
}
ListRenderer.prototype.renderItemModifyDate = function(i, mt) {
	this.setSubValue(e('f' + i), 'tabContentItemDate', mt);
}
ListRenderer.prototype.setSubValue = function(el, className, val) {
	var child = cs(el, className)[0];
	if (child) {
		child = cs(child, 'tabContentItemName')[0];
		if (child) {
			child.innerHTML = val;
		}
	}
}
ListRenderer.prototype.renderItemType = function(i, t) {
	var el = e('f' + i), 
		child = cs(el, 'tabContentItemType')[0];
	if (child) {
		attr(child, 'title' , t);
		child = cs(child, 'tabContentItemName')[0];
		if (child) {
			child.innerHTML = t;
		}
	}
}
ListRenderer.prototype.renderItemSize = function(i, size) {
	this.setSubValue(e('f' + i), 'tabContentItemSize', size);
}
ListRenderer.prototype.renderItemIcon = function(i, src) {
	var child = cs(('f' + i), 'imgTabContentItemIcon')[0];
	if (child) {
		attr(child, 'src', src);
	}
}
ListRenderer.prototype.renderItemName = function(i, name) {	
	var child = cs(e('f' + i), 'tabContentItem')[0];
	if (child) {
		attr(child, 'title', name);
		this.setSubValue(child, 'tabContentItemNameMain', name);
	}
}
ListRenderer.prototype.setListeners = function(block) {
	var o = this.context;
	block.onclick = function(evt) {
		o.onClickItem.call(o, evt);
	}
}
ListRenderer.prototype.appendNew = function(i, item) {
	var block = this.createElement(item, i);
	this.setListeners(block);	
}
