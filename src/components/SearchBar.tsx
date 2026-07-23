import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Navigation, MapPin } from 'lucide-react';
import { LocationResult } from '../types';
import { searchCity, POPULAR_CITIES } from '../services/weatherService';

interface SearchBarProps {
  onSelectLocation: (loc: LocationResult) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  searchError?: string | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onUseGeolocation,
  isLocating,
  searchError,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setErrorText(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setErrorText(null);
      try {
        const searchRes = await searchCity(query);
        setResults(searchRes);
        if (searchRes.length === 0) {
          setErrorText(`No city found matching "${query}". Check spelling or try a major city.`);
        }
      } catch (e) {
        setErrorText('Failed to search locations. Please check internet connection.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationResult) => {
    onSelectLocation(loc);
    setQuery(`${loc.name}${loc.country ? `, ${loc.country}` : ''}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setErrorText(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div ref={containerRef} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search any city or country (e.g., Tokyo, San Francisco, London)..."
            className="w-full pl-12 pr-28 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-full text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {isLoading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin mr-1" />}
            {query && !isLoading && (
              <button
                id="clear-search-btn"
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="use-geolocation-btn"
              onClick={onUseGeolocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-all disabled:opacity-50"
              title="Use current location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'GPS'}</span>
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (results.length > 0 || errorText || isLoading) && (
          <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50 p-2 space-y-1">
            {isLoading && (
              <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                Searching cities database...
              </div>
            )}

            {!isLoading && errorText && (
              <div className="px-4 py-3 text-xs text-amber-800 bg-amber-50 rounded-xl border border-amber-200">
                {errorText}
              </div>
            )}

            {!isLoading &&
              results.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.admin1 ? `${item.admin1}, ` : ''}
                        {item.country || 'Region'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Global Error Banner */}
      {searchError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>⚠️ {searchError}</span>
        </div>
      )}

      {/* Popular Cities Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          Popular:
        </span>
        <div className="flex items-center gap-1.5">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectLocation(city)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/70 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300/50 hover:border-blue-200 whitespace-nowrap transition-all shadow-2xs"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
