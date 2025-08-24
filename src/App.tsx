import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sun, Moon, Search, Wind, Droplet, Sunrise, Sunset, Eye, SunDim, Cloud, Thermometer, Menu, Bell, X, MapPin, Upload, LocateFixed } from "lucide-react"; // Added LocateFixed icon
import { create } from "zustand";

// -----------------------------------------------------------
// GLOBAL CSS EMBEDDED DIRECTLY COMPONENT (GlobalStyles) HAS BEEN REMOVED.
// Tailwind CSS is now loaded via CDN in index.html for guaranteed styling.
// -----------------------------------------------------------


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
  sunrise: string;    // local time string for the city
  sunset: string;     // local time string for the city
  dt: string;         // local date/time for the city
  feels_like: number;
  pressure: number;
  visibility: number;
  cloudsAll: number;
  timezoneOffsetSeconds: number; // New: timezone offset in seconds from UTC
};


// -----------------------------------------------------------
// Zustand Store for Weather State
// -----------------------------------------------------------
interface WeatherState {
  cities: string[];
  addCity: (city: string) => void;
  clearCities: () => void; // New action to clear search history
}

const useWeatherStore = create<WeatherState>((set) => ({
  cities: ["London", "Cape Town", "Miami"], // Initial mock history
  addCity: (city) =>
    set((state) => {
      const normalizedCity = city.trim();
      // Add city only if it's not already the first item or not present, keep order
      const updatedCities = [
        normalizedCity,
        ...state.cities.filter((c) => c.toLowerCase() !== normalizedCity.toLowerCase()),
      ].slice(0, 5); // Keep only the 5 most recent
      return { cities: updatedCities };
    }),
  clearCities: () => set({ cities: [] }), // Implementation for clearing cities
}));


// -----------------------------------------------------------
// Weather Service (API Fetching and Mock Data)
// -----------------------------------------------------------

// IMPORTANT: For real weather data, replace the empty string below with your OpenWeatherMap API Key.
// You can get one at: https://home.openweathermap.org/api
// For local development with Vite, you would typically use: import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_KEY = "709a209589a3ceba02f7fbb62f7b49ad"; // Your OpenWeatherMap API Key has been added here!

