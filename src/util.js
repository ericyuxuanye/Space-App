export const AU_TO_SOLAR_RADIUS = 214.939;
export const EARTH_RADIUS_TO_SOLAR_RADIUS = 0.00917431;

export function orbitPos(theta, semiMajorAxis, eccentricity) {
  const r =
    (AU_TO_SOLAR_RADIUS * (semiMajorAxis * (1 - Math.pow(eccentricity, 2)))) /
    (1 + eccentricity * Math.cos(theta));
  const xProj = r * Math.cos(theta);
  const yProj = r * Math.sin(theta);
  return [xProj, yProj];
}
