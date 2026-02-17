#!/bin/bash
grep -rl --include="*.js" "main(" "/home/andrey/hdata/programs/my/qdjs" | while read -r file; do
    find "$file" -not -path '*/.*' -printf '%f|%h|%s|%F|%t\n'
done > "/opt/qt-desktop-js/apps/AiSearch3/app/sh/searchresult.txt"
