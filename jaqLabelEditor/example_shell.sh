#! /bin/bash
mount # выведет список всех примонтированных и не примонтированных устройств (выводим только те, которые с /dev начинаются)
sudo umount /dev/sdb1 # тут передавать аргумент, в зависимости от выбранного в gui диска

# sudo apt-get install mtools
echo mtools_skip_check=1 >> ~/.mtoolsrc
sudo mlabel -i /dev/sdb1 ::K # sudo apt-get install mtools

sudo chown andrey:andrey /media/andrey/KINGSTON # Например
