import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Clock, CloudRain, Thermometer } from 'lucide-react';
import { DailyForecast, HourlyForecast, TempUnit, SpeedUnit } from '../types';
import { convertTemp, convertSpeed } from '../utils/wmoCodes';

interface WeatherChartProps {
  daily: DailyForecast;
  hourly: HourlyForecast;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  daily,
  hourly,
  tempUnit,
  speedUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'7day' | '24hour' | 'rainWind'>('7day');

  // Format 7-Day Chart Data
  const dailyData = (daily?.time || []).slice(0, 7).map((timeStr, idx) => {
    const d = new Date(timeStr + 'T00:00:00');
    const dayName = idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const maxTemp = convertTemp(daily.temperature_2m_max[idx] ?? 0, tempUnit);
    const minTemp = convertTemp(daily.temperature_2m_min[idx] ?? 0, tempUnit);
    const precip = daily.precipitation_sum[idx] ?? 0;
    const wind = convertSpeed(daily.wind_speed_10m_max?.[idx] ?? 0, speedUnit);

    return {
      day: dayName,
      maxTemp,
      minTemp,
      precip,
      wind,
    };
  });

  // Format 24-Hour Chart Data
  const hourlyData = (hourly?.time || []).slice(0, 24).map((timeStr, idx) => {
    const d = new Date(timeStr);
    const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temp = convertTemp(hourly.temperature_2m[idx] ?? 0, tempUnit);
    const rainProb = hourly.precipitation_probability[idx] ?? 0;

    return {
      time: hourLabel,
      temp,
      rainProb,
    };
  });

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 text-slate-900 animate-fade-in-grow">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Visual Weather Analytics</h3>
            <p className="text-xs text-slate-500">Interactive temperature trends & precipitation probability</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('7day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === '7day'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>7-Day Temps</span>
          </button>

          <button
            onClick={() => setActiveTab('24hour')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === '24hour'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('rainWind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'rainWind'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain & Wind</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div key={activeTab} className="h-72 w-full pt-2 animate-fade-in-grow">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === '7day' ? (
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={`°${tempUnit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#475569' }} />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name={`Max Temp (°${tempUnit})`}
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#maxTempGrad)"
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name={`Min Temp (°${tempUnit})`}
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#minTempGrad)"
              />
            </AreaChart>
          ) : activeTab === '24hour' ? (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainProbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} unit={`°${tempUnit}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#0284c7" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name={`Temperature (°${tempUnit})`}
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#hourlyTempGrad)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="rainProb"
                name="Rain Probability (%)"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#rainProbGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0284c7" fontSize={11} tickLine={false} unit="mm" />
              <YAxis yAxisId="right" orientation="right" stroke="#9333ea" fontSize={11} tickLine={false} unit={speedUnit} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="precip" name="Rainfall (mm)" fill="#0284c7" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="wind" name={`Max Wind (${speedUnit})`} fill="#9333ea" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

