// src/store/weatherStore.ts
import { create } from "zustand";

interface WeatherState {
  cities: string[];
  addCity: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  cities: [],
  addCity: (city) =>
    set((state) => ({
      cities: [...state.cities, city],
    })),
}));
