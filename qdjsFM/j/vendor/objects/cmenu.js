window.oncontextmenu = function(event) {
	event.preventDefault();
	// console.log(event);
	
	var s = ContextMenuManager.getTpl(event),
		id = ContextMenuManager.id, cmWrapper, vp = getViewport(),
		x, y, w, h;
	if (s) {
		cmWrapper = e(id);
		if (!cmWrapper) {
			cmWrapper = appendChild(body(), 'div', s, {'id': id}, {});
			cmWrapper.style.position = 'absolute';
			cmWrapper.style.left = '0px';
			cmWrapper.style.top = '0px';
			cmWrapper.style['z-index'] = 4;
		}
		cmWrapper.style.opacity = 0.0;
		cmWrapper.style.display = 'block';
		cmWrapper.innerHTML = s;
		x = event.clientX;
		y = event.clientY;
		w = cmWrapper.offsetWidth;
		h = cmWrapper.offsetHeight;
		cmWrapper.style.left = x + 'px';
		cmWrapper.style.top = y + 'px';
		
		if (x + w > vp.w) {
			x = x - w;
		}
		if (y + h > vp.h) {
			y = y - h;
		}
		cmWrapper.style.left = x + 'px';
		cmWrapper.style.top = y + 'px';
		cmWrapper.style.opacity = 1.0;
	}
	
	return false;
}

window.ContextMenuManager = {
	id: 'qdjsfmcm',
	
	hide: function() {
		e(this.id).style.display = 'none';
	},
	
	getTpl:function(event) {
		var htmlElement = this.getCurrentTarget(event);
		// console.log(htmlElement);
		if (!htmlElement) {
			return '';
		}
		var cmId = attr(htmlElement, 'data-cmid'),
			targetId = attr(htmlElement, 'data-id');
		if (!cmId && !targetId) {
			return '';
		}
		window.currentCmTargetId = targetId;
		return e(cmId).innerHTML;
	},
	
	getCurrentTarget:function(event) {
		var node = event.target;
		while(node.tagName != 'BODY') {
			if (attr(node, 'data-cmid')) {
				return node;
			}
			node = node.parentNode;
		}
		
		return node;
	}
};

window.onclick = function(event) {
	ContextMenuManager.hide();
}


// For test

window.app = {
	folderContextMenu: {
		onClickOpen:function(){
			// alert('Will open ' + window.currentCmTargetId);
			ContextMenuManager.hide();
		}
	}
};
