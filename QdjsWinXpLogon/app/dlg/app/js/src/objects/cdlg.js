function CDlg() {
	var k, notes, sets, note, o = this;
	this.className = 'CDlg';
	
	
	function getNotes(){
		return W.mls;
	}
	function getOldestNote(notes, sets){
		var i, z, b = [], q = [], LIM = 2; // TODO 10
		for (i in sets) {
			b.push({i:i, t:sets[i]});
		}
		b.sort(function(a, c){
			if (a.t > c.t) {
				return 1;
			}
			return -1;
		});
		for (i = 0; i < LIM; i++) {
			q.push(b[i].i);
		}
		shuffle(q);
		i = q.pop();
		return {s:notes[i], i:i};
	}
	
	function getUnshownNote(notes, sets) {
		var i, z, b = [];
		z = sz(notes);
		for (i = 0; i < z; i++) {
			if (!sets[i]) {
				b.push(notes[i]);
			}
		}
		if (sz(b)) {
			if (sz(b) > 1) {
				shuffle(b);
			}
			i = b.pop();
			z = array_search(i, notes);
			return {s:i, i:z};
		}
		return null;
	}
	
	function setLst(){
		e('bOk').onclick = onClickOk;
	}
	
	function onClickOk(){
		App.quit();
	}
	
	//constructor
	var key;
	setLst();
	key = 'sets11';
	try {
		notes = getNotes();
		sets = storage(key) || {};
		note = getUnshownNote(notes, sets);
		if (!note) {
			note = getOldestNote(notes, sets);
		}
		
		v("m", note.s);
		sets[note.i] = time();
		storage(key, sets);
	} catch(err) {
		alert(err);
	}
}

