import { useEffect } from "react";
import * as Location from "expo-location";

export const useWatchLocation = (callBack: Location.LocationCallback) => {
  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          mayShowUserSettingsDialog: true,
          timeInterval: 5000,
          distanceInterval: 100,
        },
        callBack
      );
    };

    startWatching();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);
};
