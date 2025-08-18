// src/components/Sidebar.tsx
import React from "react";

type SidebarProps = {
  onOpenDashboard: () => void;
};

export default function Sidebar({ onOpenDashboard }: SidebarProps) {
  return (
    <div className="sidebar">
      <div>
        <div className="icon" id="hamburger" data-tooltip="Menu">≡</div>
        <div className="separator"></div>
        <div className="icon weather-icon-btn" data-tooltip="Weather Dashboard" onClick={onOpenDashboard}>☀</div>
        <div className="icon" data-tooltip="Maps">🗺️</div>
        <div className="icon" data-tooltip="Calendar">📅</div>
        <div className="icon" data-tooltip="Alerts">🔔</div>
        <div className="icon" data-tooltip="Settings">⚙️</div>
      </div>
      <div>
        <div className="separator"></div>
        <div className="icon" data-tooltip="Help">❓</div>
      </div>
    </div>
  );
}
