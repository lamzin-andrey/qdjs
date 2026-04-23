#include "landio.h"
#include <time.h>

#define FILE_APPEND 8

// PHP
char* date(char* fmt);
char* datets(char* fmt, ULONG ts);
char** explode(char* sep, char* s, int* length);
BOOL file_exists(char* filename);
char* file_get_contents(char* file);
int file_put_contents(char* file, char* data);
int file_put_contentsa(char* file, char* data, int mode);
// char* PHPfgets(int fd, ULONG size);
char** push(char** arr, char* s, int L);
char** pushs(char** arr, char* s, int L);
void print_r(char** a, int L);
char* str_replacec(char* search, char* replace, char* subject, int* count);
char* str_replace(char* search, char* replace, char* subject);
char* strval(int n);
//return -1 if not found
long strposo(char* haystack, char* needle, ULONG offset);
long strpos(char* haystack, char* needle);


// utils
char* addchar(char* s, char ch);
char* addstr(char* s, char* s2);
void intToStr(int n, char* sL, BOOL newLine);
void logInt(char* file, char* prefix, int n);
void logFloat(char* file, char* prefix, double n);
void logStr(char* file, char* prefix, char* str);
