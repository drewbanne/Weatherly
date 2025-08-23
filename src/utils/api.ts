// src/utils/api.ts
type CurrentWeather = {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
  dt: string;
  feels_like: number;
  pressure: number;
  visibility: number;
  cloudsAll: number;
};

// IMPORTANT: For local development, this needs to be loaded from your .env file
// Example: const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// For now, it's an empty string for Canvas compatibility.
const API_KEY = "";

// Mock Data (keep this if you want to test without a real API key)
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
    // ... (rest of mockForecastData list)
  ],
};


export const fetchCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  if (!API_KEY) {
    console.warn("API Key is missing for fetchCurrentWeather. Using mock data.");
    await new Promise(resolve => setTimeout(resolve, 500));
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