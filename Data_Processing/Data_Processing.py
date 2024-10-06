import pandas as pd
import json
import simplejson
import numpy as np
from algo import signal_noise_ratio, limiting_distance, habitable_zone_lim, habitable
import xgboost as xgb

model = xgb.XGBRegressor()
model.load_model("./XGBoost_model.json")

df_og = pd.read_csv('Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

df = pd.read_csv('Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

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
for index, row in df_og.iterrows():
    
    if np.isnan(row['st_lum']):
        # Predict luminosity using the awesome XGBoost model
        row['st_lum'] = model.predict(row[[
             'st_teff',
             'st_mass',
             'st_met',
             'st_logg',
             'st_dens',
             'st_vsin',
             'st_rad']].to_numpy().reshape(1, -1))[0]

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
            "Habitable-Zone-lower": habitable_val[0],
            "Habitable-Zone-upper": habitable_val[1],
            "Distance": row["Distance"],
            'Proper Motion(ra)': row['Proper Motion(ra)'],
            'Proper Motion(dec)': row['Proper Motion(dec)'],
            "Planets": {}
        }
    
    planet_name = row['Exoplanet Name']
    grouped_by_star[star_name]["Planets"][planet_name] = {
        "Eccentricity": row['Eccentricity'],
        "Limiting_Distance": limiting_distance(row['Orbital Semi-Major Axis']),
        "Exoplanet Radius": row['Exoplanet Radius (Earth Units)'],
        "SNR": signal_noise_ratio(row['Stellar Radius'], row['Exoplanet Radius (Earth Units)'], row['Distance'], row['Orbital Semi-Major Axis'], SNR0=100),
        "Orbital Semi-Major Axis": row['Orbital Semi-Major Axis']
    }

    if is_habitable:
        if star_name not in habitable_rows:
            habitable_rows[star_name] = grouped_by_star[star_name]

json_data_habitable = simplejson.dumps(grouped_by_star, ignore_nan=True)
json_data = open("../src/planetarydata2.json","w")
json_data.write(json_data_habitable)
json_data.close

# json_data = json.dumps(grouped_by_star, indent=4)
# print(json_data