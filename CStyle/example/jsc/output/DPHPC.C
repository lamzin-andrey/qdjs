#include "dphpc.h"

BOOL file_exists(char* filename) {
  /*FILE* f = fopen(filename, "r");
  if (!f) {
    return false;
  }
  fclose(f);
  return true;*/

  ksys_time_t t;
  t.hour = 10;
  t.min = 10;
  t.sec = 10;
  t._zero = 0;

  /*typedef union {
    uint32_t val;
    struct {
        uint8_t year;
        uint8_t month;
        uint8_t day;
        uint8_t _zero;
    };
  } ksys_date_t;*/

  ksys_date_t d;
  d.year = 2000;
  d.month = 1;
  d.day = 1;
  d._zero = 0;


  /*typedef struct {
    uint32_t attributes;
    uint32_t name_cp;
    ksys_time_t creation_time;
    ksys_date_t creation_date;
    ksys_time_t last_access_time;
    ksys_date_t last_access_date;
    ksys_time_t last_modification_time;
    ksys_date_t last_modification_date;
    uint64_t size;
    char name[0];
  } ksys_bdfe_t;*/



  ksys_bdfe_t bdfe;
  /*bdfe.attributes = 0; // Ш
  bdfe.name_cp = 0;    // Ш
  //bdfe.name = '1';    // Ш
  bdfe.creation_time = t;
  bdfe.creation_date = d;
  bdfe.last_access_time = t;
  bdfe.last_access_date = d;
  bdfe.last_modification_date = d;
  bdfe.last_modification_time = t;*/

  int status = _ksys_file_info(filename, &bdfe);

  // printf("status = %d", status);
  return status != 5; // ≈сли файла нет вернет 5, если есть 0
}

char* addchar(char* s, char ch) {
	char *r = NULL;
	char ns[2];
	ns[0] = ch;
	ns[1] = 0;
	int nsz = strlen(s) + 2;
	r = malloc(nsz);
	strcpy(r, s);
	strcat(r, ns);

	return r;
}

char* addstr(char* s, char* s2) {
	char *r = NULL;
	int nsz = strlen(s) + strlen(s2) + 2;
	r = malloc(nsz);
	strcpy(r, s);
	strcat(r, s2);

	return r;
}

char* date(char* fmt) {
	return datets(fmt, 0);
}

char* datets(char* fmt, ULONG ts) {
	time_t t;
	struct tm* now;

	if (0 == ts) {
		t = time(0);   // get time now
		now = localtime(&t);
	} else {
		const time_t rawtime = (const time_t)ts;
		now = localtime(&rawtime);
	}

	char* o = "HelloworldHelloWorld";
	char* sY = "0123";
	sY = "";
	o = "";
	for (int i = 0; i < strlen(fmt); i++) {
		char c = fmt[i];
		switch (c) {
			case 'Y':
				sY = strval(now->tm_year + 1900);
				o = addstr(o, sY); // TODO
				break;
			case 'm':
				sY = strval(now->tm_mon + 1);
				if (now->tm_mon < 10) {
					sY = addstr("0", sY);
				}
				o = addstr(o, sY);
				break;
			case 'd':
				sY = strval(now->tm_mday);
				if (now->tm_mday < 10) {
					sY = addstr("0", sY);
				}
				o = addstr(o, sY);
				break;
			case 'H':
				sY = strval(now->tm_hour);
				if (now->tm_hour < 10) {
					sY = addstr("0", sY);
				}
				o = addstr(o, sY);
				break;
			case 'i':
				sY = strval(now->tm_min);
				if (now->tm_min < 10) {
					sY = addstr("0", sY);
				}
				o = addstr(o, sY);
				break;
			case 's':
				sY = strval(now->tm_sec);
				if (now->tm_sec < 10) {
					sY = addstr("0", sY);
				}
				o = addstr(o, sY);
				break;
			default:
				o = addchar(o, c);
		}
	}

	return o;
}

void logInt(char* file, char* prefix, int n) {
	char sl[255];
	for (int i = 0; i < 255; i++) {
		sl[i] = 0;
	}
	intToStr(n, sl, true);
	writefile(file, prefix, true);
	writefile(file, sl, true);
}

void logFloat(char* file, char* prefix, double n) {
	char sl[255];
	for (int i = 0; i < 255; i++) {
		sl[i] = 0;
	}
	//intToStr(n, sl, true);
	sprintf(sl, "%f", n);
	ULONG sz = strlen(sl);
	if (sz < 255) {
		sl[sz] = '\n';
	}

	writefile(file, prefix, true);
	writefile(file, sl, true);
}

