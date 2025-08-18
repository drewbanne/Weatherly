// src/App.tsx
import React, { useEffect, useState } from "react";
import "./assets/styles/weather.css";
import Landing from "./pages/Landing";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (isDark) body.classList.add("dark");
    else body.classList.remove("dark");
  }, [isDark]);

  return (
    <>
      {!showDashboard ? (
        <Landing onStart={() => setShowDashboard(true)} />
      ) : (
        <>
          <Sidebar onOpenDashboard={() => setShowDashboard(true)} />
          <TopBar isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />
          <Dashboard />
        </>
      )}
    </>
  );
}
