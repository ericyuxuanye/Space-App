export const AU_TO_SOLAR_RADIUS = 214.939;
export const EARTH_RADIUS_TO_SOLAR_RADIUS = 0.00917431;

export function starColor(starClass) {
  switch (starClass) {
    case "O":
      return "#98adf9";
    case "B":
      return "#9fb4ed";
    case "A":
      return "#bbc6ea";
    case "F":
      return "#eaeaef";
    case "G":
      return "#ede2da";
    case "K":
      return "#ecc498";
    case "M":
      return "#f7c76c";
    default:
      return "#ede2da"; // this is fairly generic color iirc
  }
}

export function orbitPos(theta, semiMajorAxis, eccentricity) {
  const r =
    (AU_TO_SOLAR_RADIUS * (semiMajorAxis * (1 - Math.pow(eccentricity, 2)))) /
    (1 + eccentricity * Math.cos(theta));
  const xProj = r * Math.cos(theta);
  const yProj = r * Math.sin(theta);
  return [xProj, yProj];
}
