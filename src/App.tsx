import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw, Sparkles, HeartHandshake } from 'lucide-react';
import { LocationResult, SavedLocation, SpeedUnit, TempUnit, WeatherData } from './types';
import { fetchWeather, reverseGeocode, POPULAR_CITIES } from './services/weatherService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { WeatherChart } from './components/WeatherChart';
import { Recommendations } from './components/Recommendations';
import { AirQualityUVCard } from './components/AirQualityUVCard';
import { DynamicWeatherBackground } from './components/DynamicWeatherBackground';

const DEFAULT_LOCATION: LocationResult = {
  id: 101,
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
};

const SAVED_LOCATIONS_KEY = 'weather_intel_saved_locations_v1';
const TEMP_UNIT_KEY = 'weather_intel_temp_unit_v1';
const SPEED_UNIT_KEY = 'weather_intel_speed_unit_v1';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationResult>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem(TEMP_UNIT_KEY) as TempUnit) || 'C';
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    return (localStorage.getItem(SPEED_UNIT_KEY) as SpeedUnit) || 'kmh';
  });

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_LOCATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save units & bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(TEMP_UNIT_KEY, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(SPEED_UNIT_KEY, speedUnit);
  }, [speedUnit]);

  useEffect(() => {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Load weather for location
  const loadWeather = useCallback(async (loc: LocationResult, showRefreshSpinner = false) => {
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeather(loc.latitude, loc.longitude);
      setWeatherData(data);
      setCurrentLocation(loc);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError(`Unable to retrieve forecast for ${loc.name}. Please check internet connectivity and try again.`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(DEFAULT_LOCATION);
  }, [loadWeather]);

  // Handle Geolocation
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          await loadWeather(loc);
        } catch (e) {
          setError('Failed to resolve current location address.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        let msg = 'Geolocation permission denied or timed out.';
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = 'Location access was blocked. Please enable geolocation permissions or search manually.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Bookmark handlers
  const isCurrentSaved = savedLocations.some(
    (item) => Math.abs(item.lat - currentLocation.latitude) < 0.01 && Math.abs(item.lon - currentLocation.longitude) < 0.01
  );

  const toggleSaveCurrent = () => {
    if (isCurrentSaved) {
      setSavedLocations((prev) =>
        prev.filter(
          (item) => !(Math.abs(item.lat - currentLocation.latitude) < 0.01 && Math.abs(item.lon - currentLocation.longitude) < 0.01)
        )
      );
    } else {
      const newBookmark: SavedLocation = {
        id: `${currentLocation.latitude}-${currentLocation.longitude}-${Date.now()}`,
        name: currentLocation.name,
        country: currentLocation.country,
        admin1: currentLocation.admin1,
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
      };
      setSavedLocations((prev) => [newBookmark, ...prev]);
    }
  };

  const handleSelectSavedLocation = (saved: SavedLocation) => {
    const loc: LocationResult = {
      id: Date.now(),
      name: saved.name,
      latitude: saved.lat,
      longitude: saved.lon,
      country: saved.country,
      admin1: saved.admin1,
    };
    loadWeather(loc);
  };

  const handleRemoveSavedLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased relative overflow-x-hidden">
      {/* Dynamic Ambient Background Canvas */}
      {weatherData && (
        <DynamicWeatherBackground
          weatherCode={weatherData.current.weather_code}
          isDay={weatherData.current.is_day}
          windSpeed={weatherData.current.wind_speed_10m}
          windDirection={weatherData.current.wind_direction_10m}
          sunrise={weatherData.daily.sunrise?.[0]}
          sunset={weatherData.daily.sunset?.[0]}
          localTime={weatherData.current.time}
        />
      )}

      {/* Navigation Header */}
      <Header
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        onToggleTempUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onToggleSpeedUnit={() => setSpeedUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))}
        onRefresh={() => loadWeather(currentLocation, true)}
        isRefreshing={isRefreshing}
        savedLocations={savedLocations}
        onSelectSavedLocation={handleSelectSavedLocation}
        onRemoveSavedLocation={handleRemoveSavedLocation}
        currentLocationName={currentLocation.name}
        isCurrentSaved={isCurrentSaved}
        onToggleSaveCurrent={toggleSaveCurrent}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar & City Selector */}
        <SearchBar
          onSelectLocation={(loc) => loadWeather(loc)}
          onUseGeolocation={handleUseGeolocation}
          isLocating={isLocating}
          searchError={error}
        />

        {/* Loading State Skeleton */}
        {isLoading && !weatherData && (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4 text-slate-500 min-h-[400px]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold animate-pulse">Fetching high-precision forecast from Open-Meteo...</p>
          </div>
        )}

        {/* Main Dashboard Layout (Stream View) */}
        {weatherData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CurrentWeatherCard
              location={currentLocation}
              weather={weatherData}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            <AirQualityUVCard
              airQuality={weatherData.airQuality}
              uvIndex={weatherData.current.uv_index}
              uvIndexMax={weatherData.daily.uv_index_max?.[0]}
            />

            <ForecastGrid
              daily={weatherData.daily}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <WeatherChart
                  daily={weatherData.daily}
                  hourly={weatherData.hourly}
                  tempUnit={tempUnit}
                  speedUnit={speedUnit}
                />
              </div>

              <div className="lg:col-span-5">
                <Recommendations weather={weatherData} tempUnit={tempUnit} />
              </div>
            </div>
          </div>
        )}

        {/* Error Fallback State */}
        {!isLoading && !weatherData && error && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Weather Data Unavailable</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Open-Meteo API
            </a>
            <span>• Non-commercial Public License</span>
          </p>
          <p className="text-slate-400 text-[11px]">
            Weather Intelligence App • Professional Polish Edition
          </p>
        </div>
      </footer>
    </div>
  );
}
