#!/bin/bash
grep -rl --include="*.js" "hello" "/home/andrey/hdata/programs/my/quickfaq" | while read -r file; do
    find "$file" -not -path '*/.*' -printf '%f|%h|%s|%F|%t\n'
done > "/opt/qt-desktop-js/apps/AiSearch/app/sh/searchresult.txt"
