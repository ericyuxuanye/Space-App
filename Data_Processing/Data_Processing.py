import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

columns_to_keep = ['pl_orbper', 'pl_orbsmax', 'pl_orbeccen', 'pl_orbincl',
                   'st_spectype', 'ra', 'dec', 'sy_dist', 'sy_plx']
df_cleaned = [columns_to_keep]

dataFrame = pd.DataFrame(df, columns=columns_to_keep)

