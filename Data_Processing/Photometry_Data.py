import pandas as pd

df = pd.read_csv('Data_Processing/Planetary_Systems_Composition.csv', on_bad_lines='skip', comment='#')

columns_to_keep = ['pl_name', 'hostname', 'sy_snum', 'sy_pnum', 'sy_mnum'
                   'pl_orbper', 'pl_orbsmax', 'pl_rade', 'pl_radj', 'pl_bmasse',
                   'pl_bmassj', 'pl_dens', 'pl_orbeccen', 'pl_eqt', 'pl_orbincl',
                   'st_spectype', 'ra', 'dec', 'sy_dist', 'sy_plx']

dataFrame = pd.DataFrame(df, columns=columns_to_keep)

photometryData = pd.DataFrame(df, columns=['sy_bmag', 'sy_vmag', 'sy_jmag', 'sy_hmag', 
                                                  'sy_kmag', 'sy_umag', 'sy_gmag', 'sy_rmag',
                                                  'sy_imag', 'sy_zmag', 'sy_w1mag', 'sy_w2mag',
                                                  'sy_w3mag', 'sy_w4mag', 'sy_gaiamag', 'sy_icmag',
                                                  'sy_tmag', 'sy_kepmag'])

photometryData = photometryData.rename(columns={
    'sy_bmag': 'B-Band Magnitude',
    'sy_vmag': 'V-Band Magnitude',
    'sy_jmag': 'J-Band Magnitude',
    'sy_hmag': 'H-Band Magnitude',
    'sy_kmag': 'K-Band Magnitude',
    'sy_umag': 'U-Band Magnitude',
    'sy_gmag': 'G-Band Magnitude',
    'sy_rmag': 'R-Band Magnitude',
    'sy_imag': 'I-Band Magnitude',
    'sy_zmag': 'Z-Band Magnitude',
    'sy_w1mag': 'W1-Band Magnitude',
    'sy_w2mag': 'W2-Band Magnitude',
    'sy_w3mag': 'W3-Band Magnitude',
    'sy_w4mag': 'W4-Band Magnitude',
    'sy_gaiamag': 'Gaia Magnitude',
    'sy_icmag': 'IC-Band Magnitude',
    'sy_tmag': 'TESS Magnitude',
    'sy_kepmag': 'Kepler Magnitude'
})