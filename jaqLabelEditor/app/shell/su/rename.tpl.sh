#! /bin/bash

umount {device}
echo mtools_skip_check=1 > ~/.mtoolsrc
mlabel -i {device} ::{newname}
rm -rf {newdir}
mkdir {newdir}
chown {user}:{group} {newdir}
chmod 777 -R {newdir}
mount -t vfat {device} {newdir} -o iocharset=utf8,rw,uid={user},gid={group}

