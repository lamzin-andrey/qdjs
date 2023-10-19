#! /bin/bash
cd '/var/user/recs';
rm -f "Agora-2023-10-16-out.avi";
ffmpeg -i "Agora-2023-10-16.mp4" -c:v libx264 -threads 3 -pix_fmt yuv420p "Agora-2023-10-16-out.avi" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/Agora-2023-10-16-out.avi.log" 2>&1 

mkdir "ffmeg-src-files"

mv "Agora-2023-10-16.mp4" "ffmeg-src-files/Agora-2023-10-16.mp4"
