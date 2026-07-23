import React from 'react';
import { Calendar, CloudRain, Sun, Wind, Umbrella } from 'lucide-react';
import { DailyForecast, TempUnit, SpeedUnit } from '../types';
import { getWMOCodeInfo, convertTemp, convertSpeed } from '../utils/wmoCodes';

interface ForecastGridProps {
  daily: DailyForecast;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  tempUnit,
  speedUnit,
}) => {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Global temp range for range bar scaling
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempSpan = Math.max(1, allMax - allMin);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Weather Outlook</h3>
            <p className="text-xs text-slate-500">Extended forecast & daily precipitation probabilities</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {daily.time.length} Days Forecast
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {daily.time.slice(0, 7).map((timeStr, idx) => {
          const dateObj = new Date(timeStr + 'T00:00:00');
          const isToday = idx === 0;

          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const monthDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const code = daily.weathercode[idx] ?? 0;
          const wmo = getWMOCodeInfo(code);
          const WmoIcon = wmo.icon;

          const rawMax = daily.temperature_2m_max[idx] ?? 0;
          const rawMin = daily.temperature_2m_min[idx] ?? 0;

          const maxT = convertTemp(rawMax, tempUnit);
          const minT = convertTemp(rawMin, tempUnit);

          const precipSum = daily.precipitation_sum[idx] ?? 0;
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const maxWind = daily.wind_speed_10m_max?.[idx] ?? 0;
          const convertedWind = convertSpeed(maxWind, speedUnit);

          // Calculate temperature range percentage for range bar
          const leftPercent = ((rawMin - allMin) / tempSpan) * 100;
          const widthPercent = Math.max(10, ((rawMax - rawMin) / tempSpan) * 100);

          return (
            <div
              key={timeStr}
              className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 group ${
                isToday
                  ? 'bg-blue-50/80 ring-2 ring-blue-500/40 shadow-sm border border-blue-200'
                  : 'bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-bold ${isToday ? 'text-blue-700' : 'text-slate-800'}`}>
                    {dayName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{monthDate}</p>
                </div>
                {isToday && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-600 text-white shadow-2xs">
                    Now
                  </span>
                )}
              </div>

              {/* Weather Icon & Label */}
              <div className="flex flex-col items-center text-center py-1">
                <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-100 transition-transform group-hover:scale-110 duration-200">
                  <WmoIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-2 line-clamp-1">
                  {wmo.label}
                </p>
              </div>

              {/* Temperature Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="text-slate-400 font-normal">{minT}°</span>
                  <span className="text-slate-900">{maxT}°{tempUnit}</span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500"
                    style={{
                      left: `${Math.max(0, Math.min(90, leftPercent))}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Extra Stats Footer */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-blue-600" />
                  <span className={precipProb > 30 ? 'text-blue-700 font-bold' : ''}>
                    {precipProb}% ({precipSum.toFixed(1)}mm)
                  </span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <Wind className="w-3 h-3 text-slate-400" />
                  <span>{convertedWind}{speedUnit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
