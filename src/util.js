export function orbitPos(theta, semiMajorAxis, eccentricity) {
  const r =
    (semiMajorAxis * (1 - Math.pow(eccentricity, 2))) /
    (1 + eccentricity * Math.cos(theta));
  const xProj = r * Math.cos(theta);
  const yProj = r * Math.sin(theta);
  return [xProj, yProj];
}
