#!/bin/bash
mkdir /media/windows
mount -t ntfs-3g -o remove_hiberfile /dev/sda3 /media/windows
sudo ntfsfix /dev/sda3
mount -t ntfs-3g -o remove_hiberfile /dev/sda3 /media/windows
umount /dev/sda3
