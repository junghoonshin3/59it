import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useLocationStore } from "@/store/useLocationStore";

export const useWatchLocation = () => {
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const { setLocation } = useLocationStore();

  useEffect(() => {
    let isMounted = true;

    const startWatching = async () => {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초마다
          distanceInterval: 10, // 10m 이동 시
        },
        (location) => {
          if (isMounted) {
            console.log("foreground location : ", location);
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }); // useLocationStore 안에 있는 setter 사용
          }
        },
        (error) => {
          console.log("error >>>>> ", error);
        }
      );
    };

    startWatching();

    return () => {
      isMounted = false;
      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, []);
};
