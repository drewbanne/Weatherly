import React from "react";

interface Props {
  weather: any;
}

const WeatherCard: React.FC<Props> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold">{weather.name}</h2>
      <p className="text-lg">{weather.weather[0].description}</p>
      <p className="text-5xl font-semibold mt-4">
        {Math.round(weather.main.temp)}°C
      </p>
      <div className="flex gap-6 mt-4 text-sm">
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default WeatherCard;
