import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

lst = []

for col in df.columns:
    lst.append(col)
    print(col)

print(len(lst))
