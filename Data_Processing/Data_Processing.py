import pandas as pd
import json
import numpy as np

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

def habitable_zone_lim(st_teff, st_lum):
    """
    Takes in the effective temp and luminosity of a star,
    and returns the inner and outer bounds of its habitable
    zone (both optimistic and conservative)
    NOTE - according to the paper this code is based on, these
    constants are only predictive for stars with teff between
    2600, 7200 and apply to earth-like planets

    The luminosity should be inputted as log10(Solar)
    The effective temperature should be inputted as Kelvin
    """
    seff = [0,0,0,0] 
    seffsun  = [1.776, 1.107, 0.356, 0.320] 
    a = [2.136e-4, 1.332e-4, 6.171e-5, 5.547e-5]
    b = [2.533e-8, 1.580e-8, 1.698e-9, 1.526e-9]
    c = [-1.332e-11, -8.308e-12, -3.198e-12, -2.874e-12]
    d = [-3.097e-15, -1.931e-15, -5.575e-16, -5.011e-16]
    opt_range = np.zeros((2,))
    cons_range = np.zeros((2,))
    t_star = st_teff - 5780.0
    for i in range(len(a)):
        seff[i] = seffsun[i] + a[i]*t_star + b[i]*t_star**2 + c[i]*t_star**3 + d[i]*t_star**4
    opt_range[0] = seff[0]
    opt_range[1] = seff[3]
    cons_range[0] = seff[1]
    cons_range[1] = seff[2]
    st_lum = 10 ** st_lum
    # st_lum = np.e ** st_lum
    cons_range = np.sqrt(st_lum / cons_range)
    opt_range = np.sqrt(st_lum / opt_range)
    return np.array([cons_range, opt_range]).ravel().tolist()


# Test that the function works fine (using the website's calculations)
assert abs(habitable_zone_lim(5780, 0)[0] - 0.95) < 0.001

grouped_by_star = {}

for index, row in df.iterrows():
    star_name = row['Host Star Name']
    
    if star_name not in grouped_by_star:
        grouped_by_star[star_name] = {
            # "Host Star Name": star_name,
            "Spectral Type": row['Spectral Type'],
            "Stellar Radius": row['Stellar Radius'],
            "Inclination": row['Inclination'],
            "Habitable-Zone": [habitable_zone_lim(row['st_teff'], row['st_lum'])],
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