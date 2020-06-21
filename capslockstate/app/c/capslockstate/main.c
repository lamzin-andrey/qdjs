#include <X11/Xlib.h>
#include </usr/include/X11/XKBlib.h>

#include <stdlib.h>
#include <stdio.h>

int statusCapsLock() {

	Display * d = XOpenDisplay((char*)0);
	int caps_state = 0;
	if (d) {
		unsigned n;
		XkbGetIndicatorState(d, XkbUseCoreKbd, &n);
		caps_state = (n & 0x01) == 1;
	}
	return caps_state;
}


int main() {
	if (statusCapsLock()) {
		printf("Caps on");
	} else {
		printf("Caps off");
	}
	return 0;
}
