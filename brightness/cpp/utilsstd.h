#ifndef UTILSTD_H
#define UTILSTD_H
#include <string>
#include <math.h>
#include <iostream>
#include <string.h>
#include <stdlib.h>
#include <fstream>
#include <sys/stat.h>
using namespace std;

class UtilsStd
{
public:
        UtilsStd() {}
	int pos(string substr, string s);
	int pos(char ch, string s);
	string intToStr(int x);
	int strToInt(string s);
	string Delete(string s, unsigned int pos, unsigned int count);
	string Insert(string s, string newStr, int pos);
	void deleteSpace(string &s);
	string intToStrBin(int i, int category);
	void bSort(string & s );
	string read(string filename, char stop = '\0');
	void write(string s, string filename);
        string getShortFileName(char* longname, char* &shortname);
	string getShortFileName(string longname, char* &shortname);
	string getFileDir(char* filepath, char* &directory);
	string getFileDir(string filepath, char* &directory);
	string concat(char* chars, string str, char* &dest);
	string concat(string str, char* chars, char* &dest);
	string concat(char* chars_1, char* chars, char* &dest);
	void Char(string s, char* &dest);
        bool isDir(string path);
        bool isDir(char* path);
        unsigned long filesize(string file);
        string sys(string sys, string sock);
        int procexists(string procname, string socketfile);
        int procalreadyrun(string procname, string socketfile);
        int linuxversion(string &osname, string sock="/tmp/checkv.sock");

private:
	string rToStr(int n);
	int chToR(string ch);
	int chToR(char ch);
};

#endif
