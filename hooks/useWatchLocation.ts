import { useEffect } from "react";
import * as Location from "expo-location";

type WatchLocationProps = {
  onLocationChange: (coords: { latitude: number; longitude: number }) => void;
};

export const useWatchLocation = ({ onLocationChange }: WatchLocationProps) => {
  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 100,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          onLocationChange({ latitude, longitude });
        }
      );
    };

    startWatching();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);
};
