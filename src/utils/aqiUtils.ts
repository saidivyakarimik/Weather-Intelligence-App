export interface AQIInfo {
  score: number;
  label: string;
  category: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  healthAdvice: string;
  outdoorAdvice: string;
}

export function getAQIInfo(usAqi: number): AQIInfo {
  const score = Math.round(usAqi);

  if (score <= 50) {
    return {
      score,
      label: 'Good',
      category: 'good',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-500',
      badgeText: 'text-white',
      healthAdvice: 'Air quality is satisfactory and poses little or no health risk.',
      outdoorAdvice: 'Ideal condition for outdoor sports, jogging, and walking.',
    };
  }

  if (score <= 100) {
    return {
      score,
      label: 'Moderate',
      category: 'moderate',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-white',
      healthAdvice: 'Air quality is acceptable. However, sensitive individuals may experience minor irritation.',
      outdoorAdvice: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
    };
  }

  if (score <= 150) {
    return {
      score,
      label: 'Unhealthy for Sensitive Groups',
      category: 'sensitive',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      badgeBg: 'bg-orange-500',
      badgeText: 'text-white',
      healthAdvice: 'Members of sensitive groups (children, elderly, asthmatics) may experience health effects.',
      outdoorAdvice: 'Sensitive groups should reduce outdoor exercise and take frequent breaks.',
    };
  }

  if (score <= 200) {
    return {
      score,
      label: 'Unhealthy',
      category: 'unhealthy',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badgeBg: 'bg-rose-500',
      badgeText: 'text-white',
      healthAdvice: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.',
      outdoorAdvice: 'Avoid prolonged outdoor exertion. Consider wearing an N95 mask outdoors.',
    };
  }

  if (score <= 300) {
    return {
      score,
      label: 'Very Unhealthy',
      category: 'very_unhealthy',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badgeBg: 'bg-purple-600',
      badgeText: 'text-white',
      healthAdvice: 'Health alert: The risk of health effects is increased for everyone in the area.',
      outdoorAdvice: 'Stay indoors with air purification enabled. Keep windows and doors shut.',
    };
  }

  return {
    score,
    label: 'Hazardous',
    category: 'hazardous',
    color: 'text-rose-900',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-300',
    badgeBg: 'bg-rose-900',
    badgeText: 'text-white',
    healthAdvice: 'Health warning of emergency conditions. Entire population is likely to be affected.',
    outdoorAdvice: 'Avoid all outdoor activity. Use indoor air purifiers at maximum capacity.',
  };
}
