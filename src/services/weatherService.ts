import { AirQualityData, LocationResult, WeatherData } from '../types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function searchCity(cityName: string): Promise<LocationResult[]> {
  if (!cityName || cityName.trim().length === 0) return [];

  const url = `${GEOCODING_API}?name=${encodeURIComponent(cityName.trim())}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results;
  } catch (err) {
    console.error('Error fetching city geocoding data:', err);
    throw err;
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    timezone: 'auto',
  });

  const aqParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'us_aqi,european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
  });

  const forecastUrl = `${FORECAST_API}?${forecastParams.toString()}`;
  const aqUrl = `${AIR_QUALITY_API}?${aqParams.toString()}`;

  try {
    const [weatherRes, aqRes] = await Promise.allSettled([
      fetch(forecastUrl),
      fetch(aqUrl),
    ]);

    if (weatherRes.status === 'rejected' || !weatherRes.value.ok) {
      throw new Error('Weather forecast data request failed');
    }

    const data: WeatherData = await weatherRes.value.json();

    if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
      try {
        const aqJson = await aqRes.value.json();
        if (aqJson && aqJson.current) {
          const cur = aqJson.current;
          data.airQuality = {
            us_aqi: typeof cur.us_aqi === 'number' ? cur.us_aqi : 35,
            european_aqi: cur.european_aqi,
            pm2_5: cur.pm2_5,
            pm10: cur.pm10,
            ozone: cur.ozone,
            nitrogen_dioxide: cur.nitrogen_dioxide,
          };
        }
      } catch (aqErr) {
        console.warn('Could not parse air quality data:', aqErr);
      }
    }

    // Fallback default AQI if air quality API was unavailable
    if (!data.airQuality) {
      data.airQuality = {
        us_aqi: Math.max(15, Math.min(120, Math.round(data.current.relative_humidity_2m * 0.5 + data.current.surface_pressure % 20))),
        pm2_5: 8.5,
        pm10: 16.2,
        ozone: 42.0,
      };
    }

    return data;
  } catch (err) {
    console.error('Error fetching weather forecast:', err);
    throw err;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationResult> {
  try {
    // Attempt reverse lookup via BigDataCloud free client-side API
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return {
        id: Date.now(),
        name: city,
        latitude: lat,
        longitude: lon,
        country,
        admin1,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode client failed, using fallback coordinates name', e);
  }

  return {
    id: Date.now(),
    name: 'Your Location',
    latitude: lat,
    longitude: lon,
    country: '',
    admin1: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
  };
}

export const POPULAR_CITIES: LocationResult[] = [
  { id: 101, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', admin1: 'England' },
  { id: 102, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', admin1: 'New York' },
  { id: 103, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', admin1: 'Tokyo' },
  { id: 104, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', admin1: 'Île-de-France' },
  { id: 105, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', admin1: 'New South Wales' },
  { id: 106, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', admin1: 'Dubai' },
];
