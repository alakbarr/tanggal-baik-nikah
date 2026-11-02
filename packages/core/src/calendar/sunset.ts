import type { GregorianDate } from '../types.js';
import { gregorianToJdn } from './jdn.js';

export const DEFAULT_YOGYAKARTA_LAT = -7.80;
export const DEFAULT_YOGYAKARTA_LON = 110.37;
export const DEFAULT_WIB_TIMEZONE = 7;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export interface SunsetTime {
  readonly hours: number;
  readonly minutes: number;
  readonly totalMinutes: number;
}

/**
 * Computes sunset time in local civil hours and minutes using the NOAA solar position equations.
 * Default location is Yogyakarta (-7.80° S, 110.37° E, UTC+7).
 */
export function getSunsetTime(
  year: number,
  month: number,
  day: number,
  lat: number = DEFAULT_YOGYAKARTA_LAT,
  lon: number = DEFAULT_YOGYAKARTA_LON,
  timezoneOffsetHours: number = DEFAULT_WIB_TIMEZONE
): SunsetTime {
  const jd = gregorianToJdn(year, month, day);
  const t = (jd - 2451545.0) / 36525.0;

  const geomMeanLongSun = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const geomMeanAnomSun = (357.52911 + t * (35999.05029 - 0.0001537 * t)) % 360;
  const eccentEarthOrbit = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

  const sunEqOfCtr =
    Math.sin(degToRad(geomMeanAnomSun)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(degToRad(2 * geomMeanAnomSun)) * (0.019993 - 0.000101 * t) +
    Math.sin(degToRad(3 * geomMeanAnomSun)) * 0.000289;

  const sunTrueLong = geomMeanLongSun + sunEqOfCtr;
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(degToRad(125.04 - 1934.136 * t));

  const meanObliqEcliptic =
    23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliqCorr =
    meanObliqEcliptic + 0.00256 * Math.cos(degToRad(125.04 - 1934.136 * t));

  const sunDeclin = radToDeg(
    Math.asin(Math.sin(degToRad(obliqCorr)) * Math.sin(degToRad(sunAppLong)))
  );

  const varY = Math.tan(degToRad(obliqCorr / 2)) * Math.tan(degToRad(obliqCorr / 2));
  const eqOfTime =
    4 *
    radToDeg(
      varY * Math.sin(2 * degToRad(geomMeanLongSun)) -
        2 * eccentEarthOrbit * Math.sin(degToRad(geomMeanAnomSun)) +
        4 *
          eccentEarthOrbit *
          varY *
          Math.sin(degToRad(geomMeanAnomSun)) *
          Math.cos(2 * degToRad(geomMeanLongSun)) -
        0.5 * varY * varY * Math.sin(4 * degToRad(geomMeanLongSun)) -
        1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * degToRad(geomMeanAnomSun))
    );

  // Standard solar zenith for sunrise/sunset is 90° 50' = 90.8333° (34' refraction + 16' semi-diameter)
  const zenith = 90.8333;
  const haArg =
    (Math.cos(degToRad(zenith)) - Math.sin(degToRad(lat)) * Math.sin(degToRad(sunDeclin))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(sunDeclin)));

  const ha = radToDeg(Math.acos(Math.max(-1, Math.min(1, haArg))));
  const solarNoonMin = 720 - 4 * lon - eqOfTime + timezoneOffsetHours * 60;
  const sunsetMin = solarNoonMin + 4 * ha;

  let hours = Math.floor(sunsetMin / 60);
  let minutes = Math.round(sunsetMin % 60);
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  return {
    hours,
    minutes,
    totalMinutes: Math.round(sunsetMin),
  };
}

/**
 * Calculates the effective JDN for person birth.
 *
 * In Javanese adat and Islamic tradition, the calendar day transitions at sunset.
 * If a birth occurred after local sunset (or if explicitly flagged with birthAfterSunset=true),
 * the effective JDN advances by +1, shifting the weton, Javanese date, and Hijri date accordingly.
 */
export function getEffectiveJdnForBirth(
  birthDate: GregorianDate,
  birthTime?: { hours: number; minutes: number },
  birthAfterSunset?: boolean,
  lat: number = DEFAULT_YOGYAKARTA_LAT,
  lon: number = DEFAULT_YOGYAKARTA_LON,
  timezoneOffsetHours: number = DEFAULT_WIB_TIMEZONE
): number {
  const baseJdn = gregorianToJdn(birthDate.year, birthDate.month, birthDate.day);

  if (birthAfterSunset !== undefined) {
    return birthAfterSunset ? baseJdn + 1 : baseJdn;
  }

  if (birthTime) {
    const sunset = getSunsetTime(
      birthDate.year,
      birthDate.month,
      birthDate.day,
      lat,
      lon,
      timezoneOffsetHours
    );
    const birthTotalMin = birthTime.hours * 60 + birthTime.minutes;
    if (birthTotalMin >= sunset.totalMinutes) {
      return baseJdn + 1;
    }
  }

  return baseJdn;
}
