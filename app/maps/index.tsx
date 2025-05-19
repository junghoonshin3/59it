import { View, Text } from "react-native";
import React, { useCallback, useRef } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { Loading } from "@/components/loading";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { CustomMarkerView } from "@/components/custommarker";
import BottomSheet from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { ImageButton } from "@/components/ImageButton";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import { UserAvatar } from "@/components/useravatar";
import { FlatList } from "react-native-gesture-handler";
import ConfirmButton from "@/components/confirmbutton";
import { router } from "expo-router";
import CustomBottomSheet from "@/components/CustomBottomSheet";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { getCurrentLocation, location } = useLocationStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const participants = [
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "정훈",
      isOnline: true,
    },
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "정훈",
      isOnline: true,
    },
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "정훈",
      isOnline: true,
    },
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "광호",
      isOnline: true,
    },
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "몽교",
      isOnline: true,
    },
    {
      imageUrl:
        "http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg",
      username: "골령",
      isOnline: true,
    },
  ];

  useSyncCameraWithLocation(mapRef);

  useWatchLocation();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  type CustomBackgroundProps = StyleProps & {
    children?: React.ReactNode;
  };

  const CustomBackground = ({ style, children }: CustomBackgroundProps) => {
    return (
      <>
        <View style={[{ ...style }]} />
        <View style={{ position: "absolute", top: -55, right: 32 }}>
          {children}
        </View>
      </>
    );
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <UserAvatar
        imageUrl={item.imageUrl}
        username={item.username}
        isOnline={item.isOnline}
        onPress={() => console.log("정훈 클릭됨")}
      />
    ),
    []
  );

  if (!location) {
    // 아직 위치 불러오는 중
    return <Loading />;
  }

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        showsBuildings={false}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollDuringRotateOrZoomEnabled={false}
        rotateEnabled={false}
        zoomTapEnabled={false}
        toolbarEnabled={false}
        maxZoomLevel={20}
        minZoomLevel={13}
        googleRenderer="LEGACY"
      >
        <Marker
          className="justify-center items-center"
          coordinate={{
            latitude: location!!.latitude,
            longitude: location!!.longitude,
          }}
        >
          <CustomMarkerView
            imageUrl="http://k.kakaocdn.net/dn/baYdsc/btrRh69C8Xs/QjPOiPaXfafLiFz6Ta1he1/img_110x110.jpg"
            name="정훈"
            isOnline={true}
          />
          <Callout className="flex-1">
            <Text className="bg-white ">정훈</Text>
          </Callout>
        </Marker>
      </MapView>
      <CustomBottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        contentContainerClassName="px-[32px]"
        backgroundComponent={(props) => (
          <CustomBackground {...props}>
            <ImageButton
              image={require("@/assets/images/my_location.png")}
              onPress={getCurrentLocation}
              className="shadow-lg"
              backgroundColor="bg-[#0075FF]"
              size={50}
            />
          </CustomBackground>
        )}
      >
        <Text className="text-white text-[20px] font-semibold">모임</Text>
        <FlatList
          data={participants}
          renderItem={renderItem}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
        />
        <ConfirmButton
          title="모임 생성"
          onPress={() => router.navigate("/friends")}
        />
      </CustomBottomSheet>
    </View>
  );
}
