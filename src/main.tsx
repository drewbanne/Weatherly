// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 🔥 Ensure this line is present
import "./app.css";   // 🔥 Ensure this line is present (if app.css contains global styles)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);