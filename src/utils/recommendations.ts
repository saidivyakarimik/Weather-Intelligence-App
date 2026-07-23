import { Recommendation, WeatherData } from '../types';

export interface TravelScore {
  score: number; // 0 to 100
  label: 'Ideal' | 'Good' | 'Moderate' | 'Challenging' | 'Poor';
  color: string;
  bestHours?: string;
  summary: string;
}

export function generateRecommendations(
  weather: WeatherData,
  tempUnit: 'C' | 'F'
): {
  recommendations: Recommendation[];
  travelScore: TravelScore;
  packingList: string[];
} {
  const current = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;

  const recommendations: Recommendation[] = [];
  const packingList: string[] = [];

  const maxTempToday = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const minTempToday = daily.temperature_2m_min[0] ?? current.temperature_2m;
  const precipToday = daily.precipitation_sum[0] ?? current.precipitation;
  const maxPrecipProbToday = daily.precipitation_probability_max?.[0] ?? 0;
  const maxWindToday = daily.wind_speed_10m_max?.[0] ?? current.wind_speed_10m;
  const maxUVToday = daily.uv_index_max?.[0] ?? current.uv_index;

  // 1. Rain & Umbrella Rule
  if (precipToday > 2 || maxPrecipProbToday >= 50 || current.precipitation > 0.5) {
    recommendations.push({
      id: 'rain-alert',
      type: 'rain',
      title: 'Umbrella & Waterproof Gear Advised',
      description: `Precipitation expected today (${precipToday.toFixed(1)}mm, up to ${maxPrecipProbToday}% chance). Keep a compact umbrella or raincoat with you.`,
      iconName: 'Umbrella',
      severity: maxPrecipProbToday > 75 || precipToday > 10 ? 'danger' : 'warning',
    });
    packingList.push('Compact Umbrella / Rain Jacket', 'Water-resistant footwear');
  } else if (maxPrecipProbToday >= 25) {
    recommendations.push({
      id: 'rain-possibility',
      type: 'rain',
      title: 'Slight Chance of Rain',
      description: `Low to moderate chance of light rain (${maxPrecipProbToday}% chance). Outdoor plans are mostly fine, but keep an eye on quick clouds.`,
      iconName: 'CloudRain',
      severity: 'info',
    });
    packingList.push('Light jacket or hood');
  } else {
    recommendations.push({
      id: 'rain-clear',
      type: 'rain',
      title: 'Dry & Clear Conditions',
      description: 'Zero or minimal rain forecasted today. Excellent conditions for outdoor sightseeing and travel.',
      iconName: 'Sun',
      severity: 'success',
    });
  }

  // 2. Clothing & Layering Recommendation
  let clothingTitle = '';
  let clothingDesc = '';
  if (maxTempToday >= 30) {
    clothingTitle = 'Hot & Warm Weather Gear';
    clothingDesc = 'Wear light, breathable cotton or linen fabrics. Stay hydrated and seek shade during peak afternoon hours.';
    packingList.push('Sun hat', 'Breathable light clothing', 'Water bottle');
  } else if (maxTempToday >= 22) {
    clothingTitle = 'Mild & Comfortable Layering';
    clothingDesc = 'Ideal shorts or t-shirt weather with a thin layer for cooler evenings.';
    packingList.push('Light T-shirt', 'Comfortable sneakers');
  } else if (maxTempToday >= 14) {
    clothingTitle = 'Moderate Layers Needed';
    clothingDesc = 'Comfortable with a sweatshirt, hoodie, or casual light denim jacket, especially in shade or breezy spots.';
    packingList.push('Light jacket or sweater', 'Long pants');
  } else if (maxTempToday >= 5) {
    clothingTitle = 'Cool Weather - Insulated Coat';
    clothingDesc = 'Chilly conditions. Wear a warm fleece jacket or trench coat with closed shoes.';
    packingList.push('Warm coat / jacket', 'Layered inner wear');
  } else {
    clothingTitle = 'Freezing Temperatures - Thermal Layers';
    clothingDesc = 'Freezing weather. Wear heavy insulated parka, beanie, scarf, and thermal gloves for outdoor outings.';
    packingList.push('Heavy Winter Parka', 'Thermal gloves & beanie', 'Insulated boots');
  }

  recommendations.push({
    id: 'clothing-guide',
    type: 'clothing',
    title: clothingTitle,
    description: clothingDesc,
    iconName: 'Shirt',
    severity: maxTempToday < 5 || maxTempToday > 32 ? 'warning' : 'info',
  });

  // 3. Sun Protection & UV Alert
  if (maxUVToday >= 6) {
    recommendations.push({
      id: 'uv-warning',
      type: 'uv',
      title: `High UV Index (${maxUVToday.toFixed(1)})`,
      description: 'Strong ultraviolet radiation between 11:00 AM and 3:00 PM. Apply SPF 30+ sunscreen, wear UV-blocking sunglasses.',
      iconName: 'SunDim',
      severity: maxUVToday >= 8 ? 'danger' : 'warning',
    });
    packingList.push('SPF 30+ Sunscreen', 'UV Sunglasses');
  } else if (maxUVToday >= 3) {
    recommendations.push({
      id: 'uv-moderate',
      type: 'uv',
      title: `Moderate UV Index (${maxUVToday.toFixed(1)})`,
      description: 'Moderate sun exposure. Sunscreen recommended if spending over 45 minutes outdoors.',
      iconName: 'Sun',
      severity: 'info',
    });
  }

  // 4. Wind Speed Warning
  if (maxWindToday > 35) {
    recommendations.push({
      id: 'wind-warning',
      type: 'wind',
      title: `High Wind Gusts (${Math.round(maxWindToday)} km/h)`,
      description: 'Breezy to strong winds detected. Secure light outdoor objects, take care when cycling, or driving high-profile vehicles.',
      iconName: 'Wind',
      severity: maxWindToday > 50 ? 'danger' : 'warning',
    });
    packingList.push('Windbreaker jacket');
  }

  // 5. Calculate Golden Outdoor Window from Hourly Forecast
  let bestHourStart = -1;
  let bestHourEnd = -1;
  if (hourly && hourly.time) {
    const todayHours = hourly.time.slice(0, 24);
    for (let i = 8; i < 20; i++) {
      const prob = hourly.precipitation_probability[i] ?? 0;
      const temp = hourly.temperature_2m[i] ?? 20;
      if (prob < 20 && temp >= 12 && temp <= 28) {
        if (bestHourStart === -1) bestHourStart = i;
        bestHourEnd = i;
      }
    }
  }

  let bestHoursText = '';
  if (bestHourStart !== -1 && bestHourEnd !== -1) {
    const formatH = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}${ampm}`;
    };
    bestHoursText = `${formatH(bestHourStart)} - ${formatH(bestHourEnd + 1)}`;
    recommendations.push({
      id: 'golden-window',
      type: 'outdoor',
      title: 'Optimal Outdoor Hours Today',
      description: `Best comfortable outdoor window: ${bestHoursText} with pleasant temperatures and low rain likelihood.`,
      iconName: 'Sparkles',
      severity: 'success',
    });
  }

  // 6. Calculate Travel Score
  let score = 100;
  if (precipToday > 0) score -= Math.min(precipToday * 5, 30);
  if (maxPrecipProbToday > 20) score -= (maxPrecipProbToday - 20) * 0.3;
  if (maxWindToday > 25) score -= (maxWindToday - 25) * 0.8;
  if (maxTempToday > 32) score -= (maxTempToday - 32) * 2;
  if (minTempToday < 5) score -= (5 - minTempToday) * 2;
  if (maxUVToday > 8) score -= 10;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label: TravelScore['label'] = 'Ideal';
  let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  let summary = 'Weather conditions are fantastic for travel, outdoor events, and walking tours.';

  if (score >= 85) {
    label = 'Ideal';
    color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    summary = 'Perfect weather for sightseeing, outdoor sports, and exploration.';
  } else if (score >= 70) {
    label = 'Good';
    color = 'text-sky-500 bg-sky-500/10 border-sky-500/30';
    summary = 'Generally pleasant weather for travel with minor environmental factors.';
  } else if (score >= 50) {
    label = 'Moderate';
    color = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    summary = 'Fair conditions. Plan around possible rain showers or temperature extremes.';
  } else if (score >= 35) {
    label = 'Challenging';
    color = 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    summary = 'Unfavorable weather. Outdoor activities may require adjustment or indoor backups.';
  } else {
    label = 'Poor';
    color = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    summary = 'Adverse weather conditions (heavy rain, high wind, or extreme temperatures). Stay prepared!';
  }

  return {
    recommendations,
    travelScore: {
      score,
      label,
      color,
      bestHours: bestHoursText || '10 AM - 4 PM',
      summary,
    },
    packingList: Array.from(new Set(packingList)),
  };
}
