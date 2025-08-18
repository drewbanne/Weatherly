import { useRef } from "react";
import { useWeatherStore } from "../store/weatherStore";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const getWeather = useWeatherStore((s) => s.getWeather);
  const isLoading = useWeatherStore((s) => s.isLoading);

  const onSearch = () => {
    const q = inputRef.current?.value || "";
    getWeather(q);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        ref={inputRef}
        placeholder="Search a city (e.g. Accra)"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd", minWidth: 240 }}
      />
      <button
        onClick={onSearch}
        disabled={isLoading}
        style={{ padding: "10px 16px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer" }}
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}
