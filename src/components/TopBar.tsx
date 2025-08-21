import { useState } from "react";

interface TopBarProps {
  onSearch: (city: string) => void;
}

export default function TopBar({ onSearch }: TopBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌤️ Weatherly</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-1 rounded text-black"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
        >
          Search
        </button>
      </form>
    </div>
  );
}
