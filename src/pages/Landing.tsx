// src/pages/Landing.tsx
import React from "react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-center p-6">
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">🌤️ Weatherly</h1>
      <p className="text-xl mb-8">Your real-time weather companion. Check forecasts by city!</p>
      <button
        id="getStartedBtn"
        onClick={onStart}
        className="px-8 py-3 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:bg-blue-100 transition-transform transform hover:scale-105"
      >
        Get Started
      </button>
    </div>
  );
};

export default Landing;