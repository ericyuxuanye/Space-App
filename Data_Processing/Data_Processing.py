import pandas as pd
import json
import numpy as np
from algo import signal_noise_ratio, limiting_distance, habitable_zone_lim, habitable

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

df = pd.DataFrame(df, columns=['st_teff', 'st_lum', 'pl_orbsmax', 'pl_orbeccen', 'pl_orbincl', 'st_spectype', 'ra', 'dec', 'sy_dist', 'sy_plx', 'pl_name', 'hostname', 'pl_rade', 'st_rad'])

df = df.rename(columns={ 
                    'pl_orbsmax':'Orbital Semi-Major Axis', 
                    'pl_orbeccen':'Eccentricity', 
                    'pl_orbincl':'Inclination',
                    'st_spectype':'Spectral Type', 
                    'ra':'Proper Motion(ra)', 
                    'dec':'Proper Motion(dec)', 
                    'sy_dist':'Distance', 
                    'sy_plx':'Parallax',
                    'pl_name': 'Exoplanet Name',
                    'hostname': 'Host Star Name',
                    'pl_rade': 'Exoplanet Radius (Earth Units)',
                    'st_rad': 'Stellar Radius'
})

grouped_by_star = {}
habitable_rows = {}

for index, row in df.iterrows():
    star_name = row['Host Star Name']
    habitable_val = habitable_zone_lim(row['st_teff'], row['st_lum'])
    
    is_habitable = habitable(row['Orbital Semi-Major Axis'], habitable_val[0], habitable_val[1])

    if star_name not in grouped_by_star:
        grouped_by_star[star_name] = {
            "Host Star Name": star_name,
            "Spectral Type": row['Spectral Type'],
            "Stellar Radius": row['Stellar Radius'],
            "Inclination": row['Inclination'],
            "Habitable-Zone": habitable(row['Orbital Semi-Major Axis'], habitable_val[0], habitable_val[1]),
            "Limiting_Distance": limiting_distance(row['Orbital Semi-Major Axis']),
            "SNR": signal_noise_ratio(row['Stellar Radius'], row['Exoplanet Radius (Earth Units)'], row['Distance'], row['Orbital Semi-Major Axis'], SNR0=100),
            "Planets": {}
        }
    
    planet_name = row['Exoplanet Name']
    grouped_by_star[star_name]["Planets"][planet_name] = {
        "Eccentricity": row['Eccentricity'],
        "Exoplanet Radius": row['Exoplanet Radius (Earth Units)'],
        "Orbital Semi-Major Axis": row['Orbital Semi-Major Axis']
    }

    if is_habitable:
        if star_name not in habitable_rows:
            habitable_rows[star_name] = grouped_by_star[star_name]

json_data_habitable = json.dumps(habitable_rows, indent=4)
print(json_data_habitable)

# json_data = json.dumps(grouped_by_star, indent=4)
# print(json_data)