import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
} from "@/services/locationService";
import { Region } from "react-native-maps";
import { create } from "zustand";

type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  setLocation: (location: Location) => void;
  getCurrentLocation: () => Promise<void>;
  getLastKnownLocation: () => Promise<void>;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  initialRegion: null,
  setLocation: (location) => set({ location }),
  getCurrentLocation: async () => {
    const currentPosition = await getCurrentPositionAsync();
    console.log("currentPosition : ", currentPosition);
    set({
      location: {
        latitude: currentPosition!!.latitude,
        longitude: currentPosition!!.longitude,
      },
    });
  },
  getLastKnownLocation: async () => {
    const lastKnownPosition = await getLastKnownPositionAsync();
    const region = {
      latitude: lastKnownPosition!!.latitude,
      longitude: lastKnownPosition!!.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    set({
      location: {
        latitude: lastKnownPosition!!.latitude,
        longitude: lastKnownPosition!!.longitude,
      },
    });
  },
}));
