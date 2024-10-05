import pandas as pd

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

columns_to_keep = ['pl_name', 'hostname', 'sy_snum', 'sy_pnum', 'sy_mnum'
                   'pl_orbper', 'pl_orbsmax', 'pl_rade', 'pl_radj', 'pl_bmasse',
                   'pl_bmassj', 'pl_dens', 'pl_orbeccen', 'pl_eqt', 'pl_orbincl',
                   'st_spectype', 'ra', 'dec', 'sy_dist', 'sy_plx']

dataFrame = pd.DataFrame(df, columns=columns_to_keep)

planetData = pd.DataFrame(dataFrame, columns=['pl_name', 'hostname', 'sy_snum', 'sy_pnum', 'sy_mnum',
                          'pl_rade', 'pl_radj', 'pl_bmasse', 'pl_bmassj', 'pl_dens', 'pl_eqt', 'st_spectype'])

planetData = planetData.rename(columns={
    'pl_name': 'Exoplanet Name',
    'hostname': 'Host Star Name',
    'sy_snum': 'Number of Stars',
    'sy_pnum': 'Number of Planets',
    'sy_mnum': 'Number of Moons',
    'pl_rade': 'Exoplanet Radius (Earth Units)',
    'pl_radj': 'Exoplanet Radius (Jupiter Units)',
    'pl_bmasse': 'Exoplanet Mass (Earth Units)',
    'pl_bmassj': 'Exoplanet Mass (Jupiter Units)',
    'pl_dens': 'Exoplanet Density (g/cm^3)',
    'pl_eqt': 'Equilibrium Temperature (K)',
    'st_spectype': 'Spectral Type'
})