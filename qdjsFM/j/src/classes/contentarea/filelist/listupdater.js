function ListUpdater(tab) {
	this.tab = tab;
	this.newList = [];
	this.iterator = 0;
	this.sz = 0;
	this.filesSize = 0;
	this.part = 100;
	this.isRun = false;
	this.isPause = false;
	this.isRenderProcess = false;
}
ListUpdater.prototype.run = function(){
	var o = this;
	if (this.getListIval) {
		clearInterval(this.getListIval);
		this.getListIval = 0;
	}
	/* TODO getHiddenListIval*0
	if (this.getHiddenListIval) {
		clearInterval(this.getHiddenListIval);
		this.getHiddenListIval = 0;
	}*/
	if (this.renderProcessIval) {
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
	}
	this.isRenderProcess = false;
	
	
	this.getListIval = setInterval(function(){
		if (o.isPause || !o.isRun || o.isRenderProcess) {
			return;
		}
		o.onListTick();
		// TODO o.onHiddenListTick()*0;
	}, 1 * 1000);
	FS.startWatchDir();
	this.isRun = true;
}
ListUpdater.prototype.pause = function(){
	this.isPause = true;
}
ListUpdater.prototype._continue = function() {
	this.isPause = false;
}
ListUpdater.prototype.stop = function(){
	this.isRun = false;
	this.isPause = false;
	if (this.getListIval) {
		clearInterval(this.getListIval);
		this.getListIval = 0;
	}
	if (this.getHiddenListIval) {
		clearInterval(this.getHiddenListIval);
		this.getHiddenListIval = 0;
	}
	if (this.renderProcessIval) {
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
	}
	this.newList = [];
	this.iterator = 0;
	this.sz = 0;
	this.filesSize = 0;
}

ListUpdater.prototype.processInotifyOutput = function(inout){
	var i, SZ = sz(inout), s,
		createList = [],
		deletedList = [],
		modifyList = [],
		firstRenderId;
	for (i = 0; i < SZ; i++) {
		s = ls[i];
		if ('c' == s[0]) {
			createList.push(s);
		}
		if ('d' == s[0]) {
			deletedList.push(s.substring(2));
		}
		if ('m' == s[0]) {
			modifyList.push(s.substring(2));
		}
	}
	firstRenderId = this.inotifyProcessDelete();
	createList = this.inotifyProcessCreate(createList, firstRenderId);
	modifyList = this.inotifyProcessModify(modifyList, firstRenderId);
	this.getFilesDataForRender(array_merge(createList, modifyList)); // TODO req -> resp -> render
}
/**
 * Удаляет из list и вычисляет, с какого элемента теперь начинать рендеринг
*/
ListUpdater.prototype.inotifyProcessDelete = function(deletedList){
	var startN = this.tab.getFirstItemId(), // TODO (2) late try use renderer lastEl firstEl 
		N = this.tab.listRenderer.part,
		i, SZ = sz(this.tab.list),
		hash = In(deletedList),
		rml = [];
	// Если удаляются элементы, расположенные над startN это само по себе ни на что не влияет.
	// Если после удаления элементов в списке становится меньше, чем startN + N,
	// мы должны начать рендерить с sz() - N.
	if (SZ - sz(deletedList) < startN + N) {
		startN = ( SZ - sz(deletedList) ) - N;
		if (startN < 0) {
			startN = 0;
		}
	}
	
	for (i = 0; i < SZ; i++) {
		if (hash[this.tab.list[i].name]) {
			rml.push(i);
		}
	}
	SZ = sz(rml);
	for (i = SZ - 1; i > -1; i--) {
		this.tab.list.splice(rml[i], 1);
	}
	
	return startN;
}

ListUpdater.prototype.inotifyProcessModify = function(modifyList, firstRenderId) {
	var i, SZ = sz(this.tab.list), s, 
		vpList = {},
		N = this.tab.listRenderer.part,
		startN = this.tab.toI(firstRenderId), 
		endN = firstRenderId + N,
		hash = In(modifyList);
	for (i = 0; i < SZ; i++) {
		if (hash[this.tab.list[i].name]) {
			if (i >= startN && i <= endN) {
				vpList["f" + i] = s;
			}
		}
	} // end for
	
	return vpList;
}

// firstRenderId support!
ListUpdater.prototype.inotifyProcessCreate = function(createList, firstRenderId) {
	var i, SZ = sz(createList), s, 
		vpList = {},
		N = this.tab.listRenderer.part,
		startN = this.tab.toI(firstRenderId), 
		endN = firstRenderId + N,
		cI, type;
	for (i = 0; i < SZ; i++) {
		s = createList[i];
		type = s[1];
		s = s.substring(2);
		// create
		// 0 Вставляем  с учетом текущей сортировки.
		cI = this.insertInListWithCurrentSort(s, type);
		// 1 Ищем, где он создан. До или после первого отображённого
		//   Если до, не рисуем. Кажется, это более удобно пользователю. -- надо будет перерисовать от N-1 до szList где N это первый отображенный элемент
		//   Если после первого и до последнего, рисуем от N до szList
		//   Если после последнего, не рисуем
		// Здесь 1 - это переменная, которой
		if (cI >= startN && cI <= endN) {
			vpList["f" + cI] = s;
		}
	} // end for
	return vpList;
}

