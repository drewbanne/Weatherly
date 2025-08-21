// src/utils/weatherApi.ts
const API_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // stored in .env

export const fetchWeatherByCity = async (city: string) => {
  try {
    const response = await fetch(
      `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};
