#! /bin/bash
cd '/home/andrey/tmp';
rm -f cepki-2020-09-3-out.avi;
ffmpeg -i cepki-2020-09-3.mp4 -c:v libx264 -threads 3 -pix_fmt yuv420p cepki-2020-09-3-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/cepki-2020-09-3-out.avi.log 2>&1 
