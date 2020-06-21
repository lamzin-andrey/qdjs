#include "utilsstd.h"
//#include <windows.h>

void UtilsStd::Char(string s, char* &dest)
{
 dest = new char[s.length()];
 int i = 0;
 for (i = 0;  i < s.length(); i++) 	dest[i] = s[i]; 
 dest[i] = '\0';
}

string UtilsStd::concat(char* chars_1, char* chars, char* &dest)
{
	string r = "";
	//MessageBoxA(0, chars_1, "chars_1", 0);
	char* cache = new char[strlen(chars_1)];
	int i = 0;
	for (i = 0;  i < strlen(chars_1); i++) 	cache[i] = chars_1[i]; 
	cache[i] = '\0';
	//MessageBoxA(0, cache, "cache", 0);
	dest = "\0";
	dest = new char[strlen(cache) + strlen(chars)];
	
	for (int i = 0;  i < strlen(cache); i++) {
		dest[i] = cache[i]; 
		r += cache[i]; 
	}
	
	//MessageBoxA(0, dest, "dest(ch_1)", 0);
	
	int j = 0;
	for (i = strlen(cache), j = 0; j < strlen(chars); i++, j++)  {
		dest[i] = chars[j]; 
		r += chars[j];
	}
	dest[i] = '\0';
	//MessageBoxA(0, dest, "dest(out)", 0);
	return r;
}


string UtilsStd::concat(string str, char* chars, char* &dest)
{
	string r = "";
	dest = new char[strlen(chars) + str.length()];
	
	for (int i = 0;  i < str.length(); i++) {
		dest[i] = str[i]; 
		r += str[i]; 
	}
	
	for (int i = str.length(), j = 0; j < strlen(chars); i++, j++)  {
		dest[i] = chars[j]; 
		r += chars[j];
	}
	return r;
}

string UtilsStd::concat(char* chars, string str, char* &dest)
{
	string r = "";
	dest = new char[strlen(chars) + str.length()];
	for (int i = 0; i < strlen(chars); i++)  {
		dest[i] = chars[i]; 
		r += chars[i];
	}
	int j = strlen(chars);
	for (int i = 0; i < str.length(); i++, j++) {
		dest[j] = str[i]; 
		r += str[i]; ;
	}
	dest[j] = '\0';
	return r;
}

string UtilsStd::getFileDir(char* filepath, char* &directory)
{
  int i = 0;
  for (i = strlen(filepath); i > -1; i--)
  {
	if ((filepath[i] == '/')||(filepath[i] == '\\')) break;
  }
  string r = "";
  if (i > 0)
  {
		directory = new char[i];
		for (int j = 0; j < i; j++) directory[j] = filepath[j];
		r = directory;
  }
  return r;
}

string UtilsStd::getFileDir(string filepath, char* &directory)
{
  int i = 0;
  for (i = filepath.length(); i > -1; i--)
  {
	if ((filepath[i] == '/')||(filepath[i] == '\\')) break;
  }
  string r = "";
  if (i > 0)
  {
		directory = new char[i];
		for (int j = 0; j < i; j++) directory[j] = filepath[j];
		r = directory;
  }
  return r;
}

string UtilsStd::getShortFileName(char* longname, char* &shortname)
{
   int i = 0;
   for (i = strlen(longname); i > -1; i--)
   {
		if ((longname[i] == '/')||(longname[i] == '\\')) break;
   }
   string r = longname;
   if (i > 0)
   {
		shortname = new char[strlen(longname) - i];
		for (int j = i + 1, k = 0; j < strlen(longname); j++, k++) shortname[k] = longname[j];
		r = shortname;
   }
   return r;
}

string UtilsStd::getShortFileName(string longname, char* &shortname)
{
   int i = 0;
   for (i = longname.length(); i > -1; i--)
   {
		if ((longname[i] == '/')||(longname[i] == '\\')) break;
   }
   string r = longname;
   if (i > 0)
   {
		shortname = new char[longname.length() - i];
		for (int j = i + 1, k = 0; j < longname.length(); j++, k++) shortname[k] = longname[j];
		r = shortname;
   }
   return r;
}

