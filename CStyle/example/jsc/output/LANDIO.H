#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef unsigned long ULONG;
typedef unsigned int UINT;
typedef char BOOL;
#define true 1
#define false 0

int writefile(char* filename, char* s, BOOL isAppend);
char* readfile(char *filename);