void logStr(char* file, char* prefix, char* str) {
	char* r = malloc(strlen(prefix) + strlen(str) + 1);
	r = addstr(r, prefix);
	r = addstr(r, str);
	r = addchar(r, '\n');

	writefile(file, r, true);
}


void intToStr(int n, char* sL, BOOL newLine) {
	sprintf(sL, "%d", n);
	ULONG sz = strlen(sL);
	if (sz < 255 && newLine) {
		sL[sz] = '\n';
	}
}


char** explode(char* sep, char* s, int* length) {
	int i, j = 0;
	char ch;
	int slen = strlen(s), sslen = strlen(sep);
	char** res;
	char* buf = "";
	char* buf2 = "";

	int L = 0;
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

	*length = L;
	return res;
}


char* file_get_contents(char* file) {
	return readfile(file);
}

int file_put_contents(char* file, char* data) {
	return writefile(file, data, false);
}

int file_put_contentsa(char* file, char* data, int mode) {
	if (FILE_APPEND == mode) {
		if (file_exists(file)) {
			return writefile(file, data, true);
		}
	}

	return writefile(file, data, false);
}

void print_r(char** a, int L) {
	for (int i = 0; i < L; i++) {
		printf("%s\n", a[i]);
	}
}


char** push(char** r, char* s, int L) {
	char **result = NULL;
	int i = 0, j = 0;
	unsigned int ssz = 0;
	for (i = 0; i < L; i++) {
		ssz += strlen(r[i]) + 1;
	}
	ssz += strlen(s) + 1;

	result = malloc(2 * ssz);

	for (j = 0; j < L; j++) {
		result[j] = r[j];
	}


	result[j] = s;
	return result;
}

char** pushs(char** r, char* s, int L) {
	return push(r, s, L);
}

char* str_replace(char* search, char* replace, char* subject) {
	int count = -1;
	return str_replacec(search, replace, subject, &count);
}

char* str_replacec(char* search, char* replace, char* subject, int* count) {
	*count = 0;
	int _count = 0;

	int i, sptr = 0;
	char* buf = "";
	char* result = "";
	char ch;
	for (i = 0; i < strlen(subject); i++) {
		ch = subject[i];
		if (ch != search[sptr]) {
			sptr = 0;
			if (strlen(buf)) {
				// result += buf;
				result = addstr(result, buf);
				buf = "";
				if (ch == search[0]) {
					// buf += ch;
					buf = addchar(buf, ch);
					sptr++;
					if (sptr > strlen(search) - 1) {
						// result += replace;
						result = addstr(result, replace);
						sptr = 0;
						buf = "";
						_count++;
					}
				} else {
					// result += ch;
					result = addchar(result, ch);
				}
			} else {
				// result += ch;
				result = addchar(result, ch);
			}
		} else {
			//buf += ch;
			buf = addchar(buf, ch);
			sptr++;
			if (sptr > strlen(search) - 1) {
				// result += replace;
				result = addstr(result, replace);
				sptr = 0;
				buf = "";
				_count++;
			}
		}
	}

	*count = _count;
	return result;
}

char* strval(int n) {
	char* result = NULL;
	result = malloc(255);
	intToStr(n, result, false);

	return result;
}

long strpos(char* haystack, char* needle) {
	return strposo(haystack, needle, 0);
}

long strposo(char* haystack, char* needle, ULONG offset) {
    //printf("hay = `%s`, nedle = `%s`, offset = `%ld`\n", haystack, needle, offset);
	ULONG i;
	ULONG j = 0;
	char ch;
	ULONG slen = strlen(haystack), sslen = strlen(needle);
	long res = -1;
	char* buf = "";

	char dCh[2];

	int L = 0;
	buf = "";
	for (i = offset; i < slen; i++) {
		ch = haystack[i];
		dCh[0] = ch;
		dCh[1] = '\0';
		//printf("process i = %d, dCh = `%s`\n", i, dCh);

		if (ch == needle[j]) {
			//puts("ch == needle[j]\n");
			if (j == 0) {
				res = (long)j;
			}
			++j;
			if (j >= sslen) {
				//puts("j >= sslen/в");
				return i;
			}
		} else {
			buf = addchar(buf, ch);
			j = 0;
			res = -1;
			//printf("res = -1, j = 0, mod buf: `%s`\n", buf);
		}
	}

	return res;
}
