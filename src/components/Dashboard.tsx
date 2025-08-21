import { useState } from "react";
import WeatherCard from "./WeatherCard";

interface DashboardProps {
  searchCity: string | null;
}

export default function Dashboard({ searchCity }: DashboardProps) {
  const [cities, setCities] = useState<string[]>(["London", "New York", "Tokyo"]);

  // If a new city is searched, add it (if not already in list)
  if (searchCity && !cities.includes(searchCity)) {
    setCities((prev) => [...prev, searchCity]);
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <WeatherCard key={city} city={city} />
      ))}
    </div>
  );
}
