#include <iostream>
#include "utilsstd.h"
using namespace std;

int main()
{
	int safe = -1;
	int current = -1;
	int maxN = 5000;
	string socket = "/home/andrey/.config/fastxampp/brightness.conf";
	UtilsStd Lib;
	while (true) {
		current = Lib.strToInt(Lib.read(socket));
		if (!current) {
			current = 300;
		}
		if (current != safe) {
			safe = current;
			string cmd = "echo " + Lib.intToStr(current) + " > /sys/class/backlight/intel_backlight/brightness";
			//cout << "cmd: " << cmd << "\n";
			system(cmd.c_str());
		}
		system("sleep 1");
	}
	return 0;
}
