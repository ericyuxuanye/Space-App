import pandas as pd
import json

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

df = pd.DataFrame(df, columns=['pl_orbsmax', 'pl_orbeccen', 'pl_orbincl', 'st_spectype', 'ra', 'dec', 'sy_dist', 'sy_plx', 'pl_name', 'hostname', 'pl_rade', 'st_rad'])

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

for index, row in df.iterrows():
    star_name = row['Host Star Name']
    
    if star_name not in grouped_by_star:
        grouped_by_star[star_name] = {
            # "Host Star Name": star_name,
            "Spectral Type": row['Spectral Type'],
            "Stellar Radius": row['Stellar Radius'],
            "Inclination": row['Inclination'],
            "Planets": {}
        }
    
    planet_name = row['Exoplanet Name']
    grouped_by_star[star_name]["Planets"][planet_name] = {
        "Eccentricity": row['Eccentricity'],
        "Exoplanet Radius": row['Exoplanet Radius (Earth Units)'],
        "Orbital Semi-Major Axis": row['Orbital Semi-Major Axis']
    }

json_data = json.dumps(grouped_by_star, indent=4)
print(json_data)