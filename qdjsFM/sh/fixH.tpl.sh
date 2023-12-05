#!/bin/bash
mkdir /media/windows
mount -t ntfs-3g -o remove_hiberfile /dev/{sdx} /media/windows
sudo ntfsfix /dev/{sdx}
mount -t ntfs-3g -o remove_hiberfile /dev/{sdx} /media/windows
umount /dev/{sdx}
