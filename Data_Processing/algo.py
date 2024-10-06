import numpy as np


def signal_noise_ratio(R_star, r_planet, Earth_star, planet_star,SNR0 = 100):
    SNR = SNR0*((R_star*r_planet) / ((6*Earth_star)/ 10 * planet_star))**2
    return SNR
# signal_noise_ratio(13.76, 12.2,93.1846,1.178)

def limiting_distance(planet_star):
    ES_max = 15/(6*planet_star)
    return ES_max


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
    seff = [0, 0] 
    seffsun  = [1.776, 0.320] 
    a = [2.136e-4, 5.547e-5]
    b = [2.533e-8, 1.526e-9]
    c = [-1.332e-11, -2.874e-12]
    d = [-3.097e-15, -5.011e-16]
    opt_range = np.zeros((2,))

    t_star = st_teff - 5780.0
    for i in range(len(a)):
        seff[i] = seffsun[i] + a[i]*t_star + b[i]*t_star**2 + c[i]*t_star**3 + d[i]*t_star**4
    opt_range[0] = seff[0]
    opt_range[1] = seff[1]
    st_lum = 10 ** st_lum
    # print(st_lum)
    # st_lum = np.e ** st_lum
    opt_range = np.sqrt(st_lum / opt_range)
    return np.array(opt_range).tolist()




temp = 4816
luminosity = 1.877

# print(habitable_zone_lim(temp,luminosity))

def habitable(val, lower, upper):

    if np.isnan(val) or np.isnan(lower) or np.isnan(upper):
        return lower, upper
    
    if val in range(int(lower), int(upper)):
        return True
    return False