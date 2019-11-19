from glob import glob
import os

bad_names = glob('*')


for name in bad_names:
    if name[0]=='s':
        print(name)
        os.rename(name,name[1:])
