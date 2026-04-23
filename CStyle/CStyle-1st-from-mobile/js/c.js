function malloc(){}

function printf(){
  var s = sprintf.apply(window, arguments);
  puts(s);
}

function puts(s){
  showError(s);
}


window.RAND_MAX= 2147483647;
function rand(){
  var w = window, mx = w.__max_rnd__ ? w.__max_rnd__ : w.RAND_MAX;
  
  return JPHPrand(0, mx);
}

function srand(b){
  window.__max_rnd__ = b;
}

function strlen(s){
  return s.length;
}

function strcpy(a, b){
  a = b;
  return a;
}

function strcmp(s, q){
  if(s === q){
    return 0;
  }
  
  if(s < q){
    return -1;
  }
  
  if(s > q){
    return 1;
  }
}
