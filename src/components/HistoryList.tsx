import React, { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Search, Wind, Droplet, Sunrise, Sunset, Eye, SunDim, Cloud, Thermometer } from "lucide-react"; // Added Cloud and Thermometer for Pressure

// Assuming weatherService.js is in the same directory or correctly aliased
// Example mock data for demonstration if actual API calls are not set up or fail
const mockWeatherData = {
  name: "Accra",
  main: { temp: 28, humidity: 77, feels_like: 32, pressure: 1012 }, // Added feels_like and pressure
  weather: [{ description: "partly cloudy" }],
  wind: { speed: 4.12, deg: 270 }, // wind speed in m/s, deg in degrees
  sys: { sunrise: 1678886400, sunset: 1678933200 }, // Example timestamps
  visibility: 10000, // in meters
  clouds: { all: 40 }, // Added clouds data
};

const mockForecastData = {
  list: [
    { dt: Date.now() / 1000, main: { temp: 27 }, weather: [{ description: "sunny" }] },
    { dt: Date.now() / 1000 + 86400, main: { temp: 28 }, weather: [{ description: "clouds" }] },
    { dt: Date.now() / 1000 + 2 * 86400, main: { temp: 26 }, weather: [{ description: "rain" }] },
    { dt: Date.now() / 1000 + 3 * 86400, main: { temp: 29 }, weather: [{ description: "clear sky" }] },
    { dt: Date.now() / 1000 + 4 * 86400, main: { temp: 27 }, weather: [{ description: "light rain" }] },
    // Adding more mock data points to ensure `i % 8 === 0` logic works for a full 5 days
    { dt: Date.now() / 1000 + 5 * 86400, main: { temp: 25 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 3 * 3600, main: { temp: 26 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 6 * 3600, main: { temp: 27 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 9 * 3600, main: { temp: 28 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 12 * 3600, main: { temp: 29 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 15 * 3600, main: { temp: 28 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 18 * 3600, main: { temp: 27 }, weather: [{ description: "scattered clouds" }] },
    { dt: Date.now() / 1000 + 5 * 86400 + 21 * 3600, main: { temp: 26 }, weather: [{ description: "scattered clouds" }] },
  ],
};

// Placeholder for actual API service if it's not provided or needs adjustment
const fetchWeather = async (city) => {
  // Replace with your actual API call
  console.log(`Fetching weather for ${city}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  if (city.toLowerCase() === "london" || city.toLowerCase() === "accra") {
    return { 
      ...mockWeatherData, 
      name: city, 
      main: { 
        ...mockWeatherData.main, 
        temp: city.toLowerCase() === "london" ? 15 : 28, 
        feels_like: city.toLowerCase() === "london" ? 12 : 32,
        pressure: 1012 // Mock pressure
      },
      clouds: { all: 40 } // Mock clouds
    };
  }
  throw new Error("City not found");
};

const fetchForecast = async (city) => {
  // Replace with your actual API call
  console.log(`Fetching forecast for ${city}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  if (city.toLowerCase() === "london" || city.toLowerCase() === "accra") {
    return mockForecastData;
  }
  throw new Error("Forecast not available for this city");
};


// -----------------------------------------------------------
// Reusable Components
// -----------------------------------------------------------

// SearchBar Component
const SearchBar = ({ city, setCity, handleSearch, error, isLoading }) => (
  <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg backdrop-blur-md">
    <div className="flex gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search for your location..."
        aria-label="Search city"
      />
      <button
        onClick={handleSearch}
        className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
        aria-label="Search weather"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-3 animate-pulse">{error}</p>}
    {isLoading && <p className="text-blue-500 text-sm mt-3">Loading weather data...</p>}
  </div>
);

// WeatherNowCard Component
const WeatherNowCard = ({ weather }) => {
  if (!weather) return null; // Don't render if no weather data

  const date = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Convert wind speed from m/s to km/h (approx)
  const windSpeedKmh = (weather.wind.speed * 3.6).toFixed(2);

  // Function to get weather icon based on description (simplified)
  const getWeatherIcon = (description) => {
    if (description.includes("clear")) return "☀️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("storm")) return "⛈️";
    if (description.includes("snow")) return "❄️";
    return "🌡️";
  };
  const weatherIcon = getWeatherIcon(weather.weather[0].description);


  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg backdrop-blur-md text-center flex flex-col items-center">
      <div className="text-left w-full">
        <p className="text-gray-600 dark:text-gray-300 text-sm">Sunday</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{formattedDate}</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <p className="text-7xl font-bold my-4 text-gray-800 dark:text-white">
          {Math.round(weather.main.temp)}°C
        </p>
        {weather.main.feels_like && ( // Conditionally display "Feels like"
          <p className="text-lg text-gray-500 dark:text-gray-400 -mt-2 mb-2">
            Feels like {Math.round(weather.main.feels_like)}°C
          </p>
        )}
        <div className="text-6xl mb-4">{weatherIcon}</div> {/* Weather icon */}
        <p className="capitalize text-xl text-gray-700 dark:text-gray-200">{weather.weather[0].description}</p>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {windSpeedKmh} km/h</p>
        </div>
      </div>
    </div>
  );
};


// Today's Highlight Component (using static data for now, can be dynamic)
const HighlightsCard = ({ weather }) => {
  if (!weather) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const uvIndexValue = 4; // Static for now, integrate actual API data if available
  const uvIndexStatus = uvIndexValue < 3 ? "Low" : uvIndexValue < 6 ? "Moderate" : "High";

  const visibilityKm = (weather.visibility / 1000).toFixed(0);

  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
        Today's Highlight
        <span className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">See All</span> {/* Added "See All" for consistency */}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Wind Status */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Wind className="w-6 h-6 text-blue-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Wind Status</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{ (weather.wind.speed * 3.6).toFixed(1) } km/h</p>
        </div>
        {/* Humidity */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Droplet className="w-6 h-6 text-blue-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Humidity</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.main.humidity}%</p>
        </div>
        {/* Pressure (New) */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Thermometer className="w-6 h-6 text-yellow-500 mb-1" /> {/* Using Thermometer icon for pressure */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Pressure</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.main.pressure} hPa</p>
        </div>
        {/* Clouds (New) */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Cloud className="w-6 h-6 text-gray-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Clouds</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{weather.clouds.all}%</p>
        </div>
        {/* Sunrise */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Sunrise className="w-6 h-6 text-orange-400 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Sunrise</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{formatTime(weather.sys.sunrise)}</p>
        </div>
        {/* UV Index */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <SunDim className="w-6 h-6 text-purple-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">UV Index</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{uvIndexValue} <span className="text-sm font-normal">({uvIndexStatus})</span></p>
        </div>
        {/* Visibility */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Eye className="w-6 h-6 text-green-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Visibility</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{visibilityKm} km</p>
        </div>
        {/* Sunset */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-center flex flex-col items-center justify-center">
          <Sunset className="w-6 h-6 text-red-500 mb-1" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Sunset</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{formatTime(weather.sys.sunset)}</p>
        </div>
      </div>
    </div>
  );
};


// ForecastCard Component (Updated to incorporate filtering and icon usage)
const ForecastCard = ({ forecast }) => {
  if (!forecast?.list) return null; // Don't render if no forecast data

  // Function to get weather icon based on description (simplified)
  const getWeatherIcon = (description) => {
    if (description.includes("clear")) return "☀️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("storm")) return "⛈️";
    if (description.includes("snow")) return "❄️";
    return "🌡️";
  };

  // Use the i % 8 === 0 logic to pick daily forecasts
  const dailyForecasts = forecast.list.filter((_item, i) => i % 8 === 0).slice(0, 5); // Ensure only 5 days

  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg backdrop-blur-md">
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
            <div className="text-3xl mb-2">{getWeatherIcon(day.weather[0].description)}</div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(day.main.temp)}°C</p>
            <p className="capitalize text-sm text-gray-700 dark:text-gray-300">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// HistoryList Component (replacing the static SearchHistory)
interface HistoryListProps {
  history: string[];
  onSelectCity: (city: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectCity }) => {
  if (!history.length) return null;

  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
        Recent Searches
        <span className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">See All</span>
      </h3>
      <ul className="space-y-3">
        {history.map((city, i) => (
          <li key={i}>
            <button
              onClick={() => onSelectCity(city)}
              className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white font-medium"
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


// -----------------------------------------------------------
// Main Dashboard Component
// -----------------------------------------------------------

const Dashboard = () => {
  const [city, setCity] = useState("Accra");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(["London", "Cape Town", "Miami"]); // Initial mock history

  // Memoize handleSearch to prevent unnecessary re-renders and satisfy useEffect dependency
  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const weatherData = await fetchWeather(city);
      const forecastData = await fetchForecast(city);
      setWeather(weatherData);
      setForecast(forecastData);
      
      // Add city to history only on successful fetch
      setSearchHistory(prevHistory => {
          const updatedHistory = [city, ...prevHistory.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5); // Keep last 5 unique searches (case-insensitive)
          return updatedHistory;
      });

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [city]); // city is a dependency, so handleSearch re-creates if city changes

  // Function to handle selecting a city from history
  const handleSelectHistoryCity = useCallback((selectedCity) => {
    setCity(selectedCity);
    // handleSearch will be called via useEffect due to city change
  }, []);


  // Effect to fetch initial weather data and toggle dark mode class
  useEffect(() => {
    // Apply theme class to <html> element
    document.documentElement.classList.toggle("dark", darkMode);
    
    // Fetch weather on initial load or when darkMode changes (to trigger re-render if needed)
    handleSearch();
  }, [darkMode, handleSearch]); // handleSearch is now a stable reference due to useCallback


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white font-inter antialiased transition-colors duration-300 ease-in-out">
      {/* Top bar */}
      <header className="flex items-center justify-between p-4 md:px-8 shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-50 rounded-b-xl">
        {/* Left section: Hamburger menu, Greeting, Location */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Open menu">
            {/* You can add a hamburger icon here, e.g., using Lucide-React 'Menu' */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-6 h-6 text-gray-700 dark:text-gray-200"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
          </button>
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600 dark:text-gray-400">Hi, Drew</p>
            <p className="font-semibold text-lg">Good Morning</p>
            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mr-1"><path d="M12 12.5a4 4 0 1 0 0-9 4 4 0 0 0 0 9Z"/><path d="M12 21.5s-5-7-5-10a7 7 0 0 1 14 0c0 3-5 10-5 10Z"/></svg>
              Accra, Ghana
            </p>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative flex-grow mx-4 max-w-lg hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            placeholder="Search your location"
            aria-label="Search location"
          />
        </div>
        
        {/* Right section: Dark mode toggle, user profile, notifications */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-md"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Placeholder for user avatar */}
            <img src="https://placehold.co/40x40/000000/FFFFFF?text=JD" alt="User avatar" className="w-full h-full object-cover" />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block" aria-label="Notifications">
             {/* Bell icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-6 h-6 text-gray-700 dark:text-gray-200"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <section className="lg:col-span-1 space-y-6">
          <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} error={error} isLoading={isLoading} />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Greater Accra, Ghana</p>
          {weather && <WeatherNowCard weather={weather} />}
          {weather && <HighlightsCard weather={weather} />}
        </section>

        {/* Right Column */}
        <section className="lg:col-span-2 space-y-6">
          {searchHistory.length > 0 && (
            <HistoryList history={searchHistory} onSelectCity={handleSelectHistoryCity} />
          )}
          {forecast?.list && <ForecastCard forecast={forecast} />}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
