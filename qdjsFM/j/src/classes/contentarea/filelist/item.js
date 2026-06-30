function createItem(s, currentPath) {
	var item = {
			name: '',
			sz:'',
			rsz:0,
			type:'',
			o:'',
			g:'',
			mt:'',
			nSubdirs: 0,
			i:'',
			src: s,
			perms: ''
		},
		i, buf, a, typeData;
	a = s.split("\n");
	if (sz(a) > 2) {
		s = a[1];
	}
	buf = s.split('->');
	a = buf[0].split(/\s+/);
	if (sz(a) < 9) {
		return;
	}
	item.name = a.slice(8).join(' ').replace(/^'/, '').replace(/'$/, '');
	item.name = item.name.trim();
	
	item.rsz = a[4];
	if (a[0][0] == 'd') {
		item.type = L('Catalog');
		item.i = App.dir() + '/i/folder32.png';
		item.cmId = 'cmCatalog';
	} else {
		typeData = Types.get(currentPath + '/' + item.name);
		item.type = typeData.t;
		item.i = typeData.i;
		item.cmId = typeData.c;
	}
	
	item.sz = (app.devicesManager ? app.devicesManager.pluralizeSize(item.rsz, 1) : '0');
	
	item.o = a[2];
	item.g = a[3];
	item.perms = a[0].trim();
	
	
	item.mt = a[5] + ' ' + a[6].split('.')[0];
	item.nSubdirs = a[1] - 2;
	
	return item;
}
