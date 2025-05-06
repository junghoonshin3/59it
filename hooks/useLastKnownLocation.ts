import { useEffect, useState } from "react";
import { Region } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { getLastKnownPositionAsync } from "@/services/locationService";

export function useLastKnownLocation() {
  const setLocation = useLocationStore((state) => state.setLocation);
  const [lastRegion, setLastRegion] = useState<Region | null>(null);

  useEffect(() => {
    const init = async () => {
      const position = await getLastKnownPositionAsync();
      if (position) {
        const region: Region = {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation({
          latitude: position.latitude,
          longitude: position.longitude,
        });
        setLastRegion(region);
      }
    };
    init();
  }, []);

  return { lastRegion };
}
