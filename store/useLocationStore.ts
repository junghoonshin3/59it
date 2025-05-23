import { getLastKnownPositionAsync } from "@/services/locationService";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  setLocation: (location: Location) => void;
};

export const useLocationStore = create<LocationState>()(
  devtools((set) => ({
    location: null,
    setLocation: (location) => set(() => ({ location })),
  }))
);
