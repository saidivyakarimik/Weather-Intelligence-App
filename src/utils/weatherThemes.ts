export interface WeatherTheme {
  code: number;
  isDay: boolean;
  themeName: string;
  themeLabel: string;
  bgGradient: string; // Background for whole app / main canvas
  accentBadge: string;
  heroCardBg: string;
  isDarkTheme: boolean;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  skyDecor: 'sun' | 'moon' | 'cloud' | 'rain' | 'thunder' | 'snow' | 'fog';
}

export function getWeatherTheme(weatherCode: number, isDay: number): WeatherTheme {
  const day = isDay === 1;

  // Clear Sky / Mostly Clear
  if (weatherCode === 0 || weatherCode === 1) {
    if (day) {
      return {
        code: weatherCode,
        isDay: true,
        themeName: 'sunny-day',
        themeLabel: 'Sunny Clear Sky',
        bgGradient: 'bg-gradient-to-br from-amber-500/10 via-sky-500/10 to-blue-600/15',
        accentBadge: 'bg-amber-100 text-amber-800 border-amber-300',
        heroCardBg: 'bg-white/90 backdrop-blur-md border-amber-200/60',
        isDarkTheme: false,
        textColor: 'text-slate-900',
        subtextColor: 'text-slate-600',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        skyDecor: 'sun',
      };
    } else {
      return {
        code: weatherCode,
        isDay: false,
        themeName: 'clear-night',
        themeLabel: 'Starry Clear Night',
        bgGradient: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
        accentBadge: 'bg-indigo-900/80 text-indigo-200 border-indigo-700/60',
        heroCardBg: 'bg-slate-900/90 backdrop-blur-md border-slate-800',
        isDarkTheme: true,
        textColor: 'text-slate-100',
        subtextColor: 'text-slate-400',
        cardBg: 'bg-slate-900',
        cardBorder: 'border-slate-800',
        skyDecor: 'moon',
      };
    }
  }

  // Partly Cloudy / Cloudy
  if (weatherCode === 2 || weatherCode === 3) {
    if (day) {
      return {
        code: weatherCode,
        isDay: true,
        themeName: 'cloudy-day',
        themeLabel: 'Cloudy Horizon',
        bgGradient: 'bg-gradient-to-br from-sky-500/10 via-slate-400/10 to-blue-500/10',
        accentBadge: 'bg-sky-100 text-sky-800 border-sky-300',
        heroCardBg: 'bg-white/90 backdrop-blur-md border-slate-200',
        isDarkTheme: false,
        textColor: 'text-slate-900',
        subtextColor: 'text-slate-600',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        skyDecor: 'cloud',
      };
    } else {
      return {
        code: weatherCode,
        isDay: false,
        themeName: 'cloudy-night',
        themeLabel: 'Overcast Night',
        bgGradient: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950',
        accentBadge: 'bg-slate-800 text-slate-300 border-slate-700',
        heroCardBg: 'bg-slate-900/90 backdrop-blur-md border-slate-800',
        isDarkTheme: true,
        textColor: 'text-slate-100',
        subtextColor: 'text-slate-400',
        cardBg: 'bg-slate-900',
        cardBorder: 'border-slate-800',
        skyDecor: 'cloud',
      };
    }
  }

  // Fog / Mist
  if (weatherCode === 45 || weatherCode === 48) {
    return {
      code: weatherCode,
      isDay: day,
      themeName: 'foggy',
      themeLabel: 'Atmospheric Fog',
      bgGradient: 'bg-gradient-to-br from-zinc-500/15 via-slate-400/10 to-stone-500/15',
      accentBadge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      heroCardBg: 'bg-white/90 backdrop-blur-md border-zinc-200',
      isDarkTheme: false,
      textColor: 'text-slate-900',
      subtextColor: 'text-slate-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      skyDecor: 'fog',
    };
  }

  // Rain / Drizzle / Showers
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    if (day) {
      return {
        code: weatherCode,
        isDay: true,
        themeName: 'rainy-day',
        themeLabel: 'Rainy Atmosphere',
        bgGradient: 'bg-gradient-to-br from-blue-600/15 via-sky-500/10 to-slate-600/15',
        accentBadge: 'bg-blue-100 text-blue-800 border-blue-300',
        heroCardBg: 'bg-white/90 backdrop-blur-md border-blue-200',
        isDarkTheme: false,
        textColor: 'text-slate-900',
        subtextColor: 'text-slate-600',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        skyDecor: 'rain',
      };
    } else {
      return {
        code: weatherCode,
        isDay: false,
        themeName: 'rainy-night',
        themeLabel: 'Rainy Evening',
        bgGradient: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
        accentBadge: 'bg-blue-900/80 text-blue-200 border-blue-700',
        heroCardBg: 'bg-slate-900/90 backdrop-blur-md border-slate-800',
        isDarkTheme: true,
        textColor: 'text-slate-100',
        subtextColor: 'text-slate-400',
        cardBg: 'bg-slate-900',
        cardBorder: 'border-slate-800',
        skyDecor: 'rain',
      };
    }
  }

  // Snow / Sleet
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) {
    return {
      code: weatherCode,
      isDay: day,
      themeName: 'snowy',
      themeLabel: 'Frosty Snowfall',
      bgGradient: 'bg-gradient-to-br from-cyan-500/15 via-blue-400/10 to-sky-600/15',
      accentBadge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      heroCardBg: 'bg-white/90 backdrop-blur-md border-cyan-200',
      isDarkTheme: false,
      textColor: 'text-slate-900',
      subtextColor: 'text-slate-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      skyDecor: 'snow',
    };
  }

  // Thunderstorm
  if (weatherCode >= 95) {
    return {
      code: weatherCode,
      isDay: day,
      themeName: 'thunderstorm',
      themeLabel: 'Thunderstorm Storm cell',
      bgGradient: 'bg-gradient-to-br from-purple-950/25 via-slate-900/30 to-indigo-950/25',
      accentBadge: 'bg-purple-900/80 text-purple-200 border-purple-700',
      heroCardBg: 'bg-slate-900/90 backdrop-blur-md border-purple-900/50',
      isDarkTheme: true,
      textColor: 'text-slate-100',
      subtextColor: 'text-slate-400',
      cardBg: 'bg-slate-900',
      cardBorder: 'border-slate-800',
      skyDecor: 'thunder',
    };
  }

  // Default Fallback Theme
  return {
    code: weatherCode,
    isDay: day,
    themeName: 'default-day',
    themeLabel: 'Live Weather Atmosphere',
    bgGradient: 'bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-indigo-500/10',
    accentBadge: 'bg-blue-100 text-blue-800 border-blue-300',
    heroCardBg: 'bg-white/90 backdrop-blur-md border-slate-200',
    isDarkTheme: false,
    textColor: 'text-slate-900',
    subtextColor: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    skyDecor: 'sun',
  };
}
