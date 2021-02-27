#! /bin/bash
cd '/home/andrey/tmp/00/01';
rm -f "04_НТВ-02012021-2344-out.avi";
ffmpeg -i "04_НТВ-02012021-2344.mts" -c:v libx264 -threads 3 -pix_fmt yuv420p "04_НТВ-02012021-2344-out.avi" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/04_НТВ-02012021-2344-out.avi.log" 2>&1 
