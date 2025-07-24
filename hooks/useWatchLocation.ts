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
          timeInterval: 10000,
          distanceInterval: 100,
        },
        callBack,
        (error) => {
          console.log("포그라운드 위치 오류  >>>>>>> ", error);
        }
      );
    };

    startWatching();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);
};
