##Weatherly 🌦️

A modern weather dashboard built with Vite + React + TypeScript, featuring Zustand for state management and reusable UI components.
Designed to be simple, clean, and responsive, now with live data capabilities!

##🚀 Features
Real-time Weather Data: Get live weather updates for any city worldwide using the OpenWeatherMap API 🌍.

Accurate Local Times: Displays current time, sunrise, and sunset reflecting the specific timezone of the searched city.

Dynamic Greetings: Personalized greetings like "Good Morning," "Good Afternoon," "Good Evening," or "Good Night" based on local browser time.

Comprehensive Current Conditions: Shows temperature, "feels like" temperature, humidity, wind speed, wind direction, pressure, visibility, and cloudiness 🌡️💨.

Prominent 5-Day Forecast: A clear and well-spaced 5-day weather forecast section is easily visible.

Geolocation Support: Find weather for your current location with a single click.

Search History & Quick Select: Easily access recent searches and quickly select from a list of popular cities.

Clear Search History: Option to reset your past weather searches.

User Profile Picture: Upload a custom profile picture to personalize your dashboard.

Responsive Design: Optimized layout for seamless viewing on desktop, tablet, and mobile devices 📱💻.

State Management with Zustand: Efficient and flexible state handling.

Easy-to-Extend Modular Architecture: Built with reusability in mind for future enhancements 🧩.

##🛠️ Tech Stack
React (Vite + TypeScript) – Frontend framework

Zustand – Global state management

Tailwind CSS – Utility-first styling

OpenWeatherMap API – Provides real-time weather and forecast data

Lucide React – Modern, consistent icon library

GitHub Pages / Vercel – Deployment (planned)

##📂 Project Structure
src/
┣ assets/           # Images, icons
┣ components/       # Reusable UI components (Sidebar, Topbar, WeatherCard, etc.)
┣ hooks/            # Custom React hooks (if any added)
┣ pages/            # Main app pages (Landing, Dashboard)
┣ store/            # Zustand global state management
┣ utils/            # API helpers and utilities
┣ App.tsx           # App entry point (handles routing & layout)
┗ main.tsx          # React/Vite bootstrap

##👤 Author
Andrews Banne
📧 Email: andy.banne007@gmail.com
🔗 GitHub: @drewbanne