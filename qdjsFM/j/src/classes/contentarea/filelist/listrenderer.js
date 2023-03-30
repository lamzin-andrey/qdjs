function ListRenderer(){
	this.iterator = 0;
	this.context = null;
	this.sz = 0;
	this.part = 0;
	this.ls = [];
	this.processing = false;
	this.filesSize = 0;
	this.dfProc = 0;
}

ListRenderer.ONE_ITEM_HEIGHT = 30;

ListRenderer.prototype.renderPart = function(){
	var start = this.iterator,
		end = intval(this.iterator) + this.part, i, j,
		item, block, s,
		done = true,
		o, self = this,
		statusText, freeSpaceText = '', sizeText = '',
		cmId,
		createdItemFound = -1, el, domLs, domEl;
	if (end >= this.sz) {
		end = this.sz;
	}
	domLs = cs(this.context.contentBlock, this.context.cName);
	this.context.setStatus.call(this.context, this.iterator + ' / ' + this.sz, 1);
	o = this.context;
	for (i = start, j = 0; i < end; i++, j++) {
		item = this.ls[i];
		domEl = domLs[j];
		// if (!domEl) {
			el = this.appendNew(i, item);
		/*} else {
			this.updateItem(i, item, domEl);
			el = domEl;
		}*/
		
		if (i == start) {
			this.firstRenderedEl = el;
		}
		if (i == end - 1) {
			this.lastRenderedEl = el;
		}
		if (item.name == app.tab.createdItemName) {
			createdItemFound = i;
		}
		
		this.iterator++;
	}
	/*while (j < sz(domLs)) {
		domLs[j].removeAttribute('id');
		stl(domLs[j], 'display', 'none');
		j++;
	}*/
	// this.setStatus();
	if (createdItemFound > -1) {
		app.tab.selectItemByIdx(createdItemFound);
	}
	
	if (done) {
		this.processing = false;
		if (!this.skipCalcSize) {
			for (i = 0; i < this.sz; i++) {
				item = this.ls[i];
				this.incSize(item.sz);
			}
		}
		freeSpaceText = app.devicesManager.getPluralFreeSpaceOfDiskPartByPath(app.tab.currentPath);
		if (freeSpaceText) {
			freeSpaceText = ', ' + freeSpaceText;
		}
		statusText = this.sz + ' ' 
						+ TextTransform.pluralize(this.sz, L('Objects'), L('Objects-voice1'), L('Objects-voice2'))
						+ ' (' + this.getHumanFilesize(intval(this.filesSize), 2, 3, false) + ')'
						+ freeSpaceText;
		this.context.setStatus.call(this.context, statusText);
		if (!this.skipRunUpdater) {
			this.context.listUpdater.run.call(this.context.listUpdater);
		} else {
			this.skipRunUpdater = false;
		}
		if (!this.dfProc) {
			this.dfProc = 1;
			jexec('df -h', [this, this.onDiskData], DevNull, DevNull);
		}
	}
}

ListRenderer.prototype.onDiskData = function(stdout, stderr){
	var listDisks = app.devicesManager.parseDfhOut(stdout), i;
	for (i in listDisks) {
		if (app.devicesManager.listDisks[i]) {
			app.devicesManager.listDisks[i].f = listDisks[i].f;
		}
	}
	this.dfProc = 0;
}

ListRenderer.prototype.run = function(sz, context, ls, firstItemIdx, skipCalcSize){
	/*if (this.processing) {
		return false;
	}*/
	context.contentBlock.innerHTML = '';
	this.iterator = firstItemIdx;
	this.context = context;
	this.sz = sz;
	this.ls = ls;
	if (!skipCalcSize) {
		this.filesSize = 0;
	}
	this.skipCalcSize = skipCalcSize;
	
	var o = this;
	this.processing = true;
	this.calculatePart();
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
		['Bytes', 'KB', 'MB', 'GB', 'TB'],
		1024,
		$percision,
		$maxOrder,
		$pack
    );
}



