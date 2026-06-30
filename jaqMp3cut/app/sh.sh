#! /bin/bash
cd /home/andrey/hdata/Audio/fond25-26/take-to-the-moon;
ffmpeg -i 2026-06-10-15-02-00.mp3 -ss 00:05:34 -t 00:04:00 2026-06-10-15-02-00-out.mp3
