import { useEffect, RefObject } from "react";
import MapView, { Region } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";

export function useSyncCameraWithLocation(mapRef: RefObject<MapView>) {
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    if (mapRef && mapRef.current && location) {
      const region: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region);
    }
  }, [location, mapRef, mapRef.current]);
}
