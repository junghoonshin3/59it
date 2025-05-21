import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { Loading } from "@/components/loading";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { CustomMarkerView } from "@/components/custommarker";
import BottomSheet from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { ImageButton } from "@/components/ImageButton";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import { FlatList } from "react-native-gesture-handler";
import { router, useFocusEffect } from "expo-router";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import { GroupResponse } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyGroups } from "@/services/supabase/supabaseService";
import { GroupItem } from "@/components/GroupItem";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { getCurrentLocation, location } = useLocationStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [groups, setGroups] = useState<GroupResponse[] | null>([]);
  const { session } = useAuthStore();
  useSyncCameraWithLocation(mapRef);

  useWatchLocation();

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        if (!session) return;
        const myGroups = await getMyGroups(session.user.id);
        setGroups(myGroups);
      };

      fetchGroups();
    }, [])
  );

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
    ({ item }: { item: GroupResponse }) => (
      <GroupItem
        groupName={item.name}
        group_image_url={item.group_image_url}
        onPress={() => {}}
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
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-[20px] font-semibold">
            나의 모임들
          </Text>
          <TouchableOpacity onPress={() => router.push("/meeting")}>
            <Image
              source={require("@/assets/images/add_group.png")}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={groups}
          ListEmptyComponent={() => {
            return (
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-[16px] font-semibold">
                  참여한 모임이 없습니다.
                </Text>
              </View>
            );
          }}
          renderItem={renderItem}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
        />
      </CustomBottomSheet>
    </View>
  );
}
