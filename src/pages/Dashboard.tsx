// src/pages/Dashboard.tsx
import React from "react";

export default function Dashboard() {
  return (
    <div className="main-content" id="weatherDashboardSection">
      {/* TOP BAR is positioned absolutely by CSS; we render it in App above this grid */}

      <div className="weather-section">
        {/* Weather Container */}
        <div className="weather-container">
          <div className="weather-top">
            <div className="weather-location" id="weatherLocation">Greater Accra, Ghana</div>
            <div className="temp-toggle">
              <span>°C</span> | <span>°F</span>
            </div>
          </div>

          <div className="weather-main">
            <div className="weather-details">
              <h2 className="weather-day">Sunday</h2>
              <span className="weather-date">August 17, 2:45 PM</span>
              <h1 className="weather-temp">15°C</h1>
              <span className="weather-condition">Clouds</span>
              <span className="weather-humidity">Humidity: 77%</span>
              <span className="weather-wind">Wind: 4.12 m/s NW</span>
            </div>
            <div className="weather-icon">☁️</div>
          </div>
        </div>

        {/* History */}
        <div className="history-container">
          <h2>Search History</h2>
          <div className="history-list">
            <div className="history-item">
              <div className="history-details">
                <span className="country">United States</span>
                <span className="city">New York</span>
                <span className="weather">Mostly Sunny, 25°C</span>
              </div>
              <span className="history-icon">☀️</span>
            </div>
            <div className="history-item">
              <div className="history-details">
                <span className="country">France</span>
                <span className="city">Paris</span>
                <span className="weather">Partly Cloudy, 18°C</span>
              </div>
              <span className="history-icon">🌤️</span>
            </div>
            <div className="history-item">
              <div className="history-details">
                <span className="country">Japan</span>
                <span className="city">Tokyo</span>
                <span className="weather">Rain, 22°C</span>
              </div>
              <span className="history-icon">🌧️</span>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="highlights-container">
          <div className="highlights-header">
            <span>Today's highlight</span>
            <span></span>
          </div>
          <div className="highlights-grid">
            <div className="highlight-box">
              <span className="title">Wind Status</span>
              <span className="data">4.12 m/s</span>
              <span className="icon">💨</span>
            </div>
            <div className="highlight-box">
              <span className="title">Humidity</span>
              <span className="data">77%</span>
              <span className="icon">💧</span>
            </div>
            <div className="highlight-box horizontal">
              <span className="icon">🌅</span>
              <div className="data-info">
                <span className="title">Sunrise</span>
                <span className="data">6:00 AM</span>
              </div>
            </div>
            <div className="highlight-box">
              <span className="title">UV Index</span>
              <span className="data">3 (Moderate)</span>
              <span className="icon">☀️</span>
            </div>
            <div className="highlight-box">
              <span className="title">Visibility</span>
              <span className="data">10 km</span>
              <span className="icon">👁️</span>
            </div>
            <div className="highlight-box horizontal">
              <span className="icon">🌇</span>
              <div className="data-info">
                <span className="title">Sunset</span>
                <span className="data">6:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {[
              { day: "MON", icon: "🌤️", temp: "18°C" },
              { day: "TUE", icon: "☁️", temp: "20°C" },
              { day: "WED", icon: "🌧️", temp: "22°C" },
              { day: "THU", icon: "🌦️", temp: "19°C" },
              { day: "FRI", icon: "☀️", temp: "21°C" },
            ].map((d) => (
              <div className="forecast-day" key={d.day}>
                <span className="day-name">{d.day}</span>
                <span className="icon">{d.icon}</span>
                <span className="temp">{d.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
