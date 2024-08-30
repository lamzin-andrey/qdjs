#! /bin/bash
echo user
echo $USER
echo isXfce
ps -aC xfdesktop
echo isKde
ps -aC kwin
ps -aC kwin_x11
ps -aC kded5
echo isMint
uname -a
lsb_release -a
echo xfceThemeName
xfconf-query -lvc xsettings -p /Net/IconThemeName
echo qdjsVersion
qdjs --version
