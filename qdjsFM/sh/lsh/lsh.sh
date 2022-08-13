#! /bin/bash

dir=/home/andrey/hdata/programs/my/qdjs/qdjsFM/sh/lsh
out=$dir/lsh.out
inp=$dir/lsh.inp
NL=$'\xd' 
currentList=''
while true
do
	trg=`cat $inp`
	newList='BOF '$trg$NL`ls -alh --full-time $trg`$NL'EOF '$trg
	if [[ "$currentList" != "$newList" ]]; then
		echo 'BOF '$trg > $out
		ls -alh --full-time "$trg" >> $out
		echo 'EOF '$trg >> $out
		currentList=$newList
	fi
	sleep 0.1
done
