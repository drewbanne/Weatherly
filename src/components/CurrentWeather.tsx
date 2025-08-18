import { useWeatherStore } from "../store/weatherStore";

export default function CurrentWeather() {
  const current = useWeatherStore((s) => s.current);
  const error = useWeatherStore((s) => s.error);
  const clearError = useWeatherStore((s) => s.clearError);

  if (error) {
    return (
      <div style={{ padding: 16, borderRadius: 12, background: "#ffe6e6", color: "#a00" }}>
        {error} <button onClick={clearError} style={{ marginLeft: 12 }}>Dismiss</button>
      </div>
    );
  }

  if (!current) {
    return (
      <div style={{ padding: 16, borderRadius: 12, background: "#f4f4f4" }}>
        Search a city to see current weather.
      </div>
    );
  }

  return (
    <div style={{ padding: 20, borderRadius: 16, background: "#f5f7fb", display: "flex", gap: 16, alignItems: "center" }}>
      <img src={current.icon} alt={current.condition} width={80} height={80} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <strong style={{ fontSize: 22 }}>
          {current.city}, {current.country}
        </strong>
        <span style={{ fontSize: 36, fontWeight: 700 }}>{current.temperature}°C</span>
        <span style={{ textTransform: "capitalize" }}>{current.condition}</span>
        <small>Humidity: {current.humidity}% • Wind: {current.windSpeed} m/s</small>
        <small>Sunrise: {current.sunrise} • Sunset: {current.sunset}</small>
        <small>Updated: {current.dt}</small>
      </div>
    </div>
  );
}
