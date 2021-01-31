#! /bin/bash

umount /dev/sdb1
echo mtools_skip_check=1 > ~/.mtoolsrc
mlabel -i /dev/sdb1 ::KINGSTON
rm -rf /media/andrey/KINGSTON
mkdir /media/andrey/KINGSTON
chown andrey:andrey /media/andrey/KINGSTON
chmod 777 -R /media/andrey/KINGSTON
mount -t vfat /dev/sdb1 /media/andrey/KINGSTON -o iocharset=utf8,rw,uid=andrey,gid=andrey

