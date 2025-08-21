import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-8">Weatherly</h1>
      <nav className="flex flex-col gap-4">
        <button className="hover:bg-blue-700 p-2 rounded">🏠 Dashboard</button>
        <button className="hover:bg-blue-700 p-2 rounded">⭐ Favorites</button>
        <button className="hover:bg-blue-700 p-2 rounded">⚙️ Settings</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
