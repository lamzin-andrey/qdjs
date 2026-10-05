#! /bin/bash
cd /home/andrey/hdata/Audio;
rm -f 2026-10-05-08-32-00-out.mp3
ffmpeg -i 2026-10-05-08-32-00.mp3 -ss 00:00:00 -t 00:00:05 2026-10-05-08-32-00-out.mp3
