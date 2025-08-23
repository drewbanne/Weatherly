import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sun, Moon, Search, Wind, Droplet, Sunrise, Sunset, Eye, SunDim, Cloud, Thermometer, Menu, Bell, X, MapPin } from "lucide-react";
import { create } from "zustand";

// -----------------------------------------------------------
// GLOBAL CSS EMBEDDED DIRECTLY (FOR LOCAL FUNCTIONALITY)
// This style block contains all CSS from your index.css and app.css.
// It ensures that all Tailwind classes and custom styles are applied
// when this component runs, bypassing any potential local CSS loading issues.
// -----------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    /* Tailwind Base, Components, Utilities */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Body Background and Font Styling */
    body {
      @apply bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors font-inter antialiased;
    }

    /* Custom Glassmorphism Effect */
    .glass {
      @apply bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl;
    }

    /* Root Container Styling */
    #root {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0; /* Let main content sections handle their own padding */
      text-align: center; /* Default, overridden by component-specific left alignments */
    }

    /* Basic Logo Styling (if used elsewhere) */
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.react:hover {
      filter: drop-shadow(0 0 2em #61dafbaa);
    }

    /* Logo Spin Animation (if used) */
    @keyframes logo-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: no-preference) {
      a:nth-of-type(2) .logo {
        animation: logo-spin infinite 20s linear;
      }
    }

    /* Generic Card/Documentation Styling (if used) */
    .card {
      padding: 2em;
    }
    .read-the-docs {
      color: #888;
    }

    /* Component-Specific Animations */
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }

    /* Sidebar Transitions */
    .sidebar-transition {
      transition: transform 0.3s ease-out;
    }
    .sidebar-open {
      transform: translateX(0%);
    }
    .sidebar-closed {
      transform: translateX(-100%);
    }
  `}</style>
);


// -----------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------
type CurrentWeather = {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  condition: string;
  icon: string;       // full icon URL
  sunrise: string;    // local time string
  sunset: string;     // local time string
  dt: string;         // local date/time
  feels_like: number;
  pressure: number;
  visibility: number;
  cloudsAll: number;
};


// -----------------------------------------------------------
// Zustand Store for Weather State
// -----------------------------------------------------------
interface WeatherState {
  cities: string[];
  addCity: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  cities: ["London", "Cape Town", "Miami"], // Initial mock history
  addCity: (city) =>
    set((state) => {
      const normalizedCity = city.trim();
      const updatedCities = [
        normalizedCity,
        ...state.cities.filter((c) => c.toLowerCase() !== normalizedCity.toLowerCase()),
      ].slice(0, 5);
      return { cities: updatedCities };
    }),
}));


// -----------------------------------------------------------
// Weather Service (API Fetching and Mock Data)
// -----------------------------------------------------------

// IMPORTANT: For local development, load this from your .env file:
// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_KEY = ""; // For Canvas compatibility, leaving as empty string.

// Mock Data (used if API_KEY is empty or for initial development)
const mockWeatherData: CurrentWeather = {
  city: "Accra",
  country: "GH",
  temperature: 28,
  humidity: 77,
  feels_like: 32,
  pressure: 1012,
  windSpeed: 4.12,
  windDeg: 270,
  condition: "partly cloudy",
  icon: `https://openweathermap.org/img/wn/02d@2x.png`,
  sunrise: "6:00 AM",
  sunset: "6:30 PM",
  dt: new Date().toLocaleString(),
  visibility: 10000,
  cloudsAll: 40,
};

