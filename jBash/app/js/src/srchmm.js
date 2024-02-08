function smmOnClick(evt){
  if(w.ival){
    return;
  }
  if(w.isOpen){
    w.isOpen = 0;
    smmInit();
    return;
  }
  w.smmSt = 0;
  w.dec  = 25;
  w.ival = setInterval(smmOnVTick, 100);
}

function smmOnVTick(){
     var k = 41, st = w.smmSt, im = '', px = 'px' + im, h = 'height',
     bclr = '4px solid  #c0c0c0' + im,
     wId = 'hSearchWrap';
     
     stl('iSearch', 'border', bclr);
     stl('iSearch', 'opacity', 1);
     
     if(st < k){
       st += w.dec;
       w.dec -= 1;
       if(w.dec < 0){
         w.dec = 4;
       }
       stl(wId, h, st + px);
       stl('iSearch', h, st + px);
       w.smmSt = st;
       return;
     } 
     
     clearInterval(w.ival);
     stl(wId, h, (k - 1) + px);
     stl('iSearch', h, (k - 1) + px);
     w.ival = 0;
     w.isOpen = 1;
     
     /*w.ival = setInterval(smmOnHTick, 100);
     w.smmSt = 0;*/
}

function smmInit(){
     var k = 1,  im = '', px = 'px' + im,h = 'height',
     bclr = 'none' + im,
     wId = 'hSearchWrap';
     
     stl(wId, h, (k - 1) + px);
     stl('iSearch', h, (k - 1) +px);
     stl('iSearch', 'border', bclr);
     stl('iSearch', 'opacity', 0);
}
