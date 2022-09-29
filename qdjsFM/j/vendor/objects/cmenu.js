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
		if (y < 0) {
			y = 0;
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
		stl(this.id, 'display', 'none');
	},
	
	getTpl:function(event) {
		var htmlElement = this.getCurrentTarget(event);
		// console.log(htmlElement);
		if (!htmlElement) {
			return '';
		}
		var cmId = attr(htmlElement, 'data-cmid'),
			targetId = attr(htmlElement, 'data-id'),
			targetHandler = attr(htmlElement, 'data-handler'),
			targetHandlerContext = attr(htmlElement, 'data-handler-context');
		if (!cmId && !targetId) {
			this.hide();
			return '';
		}
		window.currentCmTargetId = targetId;
		if (targetHandlerContext && (window[targetHandlerContext] instanceof Object) && (window[targetHandlerContext][targetHandler] instanceof Function)) {
			window[targetHandlerContext][targetHandler].call(window[targetHandlerContext], targetId, event)
		}
		if (!e(cmId)) {
			this.hide();
		}
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