const mockForecastData = {
  list: [
    { dt: Date.now() / 1000, main: { temp: 27 }, weather: [{ description: "sunny", icon: "01d" }] },
    { dt: Date.now() / 1000 + 86400, main: { temp: 28 }, weather: [{ description: "clouds", icon: "03d" }] },
    { dt: Date.now() / 1000 + 2 * 86400, main: { temp: 26 }, weather: [{ description: "rain", icon: "09d" }] },
    { dt: Date.now() / 1000 + 3 * 86400, main: { temp: 29 }, weather: [{ description: "clear sky", icon: "01d" }] },
    { dt: Date.now() / 1000 + 4 * 86400, main: { temp: 27 }, weather: [{ description: "light rain", icon: "10d" }] },
    { dt: Date.now() / 1000 + 5 * 86400, main: { temp: 25 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 3 * 3600, main: { temp: 26 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 6 * 3600, main: { temp: 27 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 9 * 3600, main: { temp: 28 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 12 * 3600, main: { temp: 29 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 15 * 3600, main: { temp: 28 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 18 * 3600, main: { temp: 27 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 21 * 3600, main: { temp: 26 }, weather: [{ description: "scattered clouds", icon: "02d" }] },
  ],
};


export const fetchCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  if (!API_KEY) {
    console.warn("API Key is missing for fetchCurrentWeather. Using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const mockCity = city.toLowerCase();
    if (mockCity === "london") return { ...mockWeatherData, city: "London", country: "GB", temperature: 15, feels_like: 12, icon: `https://openweathermap.org/img/wn/04d@2x.png` };
    if (mockCity === "cape town") return { ...mockWeatherData, city: "Cape Town", country: "ZA", temperature: 22, feels_like: 20, icon: `https://openweathermap.org/img/wn/01d@2x.png` };
    if (mockCity === "miami") return { ...mockWeatherData, city: "Miami", country: "US", temperature: 30, feels_like: 35, icon: `https://openweathermap.org/img/wn/01d@2x.png` };
    if (mockCity === "accra") return { ...mockWeatherData, city: "Accra", country: "GH", temperature: 28, feels_like: 32, icon: `https://openweathermap.org/img/wn/02d@2x.png` };
    throw new Error("API Key missing or City not found (using mock data)");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "City not found");
  }
  const data = await res.json();
  const toLocalTime = (unix: number) => new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg ?? 0,
    condition: data.weather?.[0]?.description ?? "—",
    icon: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`,
    sunrise: toLocalTime(data.sys.sunrise),
    sunset: toLocalTime(data.sys.sunset),
    dt: new Date(data.dt * 1000).toLocaleString(),
    feels_like: Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    visibility: data.visibility,
    cloudsAll: data.clouds.all,
  };
};

export const fetchForecast = async (city: string) => {
  if (!API_KEY) {
    console.warn("API Key is missing for fetchForecast. Using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockForecastData;
  }
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Forecast not found");
  }
  const data = await res.json();
  return data;
};


// -----------------------------------------------------------
// Reusable Components
// -----------------------------------------------------------

// Landing Component
interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-center p-6">
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">🌤️ Weatherly</h1>
      <p className="text-xl mb-8">Your real-time weather companion. Check forecasts by city!</p>
      <button
        id="getStartedBtn"
        onClick={onStart}
        className="px-8 py-3 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:bg-blue-100 transition-transform transform hover:scale-105"
      >
        Get Started
      </button>
    </div>
  );
};

// Sidebar Component
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  currentCityName: string;
  currentCountry: string;
  onSearch: (city: string) => void;
  isLoading: boolean;
  error: string;
  cityInput: string;
  setCityInput: (city: string) => void;
  searchHistory: string[];
  onSelectHistoryCity: (city: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  currentCityName,
  currentCountry,
  onSearch,
  isLoading,
  error,
  cityInput,
  setCityInput,
  searchHistory,
  onSelectHistoryCity,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onSearch(cityInput.trim());
      setCityInput("");
      onClose(); // Close sidebar after search
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform sidebar-transition ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        } md:hidden flex flex-col p-4 space-y-6 text-left`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Weatherly</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close menu">
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* User Info & Location */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">Hi, Drew</p>
          <p className="text-md text-gray-600 dark:text-gray-300">Good Morning</p>
          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-200">{currentCityName}, {currentCountry}</span>
          </p>
        </div>

        {/* Mobile Search Bar (Moved here) */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search city in sidebar..."
            aria-label="Search city in sidebar"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Search weather"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>}
        {isLoading && <p className="text-blue-500 text-sm mt-1">Loading...</p>}

        {/* Recent Searches (History List) in Sidebar */}
        {searchHistory.length > 0 && (
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white">Recent Searches</h3>
                <ul className="space-y-2">
                    {searchHistory.map((city, i) => (
                        <li key={i}>
                            <button
                                onClick={() => onSelectHistoryCity(city)}
                                className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white text-sm"
                            >
                                {city}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Navigation Links (Example) */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                About
              </a>
            </li>
          </ul>
        </nav>

        {/* Dark Mode Toggle at the bottom of the sidebar */}
        <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-md"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
          </button>
        </div>
      </div>
    </>
  );
};


// TopBar Component
interface TopBarProps {
  onSearch: (city: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  currentCityName: string;
  currentCountry: string;
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, darkMode, setDarkMode, currentCityName, currentCountry, onToggleSidebar }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 md:px-8 shadow-md glass sticky top-0 z-50 rounded-b-xl">
      {/* Left section: Hamburger menu (mobile), Greeting (desktop), Location (desktop) */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden" aria-label="Open menu">
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="hidden md:block text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">Hi, Drew</p>
          <p className="font-semibold text-lg">Good Morning</p>
          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-200">{currentCityName}, {currentCountry}</span>
          </p>
        </div>
      </div>

      {/* Center: Search input - only visible on medium and larger screens */}
      <form onSubmit={handleSubmit} className="relative flex-grow mx-4 max-w-lg hidden md:block">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search your location..."
          aria-label="Search location"
        />
      </form>
      
      {/* Right section: Dark mode toggle (desktop), user profile, notifications */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-md hidden md:block"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-inner hidden sm:block">
          <img src="https://placehold.co/40x40/000000/FFFFFF?text=JD" alt="User avatar" className="w-full h-full object-cover" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block" aria-label="Notifications">
           <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </header>
  );
};


// WeatherNowCard Component
const WeatherNowCard: React.FC<{ weather: CurrentWeather }> = ({ weather }) => {
  if (!weather) return null;

  const windSpeedKmh = (weather.windSpeed * 3.6).toFixed(2);

  return (
    <div className="p-6 rounded-2xl glass text-center flex flex-col items-center animate-fade-in">
      <div className="text-left w-full">
        <p className="text-gray-600 dark:text-gray-300 text-sm">{new Date(weather.dt).toLocaleDateString("en-US", { weekday: "long" })}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{weather.dt}</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <p className="text-7xl font-bold my-4 text-gray-800 dark:text-white">
          {weather.temperature}°C
        </p>
        {weather.feels_like !== undefined && (
          <p className="text-lg text-gray-500 dark:text-gray-400 -mt-2 mb-2">
            Feels like {weather.feels_like}°C
          </p>
        )}
        <img src={weather.icon} alt={weather.condition} className="w-28 h-28 object-contain mb-4" />
        <p className="capitalize text-xl text-gray-700 dark:text-gray-200">{weather.condition}</p>
        <div className="flex gap-6 mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {windSpeedKmh} km/h</p>
        </div>
      </div>
    </div>
  );
};


// Today's Highlight Component
const HighlightsCard: React.FC<{ weather: CurrentWeather }> = ({ weather }) => {
  if (!weather) return null;

  const uvIndexValue = 4; // Static for now
  const uvIndexStatus = uvIndexValue < 3 ? "Low" : uvIndexValue < 6 ? "Moderate" : "High";
  const visibilityKm = (weather.visibility / 1000).toFixed(0);

  return (
    <div className="p-6 rounded-2xl glass animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
        Today's Highlight
        <span className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">See All</span>
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Wind Status */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Wind className="w-6 h-6 text-blue-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Wind Status</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{ (weather.windSpeed * 3.6).toFixed(1) } km/h</p>
        </div>
        {/* Humidity */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Droplet className="w-6 h-6 text-blue-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Humidity</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.humidity}%</p>
        </div>
        {/* Pressure */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Thermometer className="w-6 h-6 text-yellow-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Pressure</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.pressure} hPa</p>
        </div>
        {/* Clouds */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Cloud className="w-6 h-6 text-gray-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Clouds</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.cloudsAll}%</p>
        </div>
        {/* Sunrise */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Sunrise className="w-6 h-6 text-orange-400 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Sunrise</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.sunrise}</p>
        </div>
        {/* UV Index */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <SunDim className="w-6 h-6 text-purple-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">UV Index</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{uvIndexValue} <span className="text-sm font-normal">({uvIndexStatus})</span></p>
        </div>
        {/* Visibility */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Eye className="w-6 h-6 text-green-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Visibility</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{visibilityKm} km</p>
        </div>
        {/* Sunset */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
          <Sunset className="w-6 h-6 text-red-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Sunset</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.sunset}</p>
        </div>
      </div>
    </div>
  );
};


// ForecastCard Component
const ForecastCard = ({ forecast }) => {
  if (!forecast?.list) return null;

  const dailyForecasts = forecast.list.filter((_item, i) => i % 8 === 0).slice(0, 5);

  return (
    <div className="p-6 rounded-2xl glass animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
        5-Day Forecast
        <span className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">See All</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((day, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-center flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <p className="font-medium text-gray-800 dark:text-white mb-1">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} className="w-16 h-16 object-contain mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(day.main.temp)}°C</p>
            <p className="capitalize text-sm text-gray-700 dark:text-gray-300">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


// -----------------------------------------------------------
// Main Dashboard Component
// -----------------------------------------------------------

const Dashboard = () => {
  const [city, setCity] = useState("Accra");
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">("landing");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cityInputInSidebar, setCityInputInSidebar] = useState("");


  // Use Zustand store for search history
  const searchHistory = useWeatherStore((state) => state.cities);
  const addCityToStore = useWeatherStore((state) => state.addCity);


  // Memoize handleSearch to prevent unnecessary re-renders and satisfy useEffect dependency
  const handleSearch = useCallback(async (searchCity = city) => {
    setIsLoading(true);
    setError("");
    try {
      const weatherData = await fetchCurrentWeather(searchCity);
      const forecastData = await fetchForecast(searchCity);
      setWeather(weatherData);
      setForecast(forecastData);
      addCityToStore(searchCity);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [city, addCityToStore]);


  // Function to handle selecting a city from history
  const handleSelectHistoryCity = useCallback((selectedCity) => {
    setCity(selectedCity);
    setIsSidebarOpen(false);
  }, []);


  // Effect to fetch initial weather data and toggle dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    
    if (currentPage === "dashboard") {
      handleSearch();
    }
  }, [darkMode, handleSearch, currentPage]);


  const handleStartDashboard = useCallback(() => {
    setCurrentPage("dashboard");
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);


  if (currentPage === "landing") {
    return <Landing onStart={handleStartDashboard} />;
  }


  return (
    <div className="min-h-screen text-gray-900 dark:text-white relative overflow-hidden">
      <GlobalStyles /> {/* ⭐ Re-integrated GlobalStyles for self-contained functionality ⭐ */}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentCityName={weather?.city || city}
        currentCountry={weather?.country || "Ghana"}
        onSearch={handleSearch}
        isLoading={isLoading}
        error={error}
        cityInput={cityInputInSidebar}
        setCityInput={setCityInputInSidebar}
        searchHistory={searchHistory}
        onSelectHistoryCity={handleSelectHistoryCity}
      />

      {/* Top bar using the new TopBar component */}
      <TopBar 
        onSearch={(newCity) => setCity(newCity)}
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        currentCityName={weather?.city || city}
        currentCountry={weather?.country || "Ghana"}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main content wrapper */}
      <div className={`transition-transform duration-300 ease-out ${isSidebarOpen ? 'md:ml-0' : ''}`}>
        {/* Loading/Error overlay */}
        {(isLoading || error) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
              {isLoading && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">Loading weather data...</p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center">
                  <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
                  <button
                    onClick={() => setError("")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content grid */}
        <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <section className="lg:col-span-1 space-y-6">
            {/* Mobile greeting and location */}
            <div className="flex flex-col items-start px-4 md:hidden text-left" style={{ visibility: isSidebarOpen ? 'hidden' : 'visible' }}>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hi, Drew</p>
              <p className="font-semibold text-lg">Good Morning</p>
              <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-200">{weather ? `${weather.city}, ${weather.country}` : "Search for a city"}</span>
              </p>
            </div>
            
            {weather && <WeatherNowCard weather={weather} />}
            {weather && <HighlightsCard weather={weather} />}
          </section>

          {/* Right Column */}
          <section className="lg:col-span-2 space-y-6">
            {forecast?.list && <ForecastCard forecast={forecast} />}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
