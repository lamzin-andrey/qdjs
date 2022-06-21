var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('firefox') !==  -1) {
	window.Qt = window.QtShadow;
	window.PHP = window.PHPShadow;
}