// TODO ls req -> resp -> render
/**
 * @param {Object} list не только потому, что это результат array_merge но и потому, что надо сохранить реальные позиции
*/
ListUpdater.prototype.getFilesDataForRender = function(list){
	var i;
	if (count(list) == 0) {
		return;
	}
	// индексы из list сохранить инвертировав ключи и имена
	// Запросить переданные файлы  ls -lh --full-time
    // Из результатов создать объекты, найдя по имени индекс, обновить его в Tab.list
    
}

ListUpdater.prototype.insertInListWithCurrentSort = function(s, type){
	var sort = this.tab.sort,
		list = this.tab.list,
		SZ = sz(list),
		i,
		item = this.tab.createEmptyItemByName(s, type),
		pos;
	// пока использую sort.apply, но возможно здесь есть пространство для оптимизации
	this.tab.list.push(item);
	pos = this.tab.rebuildList("list", s);
	if (-1 == pos) {
		for (i = 0; i < SZ; i++) {
			if (this.tab.list[i].name == s) {
				pos = i;
			}
		}
	}
	
	return pos;
}

ListUpdater.prototype.onListTick = function(){
	var o = this, inout, displayedList, currPath;
	if (
			o.isPause 
			|| !o.isRun 
			|| o.isRenderProcess
			|| 1 === intval(Settings.get('hMode'))
		) {
		return;
	}
	this.sz = 0;
	inout = FS.getModifyListInDir();
	if (sz(inout)) {
		this.processInotifyOutput(inout);// TODO
	}
	// TODO всё, что ниже кажется должно вызываться после того, как перерендерен iNotify
	// FALSE:  или даже перед ним, так как если ниже предполагается весь лист перерисовать,
	// толку от iNotify мало. Это последнее TODO - неверное. Надо искать dList после обработки удаления iNotify! (в больших каталогах.)
	
	// TODO process dispalayed
	
	// Важняк: получать список файлов теперь будем так:
	// ls -lh --full-time -i 00000.txt - 
	// Тогда первым будет выводиться inode
	
	// Ну, а получить новое имя файла можно 
	// cd tab.currentPath && find -inum 7477952
	// > ./00000.txt
	// правда по одному надо будет телепаться.
	
	
	displayedList = this.getDisplayedList(); // TODO return HTML elements
	for (i = 0; i < sz(displayedList); i++) {
		currPath = this.getPathFromEl(displayedList[i]); // TODO
		this.checkExists(currPath);// TODO если не найден, запускает процесс перерисовки листа
		// TODO учесть filesSize
		// TODO renderPart скорее всего в утиль
	}
	
	// old перечитать ещё раз с целью понять, что забыто
	/*o.isRenderProcess = true;
	this.newList = this.tab.buildList(lsout, true);
	this.iterator = 0;
	this.sz = sz(this.newList);
	this.filesSize = 0;
	this.renderProcessIval = setInterval(function(){
		try {
			o.renderPart();
		} catch (err) {
			alert('ListUpdater.onListTick: ' + err);
		}
	}, 200);*/
}

ListUpdater.prototype.renderPart = function(){
	var start = this.iterator,
		end = this.iterator + this.part, i,
		newItem, block, s, oldItem, nextNewItem,
		done = false,
		o, self = this,
		statusText, freeSpaceText = '', sizeText = '',
		cmId, createdItemFound = -1, newFoundedActiveItem;
	if (end >= this.sz) {
		done = true;
		end = this.sz;
	}
	o = this.tab; // context is tab
	for (i = start; i < end; i++) {
		if (
			this.isPause 
			|| !this.isRun 
		) {
			return;
		}
		newItem = this.newList[i];
		oldItem = this.tab.list[i];
		// Если существует такой индекс в старом листе
		//  Если текст нового свойства не равен
		//   переписать текущее
		// Иначе (если не существует)
		// Создать свойство и добавить его в конец.
		this.filesSize += this.tab.listRenderer.incSize(newItem.sz);
		if (newItem.name == app.tab.createdItemName) {
			createdItemFound = i;
		}
		if (oldItem) {
			if (oldItem.src == newItem.src && oldItem.sz == newItem.sz) {
				this.iterator++;
				continue;
			}
			this.updateItem(i, newItem);
		} else {
			this.appendNew(i, newItem);
		}
		
		this.iterator++;
		
	}
	
	if (createdItemFound > -1) {
		app.tab.selectItemByIdx(createdItemFound);
	}
	if (done) {
		this.isRenderProcess = false;
		clearInterval(this.renderProcessIval);
		this.renderProcessIval = 0;
		this.cutTail();
		
		freeSpaceText = app.devicesManager.getPluralFreeSpaceOfDiskPartByPath(this.tab.currentPath);
		if (freeSpaceText) {
			freeSpaceText = ', ' + freeSpaceText;
		}
		statusText = this.sz + ' ' 
						+ TextTransform.pluralize(this.sz, L('Objects'), L('Objects-voice1'), L('Objects-voice2'))
						+ ' (' + this.tab.listRenderer.getHumanFilesize(intval(this.filesSize), 2, 3, false) + ')'
						+ freeSpaceText;
		if (0 == count(this.tab.oSelectionItems)) {
			this.tab.setStatus.call(this.tab, statusText);
		}
	}
}

