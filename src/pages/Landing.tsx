// src/pages/Landing.tsx
import React from "react";

type LandingProps = {
  onStart: () => void;
};

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="initial-dashboard" id="initialPage">
      <h1 className="weatherly-title">Weatherly</h1>
      <p>Check real-time weather by city</p>
      <button id="getStartedBtn" onClick={onStart}>Get Started</button>
    </div>
  );
}
