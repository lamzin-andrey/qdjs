var D = document,
W = window, S = String;
function e(i) {
	if (i && i.tagName || D == i) return i;
	return D.getElementById(i);
}
W.micron$ = e;
function ee(p, c) {
	p = e(p);
	return p.getElementsByTagName(c);
}
W.micron$$ = ee;
function cs(p, c) {
	p = e(p);
	if (p.getElementsByClassName) {
		return p.getElementsByClassName(c);
	}
	return [];
}
function hasClass(obj, css) {
	var obj = e(obj);
	var c = obj.className, _css = css.replace(/\-/g, "\\-"), 
	re1 = new RegExp("^\\s?" + _css + "\\s*"), 
	re2 = new RegExp("\\s+" + _css + "(\\s+[\\w\\s]*|\\s*)$");
	if (c == css || re1.test(c) || re2.test(c)) {
		return true;
	} 
	return false;
}
function removeClass(obj, css) {
	obj = e(obj);
	var c = obj.className, re = /[0-9a-zA-Z\-_]+/gm,
	arr = c.match(re),
	i, result = [];
	if (arr) for (i = 0; i < arr.length; i++) {
		if (arr[i] !== css) {
			result.push(arr[i]);
		}
	}
	obj.className = result.join(' ');
}
function addClass(obj, css) {
	obj = e(obj);
	removeClass(obj, css);
	obj.className += ' ' + css;
}
//getviewport
function getViewport() {
	var w = W.innerWidth, h = W.innerHeight;
	if (!w && D.documentElement && D.documentElement.clientWidth) {
		w = D.documentElement.clientWidth;
	} else if (!w) {
		w = D.getElementsByTagName('body')[0].clientWidth;
	}
	if (!h && D.documentElement && D.documentElement.clientHeight) {
		h = D.documentElement.clientHeight;
	} else if (!h) {
		h = D.getElementsByTagName('body')[0].clientHeight;
	}
	return {w:w, h:h};
}
function appendChild(parent, tag, innerHTML, obj, dataObj) {
	var E = D.createElement(tag), i;
	if (obj) {
		for (i in obj) {
			if (obj[i] instanceof Function) {
				E[i] =  obj[i];
			} else {
				E.setAttribute(i, obj[i]);
			}
		}
	}
	if (dataObj) {
		for (i in dataObj) {
			E.setAttribute('data-' + i, dataObj[i]);
		}
	}
	E.innerHTML = innerHTML;
	e(parent).appendChild(E);
	return E;
}
function sz(a) {
	return a.length;
}
function attr(o, name, val) {
	o = e(o);
	if (val) {
		o.setAttribute(name, val);
	}
	if (o.hasAttribute(name)) {
		return o.getAttribute(name);
	}
	return null;
}
function stl(o, s, v) {
	o = e(o);
	o.style[s] = v;
}
function show(o, v) {
	v = v ? v : 'block';
	stl(o, 'display', v);
}
function hide(o) {
	stl(o, 'display', 'none');
}
function trim(s) {
	s = S(s).replace(/^\s+/mig, '');
	s = S(s).replace(/\s+$/mig, '');
	return s;
}
function In(a) {
	var i, o = {};
	if (a instanceof Array) {
		for (i = 0; i < sz(a); i++) {
			o[a[i]] = 1;
		}
	} else if (a instanceof Object) {
		for (i in a) {
			o[a[i]] = 1;
		}
	} else {
		for (i = 0; i < sz(arguments); i++) {
			o[arguments[i]] = 1;
		}
	}
	return o;
}
