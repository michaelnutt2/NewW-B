import os, io, sys, glob

files = glob.glob('./Articles/*.html')

for f in files:
    print(f)

    readFile = open(f, errors='ignore')

    lines = readFile.readlines()

    readFile.close()
    w = open(f,'w')

    w.writelines([item for item in lines[:-1]])

    w.close()