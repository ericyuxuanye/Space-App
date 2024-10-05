import numpy as np



def signal_noise_ratio(R_star, r_planet, dia_tele, Earth_star, planet_star,SNR0 = 100):
    SNR = SNR0*((R_star*r_planet*(dia_tele/6))/(Earth_star/10 * planet_star))^2
    return SNR


def limiting_distance(dia_tele,planet_star):
    ES_max = 15 *((dia_tele/6)/planet_star)
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
    seff = [0,0] 
    seffsun  = [1.107, 0.356] 
    a = [1.332e-4, 6.171e-5]
    b = [1.580e-8, 1.698e-9]
    c = [-8.308e-12, -3.198e-12]
    d = [-1.931e-15, -5.575e-16]
    cons_range = np.zeros((2,))
    t_star = st_teff - 5780.0
    for i in range(len(a)):
        seff[i] = seffsun[i] + a[i]*t_star + b[i]*t_star**2 + c[i]*t_star**3 + d[i]*t_star**4
    cons_range[0] = seff[0]
    cons_range[1] = seff[1]
    st_lum = 10 ** st_lum
    # st_lum = np.e ** st_lum
    cons_range = np.sqrt(st_lum / cons_range)

    return np.array([cons_range]).ravel()


# Test that the function works fine (using the website's calculations)
assert abs(habitable_zone_lim(5780, 0)[0] - 0.95) < 0.001


