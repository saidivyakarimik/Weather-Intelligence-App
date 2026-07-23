import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudRainWind,
  LucideIcon
} from 'lucide-react';

export interface WMOCodeInfo {
  label: string;
  description: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: LucideIcon;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
}

export const WMO_CODES: Record<number, WMOCodeInfo> = {
  0: {
    label: 'Clear Sky',
    description: 'Sunny and clear skies with zero cloud obstruction',
    category: 'clear',
    icon: Sun,
    bgGradient: 'from-sky-500 via-blue-600 to-indigo-700',
    cardBg: 'bg-sky-500/10 border-sky-400/20',
    accentColor: 'text-amber-400',
  },
  1: {
    label: 'Mainly Clear',
    description: 'Mostly sunny with few scattered high clouds',
    category: 'clear',
    icon: CloudSun,
    bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
    cardBg: 'bg-sky-400/10 border-sky-300/20',
    accentColor: 'text-amber-300',
  },
  2: {
    label: 'Partly Cloudy',
    description: 'Sun alternating with fair weather cloud coverage',
    category: 'cloudy',
    icon: CloudSun,
    bgGradient: 'from-blue-500 via-indigo-600 to-slate-700',
    cardBg: 'bg-blue-500/10 border-blue-400/20',
    accentColor: 'text-sky-300',
  },
  3: {
    label: 'Overcast',
    description: 'Dense cloud ceiling covering the entire sky',
    category: 'cloudy',
    icon: Cloud,
    bgGradient: 'from-slate-600 via-slate-700 to-slate-800',
    cardBg: 'bg-slate-600/10 border-slate-500/20',
    accentColor: 'text-slate-300',
  },
  45: {
    label: 'Foggy',
    description: 'Reduced visibility due to dense ground level mist',
    category: 'fog',
    icon: CloudFog,
    bgGradient: 'from-slate-500 via-zinc-600 to-stone-700',
    cardBg: 'bg-slate-500/10 border-slate-400/20',
    accentColor: 'text-zinc-300',
  },
  48: {
    label: 'Depositing Rime Fog',
    description: 'Freezing fog forming frost layers on surface objects',
    category: 'fog',
    icon: CloudFog,
    bgGradient: 'from-teal-600 via-slate-700 to-slate-800',
    cardBg: 'bg-teal-500/10 border-teal-400/20',
    accentColor: 'text-teal-300',
  },
  51: {
    label: 'Light Drizzle',
    description: 'Fine, light mist-like precipitation',
    category: 'drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-blue-600 via-cyan-700 to-slate-800',
    cardBg: 'bg-cyan-500/10 border-cyan-400/20',
    accentColor: 'text-cyan-300',
  },
  53: {
    label: 'Moderate Drizzle',
    description: 'Steady fine rainfall with full wet ground coverage',
    category: 'drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-blue-700 via-cyan-800 to-slate-900',
    cardBg: 'bg-cyan-600/10 border-cyan-500/20',
    accentColor: 'text-cyan-400',
  },
  55: {
    label: 'Dense Drizzle',
    description: 'Heavy fine precipitation restricting visibility',
    category: 'drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-indigo-800 via-blue-900 to-slate-900',
    cardBg: 'bg-indigo-500/10 border-indigo-400/20',
    accentColor: 'text-blue-300',
  },
  56: {
    label: 'Freezing Drizzle',
    description: 'Sub-zero fine drizzle icing over cold ground',
    category: 'drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-cyan-800 via-slate-800 to-blue-950',
    cardBg: 'bg-cyan-500/10 border-cyan-400/20',
    accentColor: 'text-cyan-200',
  },
  57: {
    label: 'Heavy Freezing Drizzle',
    description: 'Dense icy precipitation forming black ice',
    category: 'drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-cyan-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-cyan-600/10 border-cyan-500/20',
    accentColor: 'text-cyan-100',
  },
  61: {
    label: 'Slight Rain',
    description: 'Light continuous rainfall',
    category: 'rain',
    icon: CloudRain,
    bgGradient: 'from-blue-600 via-indigo-700 to-slate-800',
    cardBg: 'bg-blue-500/10 border-blue-400/20',
    accentColor: 'text-blue-300',
  },
  63: {
    label: 'Moderate Rain',
    description: 'Steady rainfall with pooling puddles',
    category: 'rain',
    icon: CloudRain,
    bgGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    cardBg: 'bg-blue-600/10 border-blue-500/20',
    accentColor: 'text-blue-400',
  },
  65: {
    label: 'Heavy Rain',
    description: 'Torrential downpour with high runoff',
    category: 'rain',
    icon: CloudRainWind,
    bgGradient: 'from-blue-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-blue-700/10 border-blue-600/20',
    accentColor: 'text-blue-300',
  },
  66: {
    label: 'Light Freezing Rain',
    description: 'Rain freezing instantly upon surface contact',
    category: 'rain',
    icon: CloudRain,
    bgGradient: 'from-sky-800 via-slate-800 to-indigo-950',
    cardBg: 'bg-sky-500/10 border-sky-400/20',
    accentColor: 'text-sky-200',
  },
  67: {
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain causing dangerous glaze ice',
    category: 'rain',
    icon: CloudRainWind,
    bgGradient: 'from-slate-800 via-indigo-950 to-zinc-950',
    cardBg: 'bg-slate-700/10 border-slate-600/20',
    accentColor: 'text-sky-100',
  },
  71: {
    label: 'Slight Snow',
    description: 'Gentle snowfall with light accumulation',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-sky-700 via-indigo-800 to-slate-900',
    cardBg: 'bg-sky-400/10 border-sky-300/20',
    accentColor: 'text-sky-200',
  },
  73: {
    label: 'Moderate Snow',
    description: 'Steady snowfall forming steady snowpack',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-slate-700 via-blue-900 to-zinc-900',
    cardBg: 'bg-slate-500/10 border-slate-400/20',
    accentColor: 'text-sky-100',
  },
  75: {
    label: 'Heavy Snow',
    description: 'Intense snow storm with rapid accumulation',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-indigo-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-indigo-600/10 border-indigo-500/20',
    accentColor: 'text-sky-100',
  },
  77: {
    label: 'Snow Grains',
    description: 'Tiny ice pellets falling from low clouds',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-slate-600 via-slate-800 to-zinc-900',
    cardBg: 'bg-slate-500/10 border-slate-400/20',
    accentColor: 'text-slate-200',
  },
  80: {
    label: 'Light Rain Showers',
    description: 'Brief scattered rain showers with sunny intervals',
    category: 'rain',
    icon: CloudRain,
    bgGradient: 'from-sky-500 via-blue-700 to-slate-800',
    cardBg: 'bg-sky-500/10 border-sky-400/20',
    accentColor: 'text-sky-300',
  },
  81: {
    label: 'Moderate Rain Showers',
    description: 'Passing heavier downpours with quick clearups',
    category: 'rain',
    icon: CloudRain,
    bgGradient: 'from-blue-600 via-indigo-800 to-slate-900',
    cardBg: 'bg-blue-500/10 border-blue-400/20',
    accentColor: 'text-blue-300',
  },
  82: {
    label: 'Violent Rain Showers',
    description: 'Sudden intense precipitation bursts',
    category: 'rain',
    icon: CloudRainWind,
    bgGradient: 'from-blue-900 via-slate-900 to-stone-950',
    cardBg: 'bg-blue-800/10 border-blue-700/20',
    accentColor: 'text-blue-200',
  },
  85: {
    label: 'Light Snow Showers',
    description: 'Passing light snow flurries',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-sky-800 via-slate-800 to-slate-900',
    cardBg: 'bg-sky-500/10 border-sky-400/20',
    accentColor: 'text-sky-200',
  },
  86: {
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls with sudden visibility drops',
    category: 'snow',
    icon: CloudSnow,
    bgGradient: 'from-indigo-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-indigo-600/10 border-indigo-500/20',
    accentColor: 'text-sky-100',
  },
  95: {
    label: 'Thunderstorm',
    description: 'Lightning and thunder activity with rain',
    category: 'thunderstorm',
    icon: CloudLightning,
    bgGradient: 'from-purple-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-purple-600/10 border-purple-500/20',
    accentColor: 'text-amber-300',
  },
  96: {
    label: 'Thunderstorm with Light Hail',
    description: 'Electrical storm with small ice hail pellets',
    category: 'thunderstorm',
    icon: CloudLightning,
    bgGradient: 'from-purple-950 via-slate-900 to-black',
    cardBg: 'bg-purple-700/10 border-purple-600/20',
    accentColor: 'text-amber-400',
  },
  99: {
    label: 'Severe Thunderstorm with Heavy Hail',
    description: 'Dangerous electrical storm with damaging hail bursts',
    category: 'thunderstorm',
    icon: CloudLightning,
    bgGradient: 'from-violet-950 via-zinc-950 to-black',
    cardBg: 'bg-violet-800/10 border-violet-700/20',
    accentColor: 'text-rose-400',
  },
};

export function getWMOCodeInfo(code: number): WMOCodeInfo {
  return (
    WMO_CODES[code] || {
      label: 'Unknown Weather',
      description: 'Weather condition code is currently undetermined',
      category: 'cloudy',
      icon: Cloud,
      bgGradient: 'from-slate-600 via-slate-700 to-slate-800',
      cardBg: 'bg-slate-600/10 border-slate-500/20',
      accentColor: 'text-slate-300',
    }
  );
}

// Unit conversion helpers
export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertSpeed(kmh: number, unit: 'kmh' | 'mph'): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function getWindDirectionText(degree: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degree % 360) / 22.5) % 16;
  return directions[index];
}

export function getUVIndexInfo(uvIndex: number): { label: string; color: string; levelBg: string } {
  if (uvIndex <= 2) return { label: 'Low', color: 'text-emerald-500', levelBg: 'bg-emerald-500' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-amber-500', levelBg: 'bg-amber-500' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-orange-500', levelBg: 'bg-orange-500' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-rose-500', levelBg: 'bg-rose-500' };
  return { label: 'Extreme', color: 'text-purple-600', levelBg: 'bg-purple-600' };
}
