import chalk from "chalk";
import _ from "lodash";

//needs approximating
export const distanceApproximator = (long1: number, lat1: number, long2: number, lat2: number) => {
  const R = 6371; //Km
  const lat1Rads = (lat1 * Math.PI) / 180;
  const lat2Rads = (lat2 * Math.PI) / 180;
  const latAngle = ((lat2 - lat1) * Math.PI) / 180;
  const longAngle = ((long2 - long1) * Math.PI) / 180;

  const a =
    Math.sin(latAngle / 2) * Math.sin(latAngle / 2) +
    Math.cos(lat1Rads) * Math.cos(lat2Rads) * Math.sin(longAngle / 2) * Math.sin(longAngle / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; //Km

  return distance;
};

/*
    Latitude φ: (-90°<φ≤90°).   (y)
    Longitude λ (-180°<φ≤180°). (x)

    2π=360°
    rads = deg * pi/180

*/