int UtilsStd::pos(string substr, string s)
{
	bool f = false;
	int rez = -1;
	for (unsigned int i = 0; i < s.length(); i++)
		if (substr[0] == s[i])
		{
			f = true;
                        for (unsigned int j = 0; j < substr.length(); j++) {
                            if (s[i+j] != substr[j]) {
                                f = false;
                            }
                        }
			if (f) {rez = i; break;}
                }
	return rez;	
}
//-----------------------------------------------------------------------
string UtilsStd::intToStr(int x)
{
	string r = "";
	if (x == 0) return "0";
	if (x < 0) { r = "-"; x *= -1;}
	string inv = "";
	x *= 10;
	while (x != 0)
	{
		int y = (int)floor(x/10);
		int n = x - y*10;
		inv += rToStr(n);
		x = y;
	}
	string p = "";
	for (int i = inv.length() - 1; i > 0; i--)
		p += inv[i];
	r += p;
	if (pos("NaN", r) > -1 ) r = "NaN";
	return r;
}
//------------------------------------------------------------------
string UtilsStd::rToStr(int n)
{
	if (n == 0) return "0";
	if (n == 1) return "1";
	if (n == 2) return "2";
	if (n == 3) return "3";
	if (n == 4) return "4";
	if (n == 5) return "5";
	if (n == 6) return "6";
	if (n == 7) return "7";
	if (n == 8) return "8";
	if (n == 9) return "9";
	return "NaN";
}
//--------------------------------------------------------------------
string UtilsStd:: Delete(string s, unsigned int pos, unsigned int count)
{
	string t = "";
	for (unsigned int i = 0; i < s.length(); i++)
		if ((i >= pos + count)||(i < pos)) t += s[i];
	return t;
}
//--------------------------------------------------------------------
string UtilsStd::Insert(string s, string newStr, int pos)
{
	string t = "";
	for (int i = 0; i < pos; i++) t += s[i];
	t += newStr;
	for (unsigned int i = pos; i < s.length(); i++) t += s[i];
	return t;
}
//----------------------------------------
int UtilsStd::pos(char ch, string s)
{
	int res = -1;
	for (unsigned int i = 0; i < s.length(); i++)
		if (s[i] == ch) {res = i; break;}
	return res;
}
//--------------------------------------------------------------
int UtilsStd:: strToInt(string s)
{
	string num = "0123456789";
	int sign = 1;
	if (s[0] == '-') {Delete(s,0,1); sign = -1;}
	int res = 0;
	for (unsigned int i = 0;i < s.length(); i++)
	{
		if (pos(s[i], num) == -1) return 0;
		res = res*10 + chToR(s[i]);
	}
	return res*sign;
}
//---------------------------------------------------------------
int UtilsStd:: chToR(char ch)
{
	if (ch == '0') return 0;
	if (ch == '1') return 1;
	if (ch == '2') return 2;
	if (ch == '3') return 3;
	if (ch == '4') return 4;
	if (ch == '5') return 5;
	if (ch == '6') return 6;
	if (ch == '7') return 7;
	if (ch == '8') return 8;
	if (ch == '9') return 9;
	return 0;
}
//---------------------------------------------------------------
int UtilsStd:: chToR(string ch)
{
	if (ch == "0") return 0;
	if (ch == "1") return 1;
	if (ch == "2") return 2;
	if (ch == "3") return 3;
	if (ch == "4") return 4;
	if (ch == "5") return 5;
	if (ch == "6") return 6;
	if (ch == "7") return 7;
	if (ch == "8") return 8;
	if (ch == "9") return 9;
	return 0;
}
//-----------------------------------------------------------------
void UtilsStd:: deleteSpace(string &s)
{
	string r = "";
	for (unsigned int i = 0; i < s.length(); i++)
		if (s[i] != ' ') r += s[i];
	s = r;
}
//-----------------------------------------------------------------
string  UtilsStd :: intToStrBin(int i, int category)
{
	//cout << "intToBin" << '\n';
	string inv = "";
	string r = "";
	if (i == 0) 
	{
		for (int k = 0; k < category; k++) r += "0";
		return r ;
	}
	int x = i;
	while (x > 0)
	{
		int y = x % 2;
		inv += rToStr(y);
		x = x / 2;
		//cout << inv << '\n';
	}
	for (unsigned i = inv.length()-1; i > 0; --i)
		r += inv[i];
	r += inv[0];
	inv = "";
	for (unsigned k = 0; k < (category - r.length()); k++) inv += "0";
	r = inv + r; 
	//cout << " intToBin ret "<< r + "|" << '\n';
	return r;
}
//-------------------------------------------------------------------
void UtilsStd :: bSort(string & s )
{
	//cout << "befor sort "<< s + "|"<< '\n';
	for (unsigned i = 0; i < s.length(); i++)
		for (unsigned j = i; j < s.length(); j++)
		{
			if (s[i] >= s[j])
			{
				char bufI = s[i];
				char bufJ = s[j];
				s = Delete(s, i, 1);
				//cout << "delete s[i], s = " << s << '\n';
				string ts = ""; ts += bufJ;
				s = Insert(s, ts, i);
				//cout << "insert s[j], s = " << s << '\n';
				
				s = Delete(s, j, 1);
				//cout << "delete s[j], s = " << s << '\n';
				ts = ""; ts += bufI;
				//cout << "insert s[i], s = " << s << '\n';
				s = Insert(s, ts, j);				
			}
		}
			//cout << "post sort "<< s + "|"<< '\n';
}
//------------------------------------------------------------
string UtilsStd :: read(string filename, char stop)
{
	unsigned int i;
   string s = "";
   char* path = new char [filename.length()+1];
   for ( i = 0; i < filename.length(); i++)
	   path[i]= filename[i]; 
	   path[i] = '\0';
  ifstream t;
  t.open(path, ios:: in);
  
  string q = "";
  while ( std::getline(t, q ) ) {
	  s += q + "\n";
	  //for (int i = q.length(); i < 32000; i++) res[i] = '\0';
	  q = "";
  }
  t.close();
  
  if (s.length() > 0)
	s = s.substr(0, s.length() - 1);
  //cout <<"\nReport = '" << s<< "'\n";
  return s;
}
//-------------------------------------------------------
void UtilsStd :: write(string s, string filename)
{
  unsigned int i;
  char* path = new char [filename.length()+1];
  for ( i = 0; i < filename.length(); i++)
	   path[i]= filename[i]; 
           path[filename.length()] = '\0';

	  // cout << "path = "<< path <<'\n';

  char* Report = new char [s.length() + 1];
  for ( i = 0; i < s.length(); i++)
	  Report[i]= s[i];
          Report[s.length()] = '\0';

	  //cout << "s = "<< Report <<'\n';
//Вывод в файл
  ofstream t;
  t.open(path, ios:: out);
  t << Report;
  t.close();
}
//----------------------------------------------------------
unsigned long UtilsStd :: filesize(string file) {
        char* c_file = new char[file.length() + 1];
        Char(file, c_file);
        struct stat state;
        stat(c_file, &state);
        return (unsigned long)state.st_size;
}
//-----------------------------------------------------------
string UtilsStd :: sys(string sys, string sock) {
        sys += " > " + sock;
        //char* s = new char[sys.length() + 1];
        //Char(sys, s);
        system(sys.c_str());

        unsigned long sz = filesize(sock);
        while (true) {
                system("sleep 1");
                unsigned long csz = filesize(sock);
                if (csz == sz) {
                        string s = read(sock);
                        return s;
                }
                sz = csz;                
        }
        return "";
}
//------------------------------------------------------------
int UtilsStd :: procexists(string procname, string socketfile) {
        string res = sys("ps -aC " + procname, socketfile);
        int n = pos(procname, res);
        if (n == -1) return 0;
        else {
            n = n + procname.length();
            if (n < res.length()) {
                if (res[n] != '\n') return 0;
            }
            return n;
        }
        return 0;
}
//------------------------------------------------------------
int UtilsStd :: procalreadyrun(string procname, string socketfile) {
    string res = sys("ps -aC " + procname, socketfile);
    int n = pos(procname + "\n", res);
        cout << n << "\n" << res << "\n=======\n";
        if (n == -1) return 0;
        else {
            res = res.substr(n + 2);
            n = pos(procname + "\n", res);
            cout << n << "\n" << res << "\n=======\n";
            if (n == -1) return 0;
        }
        return 1;
}
//------------------------------------------------------------
int UtilsStd :: linuxversion(string &osname, string sock) {
    string s = sys("lsb_release -ir", sock);
    int newline = pos('\n', s);
    int dpoint  = pos(':', s);
    int release = pos("elease:", s);
    if (dpoint > -1 && newline > -1 && release  > -1 && pos("istributor", s)  > -1) {
        //get Dist ID
        osname = "";
        string lat  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int i = dpoint; i < newline; i++) {
            if ( pos(s[i], lat) > -1) osname += s[i];
        }
        //get release version
        string num = "0123456789";
        int start = -1, fin = -1;
        for (int i = s.length() - 1; i > release; i--) {
            if ( pos(s[i], num) > -1 ) {
                start = i;
                if (fin == -1) fin = start;
            }
        }
        string v = "";
        if (start > -1) {
            for (int i = start; i <= fin; i++) if ( pos(s[i], num) > -1 ) v += s[i];
        }
        int res = strToInt(v);
        return res;
    }
    osname = "unknown";
    return 0;
}
