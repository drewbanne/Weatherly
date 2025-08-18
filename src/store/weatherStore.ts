// src/store/weatherStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentWeather } from "../utils/api";

type WeatherItem = Awaited<ReturnType<typeof fetchCurrentWeather>>;

type WeatherState = {
  current: WeatherItem | null;
  history: WeatherItem[];    // last 5
  isLoading: boolean;
  error: string | null;
  getWeather: (city: string) => Promise<void>;
  selectFromHistory: (city: string) => Promise<void>;
  clearError: () => void;
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      current: null,
      history: [],
      isLoading: false,
      error: null,

      getWeather: async (city: string) => {
        if (!city.trim()) return;
        set({ isLoading: true, error: null });
        try {
          const data = await fetchCurrentWeather(city.trim());
          set((state) => {
            const withoutDupes = state.history.filter((h) => h.city.toLowerCase() !== data.city.toLowerCase());
            return {
              current: data,
              history: [data, ...withoutDupes].slice(0, 5),
              isLoading: false,
            };
          });
        } catch (e: any) {
          set({ error: e?.message || "Failed to fetch weather", isLoading: false });
        }
      },

      selectFromHistory: async (city: string) => {
        const existing = get().history.find((h) => h.city.toLowerCase() === city.toLowerCase());
        if (existing) {
          set({ current: existing, error: null });
        } else {
          await get().getWeather(city);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "weatherly-store", // localStorage key
      partialize: (state) => ({ history: state.history }), // persist only history now
    }
  )
);
