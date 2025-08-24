// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // Ensure this path is correct for your App.tsx
// REMOVED: import "./index.css";
// REMOVED: import "./app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);