/*tchar*t*/function test(/*tchar*t*/ s, /*tintt*/ /*&*/length) {
	var charz, ch = "*";
	s = addstr(s, ch);
	/*r *length = strlen(s); r*/
	length.v = strlen(s);
	return 0;
}

/*tintt*/ function main() {
	var charz, s = "Hello ";
	var int, L = {};
	s = test(s, L);
	print(s);
	print(L);
	return 0;
}
