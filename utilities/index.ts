//needs approximating
export const distanceApproximator = (long1: number, lat1: number, long2: number, lat2: number) => {
  const R = 6371;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((long2 - long1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;

  return d;
};

/*
    Latitude φ: (-90°<φ≤90°).   (y)
    Longitude λ (-180°<φ≤180°). (x)

    2π=360°
    rads = deg * pi/180

*/
