#! /bin/bash
rm -f "{outfile}"
{ffmpeg_command}
rm -f "{infile}"
mv -f "{outfile}" "{infile}"
