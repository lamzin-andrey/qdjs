#! /bin/bash

dir={daemonDir}
out=$dir/ls.out
inp=$dir/ls.inp
NL=$'\xd' 
currentList=''
while true
do
	trg=`cat $inp`
	newList='BOF '$trg$NL`ls -lh --full-time $trg`$NL'EOF '$trg
	if [[ "$currentList" != "$newList" ]]; then
		echo 'BOF '$trg > $out
		ls -lh --full-time "$trg" >> $out
		echo 'EOF '$trg >> $out
		currentList=$newList
	fi
	sleep 0.1
done
