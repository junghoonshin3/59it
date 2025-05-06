import { View, Text, Platform, ActivityIndicator, Image } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { Loading } from "@/components/loading";
import { useLastKnownLocation } from "@/hooks/useLastKnownLocation";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { CustomMarkerView } from "@/components/\bcustommarker";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const location = useLocationStore((state) => state.location);
  const { lastRegion } = useLastKnownLocation();

  useSyncCameraWithLocation(mapRef);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  if (!lastRegion) {
    // 아직 위치 불러오는 중
    return <Loading />;
  }

  return (
    <>
      <View className="flex-1">
        <MapView
          showsBuildings={false}
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={lastRegion}
          scrollDuringRotateOrZoomEnabled={false}
          rotateEnabled={false}
          toolbarEnabled={false}
          maxZoomLevel={20}
          minZoomLevel={13}
          googleRenderer="LEGACY"
        >
          <Marker
            className="justify-center items-center"
            coordinate={{
              latitude: location?.latitude ?? lastRegion.latitude,
              longitude: location?.longitude ?? lastRegion.longitude,
            }}
          >
            <CustomMarkerView
              imageUrl="http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg"
              name="정훈"
              isOnline={true}
            />
          </Marker>
        </MapView>
      </View>
      <BottomSheet
        snapPoints={["20%", "50%"]}
        style={{ flex: 1 }}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
