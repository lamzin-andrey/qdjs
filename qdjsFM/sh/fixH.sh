#!/bin/bash
mkdir /media/windows
mount -t ntfs-3g -o remove_hiberfile /dev/sdc3 /media/windows
sudo ntfsfix /dev/sdc3
mount -t ntfs-3g -o remove_hiberfile /dev/sdc3 /media/windows
umount /dev/sdc3
