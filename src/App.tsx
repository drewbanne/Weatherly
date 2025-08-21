import { useState } from "react";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [searchCity, setSearchCity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onSearch={(city) => setSearchCity(city)} />
      <Dashboard searchCity={searchCity} />
    </div>
  );
}
