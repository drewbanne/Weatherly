import { useEffect, useState } from "react";

interface WeatherCardProps {
  city: string;
}

interface WeatherData {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

export default function WeatherCard({ city }: WeatherCardProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
            import.meta.env.VITE_OPENWEATHER_API_KEY
          }&units=metric`
        );

        if (!response.ok) throw new Error("City not found");

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city]);

  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <>
          <h2 className="text-lg font-bold">{data.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="mx-auto"
          />
          <p className="text-2xl font-semibold">{Math.round(data.main.temp)}°C</p>
          <p className="capitalize text-gray-600">{data.weather[0].description}</p>
        </>
      )}
    </div>
  );
}
