#include "dphpc.h"

int test(char* s, int &length) {
	char ch = '*';
	s = addstr(s, ch);
	 *length = strlen(s); 

	return 0;
}

int  main() {
	char* s = "Hello ";
	int L;
	test(s, &L);
	printf(s);
	printf("L = %d", L);
	return 0;
}
