import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { Loading } from "@/components/loading";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { CustomMarkerView } from "@/components/custommarker";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { ImageButton } from "@/components/ImageButton";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import { UserAvatar } from "@/components/useravatar";
import { FlatList } from "react-native-gesture-handler";
import ConfirmButton from "@/components/confirmbutton";

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
      <BottomSheet
        backgroundComponent={(props) => (
          <CustomBackground {...props}>
            <ImageButton
              image={require("@/assets/images/my_location.png")}
              onPress={getCurrentLocation}
              className="shadow-lg"
              backgroundColor="bg-[#FDD835]"
              size={50}
            />
          </CustomBackground>
        )}
        backgroundStyle={{
          flex: 1,
          backgroundColor: "#181A20",
          borderTopEndRadius: 32,
          borderTopStartRadius: 32,
        }}
        handleIndicatorStyle={{
          marginTop: 10,
          width: 50,
          height: 5,
          backgroundColor: "#626877",
        }}
        ref={bottomSheetRef}
        enableDynamicSizing={true}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        enableHandlePanningGesture={true}
      >
        <BottomSheetView className="ps-[32px] pe-[32px]">
          <Text className="text-white text-[20px] font-semibold leading-[34px] tracking-[-0.5px]">
            친구
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="pt-[20px] pb-[20px]"
            data={participants}
            renderItem={renderItem}
            horizontal
            ItemSeparatorComponent={() => <View className="w-[12px]"></View>}
          />
          <ConfirmButton
            title="친구 추가"
            onPress={() => {
              console.log("친구 추가 화면으로 이동");
              // 그룹 생성 로직 호출
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
