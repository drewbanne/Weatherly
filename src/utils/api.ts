// src/utils/api.ts
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
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  if (!API_KEY) throw new Error("Missing VITE_OPENWEATHER_API_KEY in .env");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    // 404 or 401, etc
    const msg = res.status === 404 ? "City not found" : "OpenWeather API error";
    throw new Error(msg);
  }

  const data = await res.json();

  const toLocal = (unix: number) =>
    new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg ?? 0,
    condition: data.weather?.[0]?.description ?? "—",
    icon: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`,
    sunrise: toLocal(data.sys.sunrise),
    sunset: toLocal(data.sys.sunset),
    dt: new Date(data.dt * 1000).toLocaleString(),
  };
}