// Helper to convert UTC unix timestamp + offset to local time string
const toLocalTimeWithOffset = (unixTimestamp: number, offsetSeconds: number, includeDate: boolean = false) => {
  const utcMilliseconds = unixTimestamp * 1000;
  const localMilliseconds = utcMilliseconds + offsetSeconds * 1000;
  const date = new Date(localMilliseconds);

  if (includeDate) {
    return date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};


// Mock Data (used if API_KEY is empty or for initial development)
const genericMockWeatherData: CurrentWeather = {
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
  timezoneOffsetSeconds: 0, // Default to UTC for mock
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


export const fetchCurrentWeather = async (cityOrCoords: string | { lat: number, lon: number }): Promise<CurrentWeather> => {
  if (!API_KEY) {
    console.warn("API Key is missing for fetchCurrentWeather. Using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const requestedCity = typeof cityOrCoords === 'string' ? cityOrCoords.toLowerCase() : 'current location';
    
    // Provide specific mock data for known cities to avoid "London, GH"
    let mockData = { ...genericMockWeatherData, city: typeof cityOrCoords === 'string' ? cityOrCoords : "Current Location" };
    switch (requestedCity) {
      case "london":
        mockData = { ...mockData, city: "London", country: "GB", temperature: 15, feels_like: 12, icon: `https://openweathermap.org/img/wn/04d@2x.png`, timezoneOffsetSeconds: 0 };
        break;
      case "cape town":
        mockData = { ...mockData, city: "Cape Town", country: "ZA", temperature: 22, feels_like: 20, icon: `https://openweathermap.org/img/wn/01d@2x.png`, timezoneOffsetSeconds: 7200 }; // +2 hours
        break;
      case "miami":
        mockData = { ...mockData, city: "Miami", country: "US", temperature: 30, feels_like: 35, icon: `https://openweathermap.org/img/wn/01d@2x.png`, timezoneOffsetSeconds: -14400 }; // -4 hours
        break;
      case "accra":
        mockData = { ...mockData, city: "Accra", country: "GH", temperature: 28, feels_like: 32, icon: `https://openweathermap.org/img/wn/02d@2x.png`, timezoneOffsetSeconds: 0 }; // UTC+0
        break;
      case "current location":
          mockData = { ...mockData, city: "Current Location", country: "🌍", timezoneOffsetSeconds: new Date().getTimezoneOffset() * -60 }; // Use local browser offset
          break;
      case "paris":
          mockData = { ...mockData, city: "Paris", country: "FR", temperature: 18, feels_like: 17, icon: `https://openweathermap.org/img/wn/03d@2x.png`, timezoneOffsetSeconds: 7200 }; // +2 hours
          break;
      case "tokyo":
          mockData = { ...mockData, city: "Tokyo", country: "JP", temperature: 25, feels_like: 26, icon: `https://openweathermap.org/img/wn/01d@2x.png`, timezoneOffsetSeconds: 32400 }; // +9 hours
          break;
      case "new york":
          mockData = { ...mockData, city: "New York", country: "US", temperature: 20, feels_like: 19, icon: `https://openweathermap.org/img/wn/04d@2x.png`, timezoneOffsetSeconds: -14400 }; // -4 hours
          break;
      case "sydney":
          mockData = { ...mockData, city: "Sydney", country: "AU", temperature: 21, feels_like: 22, icon: `https://openweathermap.org/img/wn/01d@2x.png`, timezoneOffsetSeconds: 36000 }; // +10 hours
          break;
      default:
        // For any other city, return generic mock data but use the requested city name
        mockData = { ...mockData, city: typeof cityOrCoords === 'string' ? cityOrCoords : "Unknown City", country: "N/A", timezoneOffsetSeconds: 0 };
        break;
    }
    return mockData;
  }

  let url = "";
  if (typeof cityOrCoords === 'string') {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityOrCoords)}&units=metric&appid=${API_KEY}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&units=metric&appid=${API_KEY}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "City/Coordinates not found");
  }
  const data = await res.json();
  const timezoneOffsetSeconds = data.timezone; // Offset in seconds from UTC

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg ?? 0,
    condition: data.weather?.[0]?.description ?? "—",
    icon: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`,
    sunrise: toLocalTimeWithOffset(data.sys.sunrise, timezoneOffsetSeconds),
    sunset: toLocalTimeWithOffset(data.sys.sunset, timezoneOffsetSeconds),
    dt: toLocalTimeWithOffset(data.dt, timezoneOffsetSeconds, true), // Include date for main display
    feels_like: Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    visibility: data.visibility,
    cloudsAll: data.clouds.all,
    timezoneOffsetSeconds: timezoneOffsetSeconds, // Return the offset
  };
};

export const fetchForecast = async (cityOrCoords: string | { lat: number, lon: number }) => {
  if (!API_KEY) {
    console.warn("API Key is missing for fetchForecast. Using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockForecastData; // Return generic mock forecast
  }
  let url = "";
  if (typeof cityOrCoords === 'string') {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityOrCoords}&appid=${API_KEY}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&appid=${API_KEY}&units=metric`;
  }
  const res = await fetch(url);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 text-white text-center p-6"> {/* Darker landing page */}
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">🌤️ Weatherly</h1>
      <p className="text-xl mb-8">Your real-time weather companion. Check forecasts by city!</p>
      <button
        id="getStartedBtn"
        onClick={onStart}
        className="px-8 py-3 bg-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105" // Dark mode button
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
  currentCityName: string;
  currentCountry: string;
  onSearch: (city: string) => void;
  isLoading: boolean;
  error: string;
  cityInput: string;
  setCityInput: (city: string) => void;
  searchHistory: string[];
  onSelectHistoryCity: (city: string) => void;
  onLocateMe: () => void; // New prop for current location
  greeting: string; // New prop for dynamic greeting
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentCityName,
  currentCountry,
  onSearch,
  isLoading,
  error,
  cityInput,
  setCityInput,
  searchHistory,
  onSelectHistoryCity,
  onLocateMe, // Destructure new prop
  greeting // Destructure new prop
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

  const predefinedCities = ["Paris", "Tokyo", "New York", "Sydney"]; // List of cities for quick select

  return (
    <>
      {/* Backdrop logic for mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-50 transform sidebar-transition ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        } md:hidden flex flex-col p-4 space-y-6 text-left text-gray-200`} // Forced dark bg, white text
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Weatherly</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info & Location */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">Hi, Drew</p>
          <p className="text-md text-gray-300">{greeting}</p> {/* Dynamic greeting */}
          <p className="flex items-center text-sm text-gray-400">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span className="font-medium text-gray-200">{currentCityName}, {currentCountry}</span>
          </p>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-500"
            placeholder="Search city in sidebar..."
            aria-label="Search city in sidebar"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Search weather"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>} {/* Error color adjusted for dark bg */}
        {isLoading && <p className="text-blue-400 text-sm mt-1">Loading...</p>} {/* Loading color adjusted for dark bg */}

        {/* Use Current Location Button */}
        <button
          onClick={onLocateMe}
          className="w-full flex items-center justify-center p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label="Use current location"
        >
          <LocateFixed className="w-5 h-5 mr-2" /> Use Current Location
        </button>

        {/* Quick Select Cities */}
        <div className="space-y-3 pt-4 border-t border-gray-700">
          <h3 className="text-md font-semibold text-white">Quick Select</h3>
          <div className="grid grid-cols-2 gap-2">
            {predefinedCities.map((city, i) => (
              <button
                key={i}
                onClick={() => onSelectHistoryCity(city)} // Re-use existing handler
                className="px-3 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links (Example) */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};


// ProfilePictureUpload Component
interface ProfilePictureUploadProps {
  profileImage: string | null;
  onImageUpload: (imageUrl: string | null) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ profileImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic check for image file type
      if (!file.type.startsWith('image/')) {
        // Using a custom alert/message box is preferred over window.alert in production
        // For simplicity here, we'll use a basic alert as this is a dev environment
        alert('Please upload an image file (e.g., JPG, PNG, GIF).'); 
        onImageUpload(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageUpload(null); // Clear image if no file selected
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform" onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload profile picture"
      />
      {profileImage ? (
        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <Upload className="w-5 h-5 text-white" /> // White icon for dark background
      )}
      <span className="sr-only">Upload Profile Picture</span>
    </div>
  );
};

// Recent Searches Card Component
interface RecentSearchesCardProps {
  searchHistory: string[];
  onSelectHistoryCity: (city: string) => void;
  onClearHistory: () => void; // New prop for clearing history
}

const RecentSearchesCard: React.FC<RecentSearchesCardProps> = ({ searchHistory, onSelectHistoryCity, onClearHistory }) => {
  if (searchHistory.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl glass animate-fade-in text-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-white flex justify-between items-center">
        Recent Searches
        <button onClick={onClearHistory} className="text-sm text-red-400 hover:underline px-2 py-1 rounded hover:bg-gray-700 transition-colors">Clear</button> {/* Clear button */}
      </h3>
      <ul className="space-y-2">
        {searchHistory.map((city, i) => (
          <li key={i}>
            <button
              onClick={() => onSelectHistoryCity(city)}
              className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


// TopBar Component
interface TopBarProps {
  onSearch: (city: string) => void;
  currentCityName: string;
  currentCountry: string;
  onToggleSidebar: () => void;
  profileImage: string | null; // New prop for profile image
  onImageUpload: (imageUrl: string | null) => void; // New prop for image upload handler
  greeting: string; // New prop for dynamic greeting
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, currentCityName, currentCountry, onToggleSidebar, profileImage, onImageUpload, greeting }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 md:px-8 shadow-md glass sticky top-0 z-50 rounded-b-xl text-gray-100">
      {/* Left section: Hamburger menu (mobile), Greeting (desktop), Location (desktop) */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-700 transition-colors md:hidden text-gray-200" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:block text-left">
          <p className="text-sm text-gray-400">Hi, Drew</p>
          <p className="font-semibold text-lg text-white">{greeting}</p> {/* Dynamic greeting */}
          <p className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span className="font-medium text-gray-300">{currentCityName}, {currentCountry}</span>
          </p>
        </div>
      </div>

      {/* Center: Search input - only visible on medium and larger screens */}
      <form onSubmit={handleSubmit} className="relative flex-grow mx-4 max-w-lg hidden md:flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-500"
            placeholder="Search your location..."
            aria-label="Search location"
          />
        </div>
        <button
            type="submit"
            className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search weather"
        >
            <Search className="w-5 h-5" />
        </button>
      </form>
      
      {/* Right section: User profile, notifications */}
      <div className="flex items-center gap-4">
        {/* Profile Picture Upload Component */}
        <ProfilePictureUpload profileImage={profileImage} onImageUpload={onImageUpload} />

        <button className="p-2 rounded-full hover:bg-gray-700 transition-colors hidden sm:block text-gray-200" aria-label="Notifications">
           <Bell className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};


// WeatherNowCard Component
const WeatherNowCard: React.FC<{ weather: CurrentWeather }> = ({ weather }) => {
  if (!weather) return null;

  const windSpeedKmh = (weather.windSpeed * 3.6).toFixed(2);

  // weather.dt is already a formatted string like "Saturday, August 24, 2025 at 01:49 PM"
  // Split it to display date and time separately to avoid re-parsing issues
  const dtParts = weather.dt.split(' at '); // Splits into ["Saturday, August 24, 2025", "01:49 PM"]
  const datePart = dtParts[0];
  const timePart = dtParts[1];

  return (
    <div className="p-6 rounded-2xl glass text-center flex flex-col items-center animate-fade-in text-gray-100">
      <div className="text-left w-full">
        {/* Display full date and time for the city */}
        <p className="text-gray-300 text-sm">{datePart}</p> {/* Directly use the date part */}
        <p className="text-gray-400 text-xs">{timePart}</p> {/* Directly use the time part */}
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <p className="text-7xl font-bold my-4 text-white">
          {weather.temperature}°C
        </p>
        {weather.feels_like !== undefined && (
          <p className="text-lg text-gray-300 -mt-2 mb-2">
            Feels like {weather.feels_like}°C
          </p>
        )}
        <img src={weather.icon} alt={weather.condition} className="w-28 h-28 object-contain mb-4" />
        <p className="capitalize text-xl text-gray-200">{weather.condition}</p>
        <div className="flex gap-6 mt-4 text-sm text-gray-300">
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
    <div className="p-6 rounded-2xl glass animate-fade-in text-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-white flex justify-between items-center">
        Today's Highlight
        <span className="text-sm text-blue-400 cursor-pointer hover:underline">See All</span>
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Wind Status */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Wind className="w-6 h-6 text-blue-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Wind Status</p>
          <p className="text-xl font-bold text-white">{ (weather.windSpeed * 3.6).toFixed(1) } km/h</p>
        </div>
        {/* Humidity */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Droplet className="w-6 h-6 text-blue-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Humidity</p>
          <p className="text-xl font-bold text-white">{weather.humidity}%</p>
        </div>
        {/* Pressure */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Thermometer className="w-6 h-6 text-yellow-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Pressure</p>
          <p className="text-xl font-bold text-white">{weather.pressure} hPa</p>
        </div>
        {/* Clouds */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Cloud className="w-6 h-6 text-gray-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Clouds</p>
          <p className="text-xl font-bold text-white">{weather.cloudsAll}%</p>
        </div>
        {/* Sunrise */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Sunrise className="w-6 h-6 text-orange-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Sunrise</p>
          <p className="text-xl font-bold text-white">{weather.sunrise}</p>
        </div>
        {/* UV Index */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <SunDim className="w-6 h-6 text-purple-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">UV Index</p>
          <p className="text-xl font-bold text-white">{uvIndexValue} <span className="text-sm font-normal">({uvIndexStatus})</span></p>
        </div>
        {/* Visibility */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Eye className="w-6 h-6 text-green-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Visibility</p>
          <p className="text-xl font-bold text-white">{visibilityKm} km</p>
        </div>
        {/* Sunset */}
        <div className="p-3 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700">
          <Sunset className="w-6 h-6 text-red-400 mb-1" />
          <p className="text-sm font-medium text-gray-200">Sunset</p>
          <p className="text-xl font-bold text-white">{weather.sunset}</p>
        </div>
      </div>
    </div>
  );
};


// ForecastCard Component
const ForecastCard: React.FC<{ forecast: any, timezoneOffsetSeconds: number }> = ({ forecast, timezoneOffsetSeconds }) => {
  if (!forecast?.list) return null;

  // Filter for one forecast per day (around noon or 15:00 for consistency)
  const dailyForecastsMap = new Map();
  forecast.list.forEach(item => {
    // Convert UTC dt to local date for the city using the provided offset
    const localDate = new Date((item.dt * 1000) + (timezoneOffsetSeconds * 1000));
    const dateKey = localDate.toLocaleDateString(); // Use local date for the key

    // Choose entry closest to midday or prioritize a specific time if possible
    if (!dailyForecastsMap.has(dateKey)) { // If date not seen, add it
        dailyForecastsMap.set(dateKey, item);
    } else { // If date seen, and current item is closer to noon, replace
        const existingItem = dailyForecastsMap.get(dateKey);
        const existingLocalHour = new Date((existingItem.dt * 1000) + (timezoneOffsetSeconds * 1000)).getHours();
        const currentLocalHour = new Date(localDate).getHours();

        const existingHourDiff = Math.abs(existingLocalHour - 14); // Compare to 2 PM (14:00)
        const currentHourDiff = Math.abs(currentLocalHour - 14);
        if (currentHourDiff < existingHourDiff) {
            dailyForecastsMap.set(dateKey, item);
        }
    }
  });

  const dailyForecasts = Array.from(dailyForecastsMap.values()).slice(0, 5);


  return (
    <div className="p-6 rounded-2xl glass animate-fade-in text-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-white flex justify-between items-center">
        5-Day Forecast
        <span className="text-sm text-blue-400 cursor-pointer hover:underline">See All</span>
      </h3>
      {/* Adjusted gap for better spacing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {dailyForecasts.map((day, idx) => {
            const localDate = new Date((day.dt * 1000) + (timezoneOffsetSeconds * 1000));
            return (
                <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-800 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-gray-700" // Darker cards, enhanced hover
                >
                    <p className="font-medium text-gray-200 mb-1">
                    {localDate.toLocaleDateString("en-US", {
                        weekday: "short",
                    })}
                    </p>
                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} className="w-16 h-16 object-contain mb-2" />
                    <p className="text-2xl font-bold text-white">{Math.round(day.main.temp)}°C</p>
                    <p className="capitalize text-sm text-gray-300">{day.weather[0].description}</p>
                </div>
            );
        })}
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
  const [darkMode, setDarkMode] = useState(true); // ⭐ Force dark mode to true ⭐
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">("landing");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cityInputInSidebar, setCityInputInSidebar] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null); // ⭐ New state for profile image ⭐
  const [greeting, setGreeting] = useState(""); // ⭐ New state for dynamic greeting ⭐


  // Use Zustand store for search history
  const searchHistory = useWeatherStore((state) => state.cities);
  const addCityToStore = useWeatherStore((state) => state.addCity);
  const clearSearchHistory = useWeatherStore((state) => state.clearCities); // Get clearCities action


  // Helper function for dynamic greeting
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours(); // This will still be local browser time for the greeting
    if (hour >= 5 && hour < 12) return "Good Morning"; // 5 AM to 11:59 AM
    if (hour >= 12 && hour < 17) return "Good Afternoon"; // 12 PM to 4:59 PM
    if (hour >= 17 && hour < 21) return "Good Evening"; // 5 PM to 8:59 PM
    return "Good Night"; // 9 PM to 4:59 AM
  }, []);


  // Memoize handleSearch to prevent unnecessary re-renders and satisfy useEffect dependency
  const handleSearch = useCallback(async (searchCityOrCoords: string | { lat: number, lon: number }) => {
    setIsLoading(true);
    setError("");
    try {
      const weatherData = await fetchCurrentWeather(searchCityOrCoords);
      const forecastData = await fetchForecast(searchCityOrCoords);
      setWeather(weatherData);
      setForecast(forecastData);
      if (typeof searchCityOrCoords === 'string') {
        addCityToStore(searchCityOrCoords);
      } else {
        // If searching by coords, add the resolved city name to history
        addCityToStore(weatherData.city);
      }
      setCity(weatherData.city); // Update the main city state after successful fetch
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [addCityToStore]);


  // Function to handle selecting a city from history
  const handleSelectHistoryCity = useCallback((selectedCity: string) => {
    // setCity(selectedCity); // Removed as handleSearch now updates it
    handleSearch(selectedCity); // Trigger search for selected city
    setIsSidebarOpen(false);
  }, [handleSearch]);

  // ⭐ New handler for profile image upload ⭐
  const handleProfileImageUpload = useCallback((imageUrl: string | null) => {
    setProfileImage(imageUrl);
  }, []);

  // ⭐ New handler to get current location ⭐
  const handleLocateMe = useCallback(() => {
    setIsLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // setCity("Current Location"); // Removed as handleSearch now updates it
          handleSearch({ lat: latitude, lon: longitude });
          setIsSidebarOpen(false); // Close sidebar after locating
        },
        (geoError) => {
          setError(`Geolocation error: ${geoError.message}. Please enable location services.`);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, [handleSearch]);


  // Effect to fetch initial weather data and update greeting
  useEffect(() => {
    // Force the dark class on the html element
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light"); // Ensure light mode is removed if it existed
    
    // Set initial greeting
    setGreeting(getGreeting());

    // Update greeting every hour (or more frequently if desired)
    const greetingInterval = setInterval(() => {
        setGreeting(getGreeting());
    }, 1000 * 60 * 60); // Every hour

    return () => clearInterval(greetingInterval); // Cleanup on unmount
  }, [getGreeting]);


  // Effect for initial weather fetch when dashboard is active or city changes
  useEffect(() => {
    if (currentPage === "dashboard" && city) { // Only fetch if dashboard is active and city is set
      handleSearch(city);
    }
  }, [currentPage, city, handleSearch]);


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
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden font-inter antialiased"> {/* Force dark bg and white text for body/root */}
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentCityName={weather?.city || city}
        currentCountry={weather?.country || "Ghana"}
        onSearch={handleSearch}
        isLoading={isLoading}
        error={error}
        cityInput={cityInputInSidebar}
        setCityInput={setCityInputInSidebar}
        searchHistory={searchHistory} // Still pass to sidebar for potential future use or context
        onSelectHistoryCity={handleSelectHistoryCity}
        onLocateMe={handleLocateMe}
        greeting={greeting} // Pass dynamic greeting
      />

      {/* Top bar using the new TopBar component */}
      <TopBar 
        onSearch={handleSearch} // Pass handleSearch directly
        currentCityName={weather?.city || city}
        currentCountry={weather?.country || "Ghana"}
        onToggleSidebar={toggleSidebar}
        profileImage={profileImage}
        onImageUpload={handleProfileImageUpload}
        greeting={greeting} // Pass dynamic greeting
      />

      {/* Main content wrapper */}
      <div className={`transition-transform duration-300 ease-out ${isSidebarOpen ? 'md:ml-0' : ''}`}>
        {/* Loading/Error overlay */}
        {(isLoading || error) && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center text-white">
              {isLoading && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-xl font-semibold">Loading weather data...</p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center">
                  <p className="text-red-400 text-lg font-semibold mb-4">{error}</p>
                  <button
                    onClick={() => setError("")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
          {/* Left Column: Main Weather & Highlights - Takes 2/3 width on large screens */}
          <section className="lg:col-span-2 space-y-6"> {/* Changed from lg:col-span-1 to lg:col-span-2 */}
            {/* Mobile greeting and location */}
            <div className="flex flex-col items-start px-4 md:hidden text-left" style={{ visibility: isSidebarOpen ? 'hidden' : 'visible' }}>
              <p className="text-sm text-gray-400">Hi, Drew</p>
              <p className="font-semibold text-lg text-white">{greeting}</p> {/* Dynamic greeting */}
              <p className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span className="font-medium text-gray-300">{weather ? `${weather.city}, ${weather.country}` : "Search for a city"}</span>
              </p>
            </div>
            
            {weather && <WeatherNowCard weather={weather} />}
            {weather && <HighlightsCard weather={weather} />}
          </section>

          {/* Right Column: Recent Searches & Forecast - Takes 1/3 width on large screens */}
          <section className="lg:col-span-1 space-y-6"> {/* Changed from lg:col-span-2 to lg:col-span-1 */}
            {searchHistory.length > 0 && (
              <RecentSearchesCard
                searchHistory={searchHistory}
                onSelectHistoryCity={handleSelectHistoryCity}
                onClearHistory={clearSearchHistory} // Pass clear history action
              />
            )}
            </section>
            
            {/* New Full-Width Section for 5-Day Forecast */}
            <section className="lg:col-span-3 space-y-6"> {/* Now spans full width on large screens */}
                {forecast?.list && weather && <ForecastCard forecast={forecast} timezoneOffsetSeconds={weather.timezoneOffsetSeconds} />}
            </section>
        </main>
      </div>
    </div>
  );
};

// This is the main App component that renders the Dashboard.
// It's structured this way to be a single, deployable file if needed.
const App = () => {
  return (
    <Dashboard />
  );
};

export default App;
