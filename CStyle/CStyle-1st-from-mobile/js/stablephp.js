function strlen(s){
  return s.length;
}

function push(a, s){
  a.push(s);
  return a;
} 

function addstr(s, q){
  return s + q;
}

function addchar(s, c){
  return s + c;
}

function explode(sep, s, oL) {
	var i, j = 0;
  var ch;
	var slen = strlen(s), sslen = strlen(sep);
	var res = [];
	var buf = "";	
	var buf2 = "";
	var L = 0;
	buf = "";
	for (i = 0; i < slen; i++) {
		ch = s[i];
		
		if (ch == sep[j]) {
			++j;
			if (j >= sslen) {
				res = push(res, buf, L);
				j = 0;
				buf = "";
				buf2 = "";
				L++;
			} else {
			  buf2 = addchar(buf2, ch);
			}
		} else {
		  if( strlen(buf2)  > 0){
		    buf = addstr(buf, buf2); 
		    buf2 = "";
		  }
			buf = addchar(buf, ch);
			j = 0;
		}
	}
	
	res = push(res, buf, L); 
	L++;
	
	//*length = L;
  oL.v= L;
	return res;
}

/*tULONGt*/ function PHPrand(/*tULONGt*/ mn, /*tULONGt*/ mx){
  var ULONG, rnd;
  srand(time());
  rnd = rand();
  rnd = rnd % mx;
  if(rnd < mn){
    rnd += mn;
  }
  
  return rnd;
}