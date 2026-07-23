import React from 'react';
import { CloudSun, RotateCw, MapPin, Bookmark, Sparkles } from 'lucide-react';
import { SavedLocation, SpeedUnit, TempUnit } from '../types';

interface HeaderProps {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedLocations: SavedLocation[];
  onSelectSavedLocation: (loc: SavedLocation) => void;
  onRemoveSavedLocation: (id: string) => void;
  currentLocationName?: string;
  isCurrentSaved: boolean;
  onToggleSaveCurrent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  onRefresh,
  isRefreshing,
  savedLocations,
  onSelectSavedLocation,
  onRemoveSavedLocation,
  currentLocationName,
  isCurrentSaved,
  onToggleSaveCurrent,
}) => {
  const [showBookmarksDropdown, setShowBookmarksDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Weather<span className="text-blue-600">Intel</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" /> Live Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Open-Meteo High Precision Forecast
            </p>
          </div>
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bookmark Current City Button */}
          {currentLocationName && (
            <button
              id="bookmark-current-location-btn"
              onClick={onToggleSaveCurrent}
              title={isCurrentSaved ? 'Remove from favorites' : 'Bookmark this city'}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isCurrentSaved
                  ? 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isCurrentSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden md:inline">{isCurrentSaved ? 'Saved' : 'Bookmark'}</span>
            </button>
          )}

          {/* Bookmarks Dropdown */}
          <div className="relative">
            <button
              id="bookmarks-dropdown-btn"
              onClick={() => setShowBookmarksDropdown(!showBookmarksDropdown)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all flex items-center gap-1.5"
              title="Saved Cities"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold hidden sm:inline">Favorites</span>
              {savedLocations.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {savedLocations.length}
                </span>
              )}
            </button>

            {showBookmarksDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-100 flex justify-between items-center">
                  <span>Saved Locations</span>
                  <span className="text-[10px] text-slate-400">{savedLocations.length} total</span>
                </div>
                {savedLocations.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-500">
                    No bookmarked locations yet. Click the Bookmark button to save cities!
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-1 mt-1">
                    {savedLocations.map((loc) => (
                      <div
                        key={loc.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 group transition-colors cursor-pointer"
                        onClick={() => {
                          onSelectSavedLocation(loc);
                          setShowBookmarksDropdown(false);
                        }}
                      >
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                            {loc.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country || ''}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSavedLocation(loc.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 text-xs transition-colors"
                          title="Remove bookmark"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Unit Switchers */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="toggle-temp-unit-btn"
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'C'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              id="toggle-temp-unit-f-btn"
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'F'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          <button
            id="toggle-speed-unit-btn"
            onClick={onToggleSpeedUnit}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all"
            title="Toggle Wind Unit"
          >
            {speedUnit}
          </button>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all disabled:opacity-50"
            title="Refresh weather data"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
