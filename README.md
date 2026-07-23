# 🌤️ Weather Intelligence App

A modern, high-performance **Weather Intelligence Dashboard** built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **HTML5 Canvas**. The application features an interactive particle-rendered background inspired by Apple Weather, real-time Open-Meteo weather insights, air quality monitoring, interactive Recharts visualizers, and lifestyle activity recommendations.

---

## ✨ Features

- 🎨 **Dynamic HTML5 Canvas Background**
  - **Physics Particle Engine**: Live rain streaks with splash ripples on impact, soft drifting snowflakes with sine-wave motion, and drifting clouds/fog layers scaled by real-time wind speeds.
  - **Adaptive Sky Lighting**: Automatic sky gradients based on local time and solar cycles (Day, Night, Golden Hour / Sunset / Sunrise, and Overcast Storms).
  - **Celestial Effects**: Glowing sun disk with lens flare scattering, twinkling night stars, and moon halo lighting.
  - **Thunderstorms**: Random jagged lightning bolts and screen-wide atmospheric flash overlays during storm codes.

- 🌡️ **Comprehensive Weather Metrics**
  - Current temperature, "Feels Like" index, relative humidity, dew point, atmospheric pressure, visibility, and wind metrics.
  - 7-Day extended daily forecast with temperature range spectrum bars and precipitation probability.

- 📊 **Interactive Recharts Visualizer**
  - Hourly and 7-day trend graphs for temperature, precipitation probability, and wind speeds.
  - Toggleable chart modes with responsive tooltips.

- 🍃 **Air Quality & UV Radar**
  - Real-time Air Quality Index (PM2.5, PM10, AQI status) with actionable health guidelines.
  - Daily maximum UV Index tracking with sun safety recommendations.

- 🏃 **Lifestyle & Activity Recommendations**
  - Weather-aware suggestions for outdoor workouts, travel commuting, dressing advice, and sun protection.

- 🔍 **Search & Geolocation**
  - Instant city auto-suggest search powered by Open-Meteo Geocoding.
  - Automatic GPS current location lookup via browser Geolocation API.
  - Popular global city shortcuts (London, New York, Tokyo, Paris, Sydney).
  - Flexible Unit Toggles (°C / °F and km/h / mph).

- 💎 **Glassmorphism UI Design**
  - Translucent backdrop blurred cards (`backdrop-blur-md bg-white/90`) layered over the animated canvas sky.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Graphics Engine**: HTML5 Canvas 2D API (`requestAnimationFrame` render loop)
- **Data Source**: Open-Meteo Weather API & Open-Meteo Air Quality API (No API key required)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/weather-intelligence-app.git
   cd weather-intelligence-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode on `http://localhost:3000` |
| `npm run build` | Builds the app for production in the `dist` folder |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs TypeScript type checking |

---

## 📁 Project Structure

```text
├── public/
├── src/
│   ├── components/
│   │   ├── AirQualityUVCard.tsx         # AQI and UV Radar metrics card
│   │   ├── CurrentWeatherCard.tsx       # Main hero weather card
│   │   ├── DynamicWeatherBackground.tsx # HTML5 Canvas physics background engine
│   │   ├── ForecastGrid.tsx             # 7-day extended forecast view
│   │   ├── Header.tsx                   # Search bar, location picker, & unit toggles
│   │   ├── Recommendations.tsx          # Weather lifestyle suggestions
│   │   └── WeatherChart.tsx             # Interactive Recharts temperature graph
│   ├── services/
│   │   └── weatherService.ts            # Open-Meteo API client & geocoding
│   ├── utils/
│   │   └── weatherThemes.ts             # WMO code mappings & theme gradients
│   ├── types.ts                         # Global TypeScript type definitions
│   ├── App.tsx                          # Primary dashboard container
│   ├── main.tsx                         # React entry point
│   └── index.css                        # Global CSS and Tailwind imports
├── metadata.json                        # App metadata configuration
├── package.json                         # Node dependencies & build scripts
├── vite.config.ts                       # Vite server configuration
└── README.md                            # Project documentation
```

---

---

## ☁️ Deployment Guide

This application is designed to be built in **Google AI Studio App Build**, version-controlled in **GitHub**, and automatically deployed via **Cloudflare Pages**.

### Step 1: Export to GitHub from Google AI Studio
1. In Google AI Studio App Build, use the direct **GitHub Connection** feature.
2. Link your approved GitHub repository to push the generated source code (including `package.json`, `src/`, and config files) directly.

### Step 2: Deploy to Cloudflare Pages
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your synchronized GitHub repository and choose the `main` branch.
4. Configure the build settings as follows:
   - **Framework Preset**: `Vite / React`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Node.js Version**: `18.x` or higher (configured under Environment Variables if needed)
5. Click **Save and Deploy**.

### Step 3: SPA Routing Fix (Optional)
If refreshing non-root pages returns a 404, create a `public/_redirects` file with the following rule:
```/index.html 200```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
