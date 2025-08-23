import React, { useState } from "react";
import { Sun, Moon } from "lucide-react"; // Assuming these are still used for dark mode toggle

interface TopBarProps {
  onSearch: (city: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  // If you want to include user info or other header elements, add props here
}

export default function TopBar({ onSearch, darkMode, setDarkMode }: TopBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md dark:bg-gray-900/70 rounded-b-xl">
      <h1 className="text-xl font-bold">🌤️ Weatherly</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Enter city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-1 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white"
          aria-label="Enter city for weather search"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200 transition-colors dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300"
          aria-label="Search"
        >
          Search
        </button>
      </form>
      {/* Re-integrating Dark Mode Toggle here, or you could place it outside TopBar in Dashboard */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 transition-transform shadow-md dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
      </button>
      {/* Placeholder for user avatar - could be a prop or added here */}
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-inner hidden sm:block">
        <img src="https://placehold.co/40x40/000000/FFFFFF?text=JD" alt="User avatar" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
