import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

columns_to_keep = ['pl_orbper':'Orbital Period', 
                   'pl_orbsmax':'Orbital Semi-Major Axis', 
                   'pl_orbeccen':'Eccentricity', 
                   'pl_orbincl':'Inclination',
                   'st_spectype':'Spectral Type', 
                   'ra':'Proper Motion(ra)', 
                   'dec':'Proper Motion(dec)', 
                   'sy_dist':'Distance', 
                   'sy_plx':'Parallax']
df_cleaned = [columns_to_keep]

dataFrame = pd.DataFrame(df, columns=columns_to_keep)

#dataFrame.to_json('filtered_planet_data.json', orient='records', lines=True)