ListUpdater.prototype.updateItem = function(i, newItem) {
	/*if (this.nameExists(newItem, sz(this.tab.list))) {
		return;
	}*/
	var t;
	
	if (newItem.type == L('Catalog')) {
		newItem.rsz = this.calculateSubdirSz(newItem.name, newItem.rsz);
		newItem.sz = this.tab.listRenderer.getHumanFilesize(newItem.rsz, 1, 3, false);
		t = newItem.rsz;
		if (newItem.sz == 'NaN Байт') {
			newItem.sz = t;
		} else {
			// newItem.rsz = newItem.sz;
		}
	}
	
	this.tab.listRenderer.updateItem(i, newItem);
	this.tab.list[i] = newItem;
	if (1 === intval(Settings.get('hMode'))) {
		this.tab.hideList[i] = newItem;
	} else {
		this.tab.showList[i] = newItem;
	}
}

ListUpdater.prototype.appendNew = function(i, newItem) {
	// this.tab.listRenderer.appendNew(i, newItem);
	var needAppend = 0, oldSz = sz(this.tab.list),
		isNameExists = this.nameExists(newItem, oldSz);
	if (isNameExists) {
		return;
	}
	if (newItem.type == L('Catalog')) {
		newItem.rsz = this.calculateSubdirSz(newItem.name, newItem.rsz);
		newItem.sz = this.tab.listRenderer.getHumanFilesize(newItem.rsz, 1, 3, false);
	}
	if (!isNameExists) {
		needAppend = 1;
		this.tab.list.push(newItem);
		if (1 === intval(Settings.get('hMode'))) {
			this.tab.hideList.push(newItem);
		} else {
			this.tab.showList.push(newItem);
		}
	}
	
	this.tab.listRenderer.calculatePart();
	if ((oldSz == 0 || i < this.tab.listRenderer.part)) {
		if (needAppend) {
			this.tab.listRenderer.appendNew(i, newItem);
		}
	} else if ((i - 1) == intval(this.tab.getLastItemId().replace('f', ''))) {
		this.tab.listRenderer.shiftDown(newItem, i);
	}
	
}


ListUpdater.prototype.calculateSubdirSz = function(shortName, defaultSize) {
	if (shortName == '.' || shortName == '..') {
		return defaultSize;
	}
	var 
		// file = this.tab.currentPath + '/' + shortName + '/.qdjssz', 
		file = this.getDirParamPath(this.tab.currentPath + '/' + shortName) + "/sz", 
		o = this;
	if (FS.fileExists(file)) {
		return intval(FS.readfile(file));
	}
	setTimeout(function(){
		o.calculateSize(o.tab.currentPath + '/' + shortName);
	}, 10);
	return defaultSize;
}

ListUpdater.prototype.calculateSize = function(path) {
	var cmd = "#!/bin/bash\n", slot = App.dir() + "/sh/o.sh";
	// cmd += "du -bs " + path + " > " + path + "/.qdjssz";
	cmd += "du -bs " + path + " > " + this.getDirParamPath(path) + "/sz";
	if (!FS.fileExists(this.getDirParamPath(path))) {
		FS.mkdir(this.getDirParamPath(path));
	}
	FS.writefile(slot, cmd);
	jexec(slot, DevNull, DevNull, DevNull);
}

ListUpdater.prototype.removeSizeFile = function(dir) {
	var sizeFile = this.getDirParamPath(dir) + "/sz";
	if (FS.fileExists(sizeFile)) {
		FS.unlink(sizeFile);
	}
}
ListUpdater.prototype.getDirParamPath = function(dir) {
	var h = FS.md5(dir),
		sub = h.substring(0, 5);
	return App.dir() + "/var/" + sub + "/" + h;
}


ListUpdater.prototype.cutTail = function() {
	var SZ = sz(this.tab.list), cBreak = 0, node;
	while (SZ > this.sz) {
		rm('f' + (SZ - 1));
		/*node = e('f' + (SZ - 1));
		if (node) {
			node.removeAttribute('id');
			stl(node, 'display', 'none');
		}*/
		this.tab.list.splice(SZ - 1, 1);
		// TODO remove me!
		cBreak++;
		if (cBreak > 500) {
			break;
		}
		SZ = sz(this.tab.list);
	}
}

ListUpdater.prototype.nameExists = function(newItem, _sz) {
	var i;
	for (i = 0; i < _sz; i++) {
		if (this.tab.list[i] && newItem.name == this.tab.list[i].name) {
			
			return true;
		}
	}
}
