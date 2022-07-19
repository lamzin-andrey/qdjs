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
			'data-cmid': item.cmId,
			'data-id': "f" + i,
			'data-handler': "onContextMenu",
			'data-handler-context': "tab",
			id: 'f' + i
		});
		
		block.onclick = function(evt) {
			// o.onClickItem(evt);
			o.onClickItem.call(o, evt);
		}
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
}



ListRenderer.prototype.getHumanFilesize = function($n, $percision, $maxOrder, $pack) {
    $percision = String($percision) == 'undefined' ? 3 : $percision;
    $maxOrder = String($maxOrder) == 'undefined' ? 3 : $maxOrder;
    $pack = String($pack) == 'undefined' ? true : $pack;
    $percision = __php2js_clone_argument__($percision);
    $maxOrder = __php2js_clone_argument__($maxOrder);
    $pack = __php2js_clone_argument__($pack);
    $n = __php2js_clone_argument__($n);
    
    return this.getHumanValue($n,
		['b', 'KB', 'MB', 'GB', 'TB'],
		1024,
		$percision,
		$maxOrder,
		$pack
    );
}



ListRenderer.prototype.getHumanValue = function($n, $units, $divider, $percision, $maxOrder, $pack) {
    var $unitIterator, $r, $a, $int, $add, $buf, $unitsSz, $s;
    $divider = String($divider) == 'undefined' ? 1000 : $divider;
    $percision = String($percision) == 'undefined' ? 3 : $percision;
    $maxOrder = String($maxOrder) == 'undefined' ? 3 : $maxOrder;
    $pack = String($pack) == 'undefined' ? true : $pack;
    $divider = __php2js_clone_argument__($divider);
    $percision = __php2js_clone_argument__($percision);
    $maxOrder = __php2js_clone_argument__($maxOrder);
    $pack = __php2js_clone_argument__($pack);
    $n = __php2js_clone_argument__($n);
    $units = __php2js_clone_argument__($units);
    
    $unitIterator = 0;
    $r = strval($n) + ' ' + L($units[$unitIterator]);
    if ($pack) {
        $a = explode('.', $r);
        $int = $a[0];
        $add = $a[1] ? $a[1] : '';
        $buf = [];
        $buf.push(dechex($int));
        if ($add) {
            $buf.push(dechex($add));
        }
        $buf.push(L($units[$unitIterator]));
        $r = implode('g', $buf);
    }
    
    
    $unitsSz = count($units);
    do {
        $n = round($n, $percision);
        $s = strval($n);
        $a = explode('.', $s);
        $int = $a[0];
        $add = $a[1] ? $a[1] : '';
        if (strlen($int) <= $maxOrder || $unitIterator > ($unitsSz - 1) ) {
            if ($pack) {
                $buf = [];
                $buf.push(dechex($int));
                if ($add) {
                    $buf.push(dechex($add));
                }
                $buf.push(L($units[$unitIterator]));
                return implode('g', $buf);
            }
            return str_replace('.', ',', $s) + ' ' + L($units[$unitIterator]);
        }
        $n = $n / $divider;
        $unitIterator++;
    } while(true);
    
    return str_replace('.', ',', String($r));
}



