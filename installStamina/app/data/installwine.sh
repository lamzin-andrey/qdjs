#!/bin/bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt-get install libwine  wine wine64 wine32 fonts-wine
#sudo apt-get install libwine:i386 wine32:i386
winecfg
read
