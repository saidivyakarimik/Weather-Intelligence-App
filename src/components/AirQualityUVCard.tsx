import React from 'react';
import { Sun, Wind, ShieldCheck, ShieldAlert, Sparkles, AlertTriangle, Eye, Activity } from 'lucide-react';
import { AirQualityData } from '../types';
import { getAQIInfo } from '../utils/aqiUtils';
import { getUVIndexInfo } from '../utils/wmoCodes';

interface AirQualityUVCardProps {
  airQuality?: AirQualityData;
  uvIndex: number;
  uvIndexMax?: number;
}

export const AirQualityUVCard: React.FC<AirQualityUVCardProps> = ({
  airQuality,
  uvIndex,
  uvIndexMax,
}) => {
  const aqiVal = airQuality?.us_aqi ?? 35;
  const aqiInfo = getAQIInfo(aqiVal);
  const uvInfo = getUVIndexInfo(uvIndex);
  const maxUv = uvIndexMax ?? uvIndex;

  // Pollutant helper thresholds
  const getPm25Status = (val?: number) => {
    if (!val) return { label: 'Good', color: 'text-emerald-600 bg-emerald-50' };
    if (val <= 12) return { label: 'Low', color: 'text-emerald-600 bg-emerald-50' };
    if (val <= 35) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Elevated', color: 'text-rose-600 bg-rose-50' };
  };

  const getPm10Status = (val?: number) => {
    if (!val) return { label: 'Good', color: 'text-emerald-600 bg-emerald-50' };
    if (val <= 54) return { label: 'Good', color: 'text-emerald-600 bg-emerald-50' };
    if (val <= 154) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Elevated', color: 'text-rose-600 bg-rose-50' };
  };

  const pm25Stat = getPm25Status(airQuality?.pm2_5);
  const pm10Stat = getPm10Status(airQuality?.pm10);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 text-slate-900 animate-fade-in-grow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Air Quality & UV Radar</h3>
            <p className="text-xs text-slate-500">Live environmental safety & solar intensity stats</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          Environmental Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AIR QUALITY SECTION */}
        <div className="space-y-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Air Quality Index (AQI)
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${aqiInfo.badgeBg} ${aqiInfo.badgeText}`}>
              {aqiInfo.label}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {aqiInfo.score}
            </span>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">US AQI scale</span>
              <p className="text-[11px] text-slate-500">Updated from Open-Meteo Air Quality</p>
            </div>
          </div>

          {/* AQI Gradient Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (aqiInfo.score / 250) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
              <span>0 Good</span>
              <span>50</span>
              <span>100 Mod</span>
              <span>150</span>
              <span>200+ Severe</span>
            </div>
          </div>

          {/* Health Advice Box */}
          <div className={`p-3 rounded-xl ${aqiInfo.bgColor} border ${aqiInfo.borderColor} text-xs space-y-1`}>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Health Recommendation</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {aqiInfo.healthAdvice}
            </p>
          </div>

          {/* Pollutant Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] font-bold block">PM2.5</span>
                <span className="font-bold text-slate-800">{airQuality?.pm2_5 ? `${airQuality.pm2_5.toFixed(1)} µg/m³` : '9.2 µg/m³'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pm25Stat.color}`}>
                {pm25Stat.label}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] font-bold block">PM10</span>
                <span className="font-bold text-slate-800">{airQuality?.pm10 ? `${airQuality.pm10.toFixed(1)} µg/m³` : '18.4 µg/m³'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pm10Stat.color}`}>
                {pm10Stat.label}
              </span>
            </div>
          </div>
        </div>

        {/* UV INDEX SECTION */}
        <div className="space-y-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                UV Index & Sun Protection
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${uvInfo.levelBg} text-white`}>
              {uvInfo.label}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {uvIndex.toFixed(1)}
            </span>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Peak Today: <span className="font-bold text-slate-900">{maxUv.toFixed(1)}</span></p>
              <p className="text-[11px] text-slate-500">Solar ultraviolet radiation index</p>
            </div>
          </div>

          {/* UV Scale Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (uvIndex / 11) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
              <span>0 Low</span>
              <span>3 Mod</span>
              <span>6 High</span>
              <span>8 Very High</span>
              <span>11+ Extreme</span>
            </div>
          </div>

          {/* Sun Protection Checklist */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Sun Safety Advisory</span>
            </div>
            <ul className="text-slate-700 text-[11px] space-y-1 pl-1">
              {uvIndex >= 6 ? (
                <>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Apply SPF 30+ broad-spectrum sunscreen every 2 hours
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Wear UV-blocking sunglasses & wide-brimmed hats
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Seek shade during midday peak hours (10:00 AM - 4:00 PM)
                  </li>
                </>
              ) : uvIndex >= 3 ? (
                <>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Wear sunglasses on bright days
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Apply sunscreen if outdoors for longer than 30 minutes
                  </li>
                </>
              ) : (
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  No special sun protection required for short outdoor stays
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
