import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  CloudRain, 
  Sunrise, 
  Sunset, 
  Compass,
  Thermometer,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { LocationResult, SpeedUnit, TempUnit, WeatherData } from '../types';
import { 
  getWMOCodeInfo, 
  convertTemp, 
  convertSpeed, 
  getWindDirectionText, 
  getUVIndexInfo 
} from '../utils/wmoCodes';
import { getAQIInfo } from '../utils/aqiUtils';

interface CurrentWeatherCardProps {
  location: LocationResult;
  weather: WeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  weather,
  tempUnit,
  speedUnit,
}) => {
  const current = weather.current;
  const daily = weather.daily;

  const wmoInfo = getWMOCodeInfo(current.weather_code);
  const WmoIcon = wmoInfo.icon;

  const tempCurrent = convertTemp(current.temperature_2m, tempUnit);
  const tempFeelsLike = convertTemp(current.apparent_temperature, tempUnit);

  const maxTemp = daily.temperature_2m_max[0] ? convertTemp(daily.temperature_2m_max[0], tempUnit) : tempCurrent;
  const minTemp = daily.temperature_2m_min[0] ? convertTemp(daily.temperature_2m_min[0], tempUnit) : tempCurrent;

  const windSpeed = convertSpeed(current.wind_speed_10m, speedUnit);
  const windDirText = getWindDirectionText(current.wind_direction_10m);

  const uvInfo = getUVIndexInfo(current.uv_index);
  const aqiVal = weather.airQuality?.us_aqi ?? 35;
  const aqiInfo = getAQIInfo(aqiVal);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr.split('T')[1] || timeStr;
    }
  };

  const sunriseTime = formatTime(daily.sunrise?.[0]);
  const sunsetTime = formatTime(daily.sunset?.[0]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 text-slate-900 shadow-sm border border-slate-200/80 transition-all duration-300">
      <div className="relative z-10 space-y-6">
        {/* Top Location Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {location.name}
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {location.admin1 ? `${location.admin1}, ` : ''}
              {location.country || 'Coordinates'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1.5 shadow-2xs">
              <WmoIcon className="w-4 h-4 text-blue-600" />
              {wmoInfo.label}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${aqiInfo.bgColor} ${aqiInfo.borderColor} ${aqiInfo.color}`}>
              <Activity className="w-3.5 h-3.5" />
              AQI {aqiInfo.score} • {aqiInfo.label}
            </span>
          </div>
        </div>

        {/* Hero Temperature & Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-baseline gap-4">
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900">
              {tempCurrent}°
              <span className="text-2xl sm:text-3xl font-light text-slate-400 ml-1">
                {tempUnit}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Thermometer className="w-4 h-4 text-slate-400" />
                <span>Feels like {tempFeelsLike}°{tempUnit}</span>
              </div>
              <p className="text-xs text-slate-500">
                H: <span className="font-bold text-slate-800">{maxTemp}°</span> • L: <span className="font-bold text-slate-800">{minTemp}°</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <WmoIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Current Condition
              </p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {wmoInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Key Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Wind */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wind</span>
              <Wind className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">
              {windSpeed} <span className="text-xs font-normal text-slate-500">{speedUnit}</span>
            </p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <Compass className="w-3 h-3 text-slate-400" /> {windDirText} ({current.wind_direction_10m}°)
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">
              {current.relative_humidity_2m}%
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {current.relative_humidity_2m > 70 ? 'High Moisture' : 'Comfortable'}
            </p>
          </div>

          {/* UV Index */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>UV Index</span>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-slate-900">
                {current.uv_index.toFixed(1)}
              </p>
              <span className={`text-[11px] font-bold ${uvInfo.color}`}>
                {uvInfo.label}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full ${uvInfo.levelBg}`}
                style={{ width: `${Math.min(100, (current.uv_index / 12) * 100)}%` }}
              />
            </div>
          </div>

          {/* Surface Pressure */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pressure</span>
              <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">
              {Math.round(current.surface_pressure)} <span className="text-xs font-normal text-slate-500">hPa</span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {current.surface_pressure > 1013 ? 'High Pressure' : 'Low Pressure'}
            </p>
          </div>

          {/* Precipitation Today */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Rain Today</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">
              {(daily.precipitation_sum[0] ?? current.precipitation).toFixed(1)} <span className="text-xs font-normal text-slate-500">mm</span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Prob: {daily.precipitation_probability_max?.[0] ?? 0}%
            </p>
          </div>

          {/* Sun Cycle */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Sun Cycle</span>
              <Sunrise className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="text-slate-800 font-semibold flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-500 inline" /> {sunriseTime}
              </p>
              <p className="text-slate-500 flex items-center gap-1 font-medium">
                <Sunset className="w-3 h-3 text-rose-500 inline" /> {sunsetTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
