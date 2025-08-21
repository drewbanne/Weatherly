import { useState } from "react";
import { useWeatherStore } from "../store/weatherStore";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const setCity = useWeatherStore((state) => state.setCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCity(input.trim());
      setInput(""); // clear field after search
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter city name..."
        className="flex-1 p-2 rounded-lg border border-gray-300"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
