#!/bin/bash
g++ -c utilsstd.cpp  -o utilsstd.o
g++ -c main.cpp -o main.o
g++ -Xlinker utilsstd.o main.o -o a.isp
