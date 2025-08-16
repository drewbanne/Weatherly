# Weatherly 🌦️

A modern weather dashboard built with **React + TypeScript + Vite**, designed to provide real-time weather updates with a clean and responsive UI.  

## 🚀 Features
- Search for any city and get live weather updates 🌍  
- Displays temperature, humidity, wind speed, and conditions 🌡️💨  
- Responsive design for desktop and mobile 📱💻  
- State management with **Zustand** ⚡  
- Easy-to-extend modular architecture 🧩  

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite  
- **State Management:** Zustand  
- **Styling:** CSS / TailwindCSS  
- **API:** OpenWeather API  

## 📂 Project Structure

```bash
src/
┣ assets/        # Images, icons, static files
┣ components/    # Reusable UI components (e.g., WeatherCard, Navbar)
┣ hooks/         # Custom hooks (e.g., useWeather)
┣ pages/         # App pages (e.g., Dashboard, Settings)
┣ store/         # Zustand global store
┣ utils/         # Helper functions (API calls, formatters)
┣ App.tsx        # Main app entry
┗ main.tsx       # ReactDOM render

