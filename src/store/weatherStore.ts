// src/store/weatherStore.ts
import { create } from "zustand";

interface WeatherState {
  cities: string[];
  addCity: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  cities: ["London", "Cape Town", "Miami"], // Initial mock history
  addCity: (city) =>
    set((state) => {
      const normalizedCity = city.trim();
      const updatedCities = [
        normalizedCity,
        ...state.cities.filter((c) => c.toLowerCase() !== normalizedCity.toLowerCase()),
      ].slice(0, 5);
      return { cities: updatedCities };
    }),
}));