import { useWeatherStore } from "../store/weatherStore";

export default function HistoryList() {
  const history = useWeatherStore((s) => s.history);
  const selectFromHistory = useWeatherStore((s) => s.selectFromHistory);

  if (history.length === 0) return null;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <h3 style={{ margin: "12px 0" }}>Recent Searches</h3>
      {history.map((h) => (
        <button
          key={h.city}
          onClick={() => selectFromHistory(h.city)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #eee",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          <span style={{ fontWeight: 600 }}>{h.city}, {h.country}</span>
          <span>{h.temperature}°C</span>
        </button>
      ))}
    </div>
  );
}

