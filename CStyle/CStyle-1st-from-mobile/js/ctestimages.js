function CTestImages() {
    this.init()
   }
var P = CTestImages.prototype;
   P.init = function() {
   try{
     puts( PHPrand(5 , 10) );
   }catch(err){
     showError(err, "Error");
   }
   
    
	
	
     this.setLst() 
     let src =  this.base64(App.dir() + '/logo.png');
  
    attr( 'tImage', 'src', "data:image/png;base64, " + src); 
  
    showError(FS.readfile("test.txt", 'Info'));
    showError( navigator. userAgent, "inf")
    FS.writefile("test.txt", String(time()));
  }

P.base64 = function(s){
  var s = Env._exec("base64 " + s);
  return s[1];
}

P.setLst = function(){
  var o = this;
  e('bQuit').onclick = function(){
    App.quit() 
  }; 
}