ListRenderer.prototype.createElement = function(item, i) {
	var s, active = 'active';
	if (e('f' + i)) {
		return e('f' + i);
	}
	if (!this.context.oSelectionItems['f' + i]) {
		active = ''
	}
	s = this.context.tpl.call(this.context);
	s = s.replace('{name}', item.name);
	s = s.replace('{name}', item.name);
	s = s.replace('{img}', item.i);
	s = s.replace('{sz}', item.sz);
	s = s.replace('{type}', item.type);
	s = s.replace('{type}', item.type);
	s = s.replace('{mt}', item.mt);
	s = s.replace('{active}', active);
	s = s.replace('{id}', i);
	s = s.replace('{id}', i);
	block = appendChild(this.context.contentBlock, 'div', s, {
		'data-cmid': item.cmId,
		'data-id': "f" + i,
		'data-handler': "onContextMenu",
		'data-handler-context': "tab",
		id: 'f' + i
	});
	
	return block;
}

ListRenderer.prototype.updateItem = function(i, newItem, existsNode) {
	var el = e('f' + i), child;
	if (existsNode) {
		el = existsNode;
	}
	if (!el) {
		return;
	}
	attr(el, 'data-cmid', newItem.cmId);
	attr(el, 'data-id', 'f' + i);
	attr(el, 'id', 'f' + i);
	stl(el, 'display', null);
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
		/*child.onload = function() {
			app.tab.onLoadPreview(i);
		}*/
	}
}
ListRenderer.prototype.getCurrentIcon = function(i) {
	var child = cs(('f' + i), 'imgTabContentItemIcon')[0];
	if (child) {
		return attr(child, 'src');
	}
	return '';
}
ListRenderer.prototype.setCurrentIcon = function(i, src) {
	var child = cs(('f' + i), 'imgTabContentItemIcon')[0];
	if (child) {
		attr(child, 'src', src);
	}
}
ListRenderer.prototype.renderItemName = function(i, name) {	
	var child = cs(e('f' + i), this.context.cName)[0];
	if (child) {
		attr(child, 'title', name + ' id = f' + i);
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
	return block;
}

ListRenderer.prototype.calculatePart = function() {
	this.part = Math.ceil(this.context.contentBlock.offsetHeight / ListRenderer.ONE_ITEM_HEIGHT) - 1;
	
}

ListRenderer.prototype.shiftDown = function(itemData, nId) {
	var firstItem, ls, el;
	el = this.appendNew(nId, itemData);
	this.lastRenderedEl = el;
	ls = cs(this.context.contentBlock, this.context.cName);
	firstItem = ls[0];
	if (firstItem) {
		this.firstRenderedEl = ls[1].parentNode;
		rm(firstItem.parentNode);
	}
	/*var firstItem, ls, el, start, i, j;
	ls = cs(this.context.contentBlock, this.context.cName);
	firstItem = ls[0];
	// alert(this.context.toI(firstItem.parentNode.id));
	start = intval(this.context.toI(firstItem.parentNode.id)) + 1;
	for (i = start, j = 0; j < sz(ls); i++, j++) {
		if (this.context.list[i] && ls[j]) {
			this.updateItem(i, this.context.list[i], ls[j].parentNode);
		} else if (!this.context.list[i] && ls[j]) {
			ls[j].removeAttribute('id');
			stl(ls[j], 'display', 'none');
		}
		
	}*/
}

ListRenderer.prototype.shiftUp = function(itemData, nId) {
	var ls = cs(this.context.contentBlock, this.context.cName),
		firstItem = ls[0],
		lastItem = ls[sz(ls) - 1],
		newItem;
	if (lastItem) {
		this.lastRenderedEl = ls[sz(ls) - 2].parentNode;
		rm(lastItem.parentNode);
	}
	if (firstItem) {
		newItem = this.createElement(itemData, nId);
		insertBefore(firstItem.parentNode, newItem);
		this.setListeners(newItem);
		this.firstRenderedEl = newItem;
	}
	/*var firstItem, ls, el, start, i, j;
	ls = cs(this.context.contentBlock, this.context.cName);
	firstItem = ls[0];
	// alert(this.context.toI(firstItem.parentNode.id));
	start = intval(this.context.toI(firstItem.parentNode.id)) - 1;
	for (i = start, j = 0; j < sz(ls); i++, j++) {
		if (this.context.list[i] && ls[j]) {
			this.updateItem(i, this.context.list[i], ls[j].parentNode);
		} else if (!this.context.list[i] && ls[j]) {
			ls[j].removeAttribute('id');
			stl(ls[j], 'display', 'none');
		}
		
	}*/
}
