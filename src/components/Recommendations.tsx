import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Umbrella, 
  Shirt, 
  SunDim, 
  Wind, 
  CheckCircle2, 
  Circle,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { Recommendation, TempUnit, WeatherData } from '../types';
import { generateRecommendations } from '../utils/recommendations';

interface RecommendationsProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  weather,
  tempUnit,
}) => {
  const { recommendations, travelScore, packingList } = generateRecommendations(weather, tempUnit);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Umbrella':
        return Umbrella;
      case 'Shirt':
        return Shirt;
      case 'SunDim':
      case 'Sun':
        return SunDim;
      case 'Wind':
        return Wind;
      case 'Sparkles':
        return Sparkles;
      default:
        return Info;
    }
  };

  const getSeverityStyle = (severity: Recommendation['severity']) => {
    switch (severity) {
      case 'danger':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-200';
      case 'warning':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-200';
      case 'success':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200';
      default:
        return 'bg-blue-500/15 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Smart Travel Advisory</h3>
            <p className="text-xs text-slate-400">Environmental & clothing intelligence</p>
          </div>
        </div>

        {/* Travel Score Badge */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-2xl border ${travelScore.color} flex items-center gap-2 shadow-sm`}>
            <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Outdoor Score</p>
              <p className="text-xs font-black">{travelScore.score}/100 • {travelScore.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white">Advisory Summary</p>
          <p className="text-xs text-slate-300 leading-relaxed">{travelScore.summary}</p>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((rec) => {
          const IconComp = getIconComponent(rec.iconName);
          const style = getSeverityStyle(rec.severity);

          return (
            <div
              key={rec.id}
              className={`p-3.5 rounded-2xl border ${style} backdrop-blur-md transition-all duration-200 hover:scale-[1.01] space-y-1.5`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-slate-950/60 border border-white/10">
                  <IconComp className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs font-bold text-white">{rec.title}</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pl-1">
                {rec.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Packing & Preparation Checklist */}
      {packingList.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Smart Packing Essentials</span>
              <span className="text-[10px] lowercase font-normal text-slate-500">
                ({Object.values(checkedItems).filter(Boolean).length}/{packingList.length} ready)
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {packingList.map((item) => {
              const isChecked = !!checkedItems[item];
              return (
                <button
                  key={item}
                  onClick={() => toggleCheck(item)}
                  className={`px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2.5 ${
                    isChecked
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 line-through opacity-75'
                      : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                  }`}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
