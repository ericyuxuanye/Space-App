import pandas as pd
import json

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

planetData = pd.DataFrame(df, columns=['pl_name', 'hostname', 'sy_snum', 'sy_pnum', 'sy_mnum',
                          'pl_rade', 'pl_radj', 'pl_bmasse', 'pl_bmassj', 'pl_dens', 'pl_eqt', 'st_spectype', 'st_rad'])

planetData = planetData.rename(columns={
    'pl_name': 'Exoplanet Name',
    'hostname': 'Host Star Name',
    'pl_rade': 'Exoplanet Radius (Earth Units)',
    'st_rad': 'Stellar Radius',
})

print(planetData)

grouped_by_star = planetData.groupby('Host Star Name').apply(lambda x: x.to_dict(orient='records')).to_dict()
json_data = json.dumps(grouped_by_star, indent=4)
print(json_data)

