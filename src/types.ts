export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
}

export interface AirQualityData {
  us_aqi: number;
  european_aqi?: number;
  pm2_5?: number;
  pm10?: number;
  ozone?: number;
  nitrogen_dioxide?: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
  airQuality?: AirQualityData;
  current_units?: {
    temperature_2m?: string;
    wind_speed_10m?: string;
    surface_pressure?: string;
    precipitation?: string;
  };
}

export interface Recommendation {
  id: string;
  type: 'rain' | 'clothing' | 'uv' | 'wind' | 'outdoor' | 'alert';
  title: string;
  description: string;
  iconName: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface SavedLocation {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  lat: number;
  lon: number;
}
