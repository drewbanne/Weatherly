// src/services/weatherService.ts

// Load API key from .env
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error("❌ Missing OpenWeather API Key. Set VITE_OPENWEATHER_API_KEY in .env");
}

export async function fetchWeather(city: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found or API error");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}
