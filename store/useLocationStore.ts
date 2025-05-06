import { create } from "zustand";

type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  setLocation: (location: Location) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));
