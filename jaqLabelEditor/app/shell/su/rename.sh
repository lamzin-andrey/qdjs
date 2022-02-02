#! /bin/bash

umount /dev/sdc2
echo mtools_skip_check=1 > ~/.mtoolsrc
mlabel -i /dev/sdc2 ::T31
rm -rf /media/andrey/T31
mkdir /media/andrey/T31
chown andrey:andrey /media/andrey/T31
chmod 777 -R /media/andrey/T31
mount -t vfat /dev/sdc2 /media/andrey/T31 -o iocharset=utf8,rw,uid=andrey,gid=andrey

