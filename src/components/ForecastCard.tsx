import { useWeatherStore } from "../store/weatherStore";

const ForecastCard = () => {
  const { forecastData } = useWeatherStore();

  if (!forecastData) return null;

  // Pick one forecast per day (every 8th item = ~24hrs)
  const dailyForecasts = forecastData.filter((_, index) => index % 8 === 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
      {dailyForecasts.map((forecast) => (
        <div
          key={forecast.dt}
          className="p-4 bg-white rounded-xl shadow-md text-center"
        >
          <p className="text-sm font-semibold">
            {new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
            alt={forecast.weather[0].description}
            className="mx-auto"
          />
          <p className="text-lg font-bold">
            {Math.round(forecast.main.temp - 273.15)}°C
          </p>
          <p className="text-gray-500 text-sm capitalize">
            {forecast.weather[0].description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ForecastCard;
