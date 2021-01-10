function extend(parentClass, childClass){
	a = parentClass;
	b = childClass;
	var c=new Function();
	c.prototype=a.prototype;
	b.prototype=new c();
	b.prototype.constructor=b;
	b.superclass=a.prototype;
	b.superclass.__construct = a;
}
