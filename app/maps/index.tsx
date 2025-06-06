import { View, Text, TouchableOpacity, Image } from "react-native";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
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
import { GroupResponse, UserProfile } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyGroups } from "@/services/supabase/supabaseService";
import { GroupItem } from "@/components/GroupItem";
import { getCurrentPositionAsync } from "@/services/locationService";
import ConfirmButton from "@/components/confirmbutton";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { location, setLocation } = useLocationStore();
  const groupRef = useRef<BottomSheet>(null);
  const createRef = useRef<BottomSheet>(null);
  const [groups, setGroups] = useState<GroupResponse[] | null>([]);
  const { user } = useAuthStore();

  useSyncCameraWithLocation(mapRef);

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        if (!user) return;
        const myGroups = await getMyGroups(user.id);
        setGroups(myGroups);
      };
      fetchGroups();
    }, [])
  );

  useWatchLocation({
    onLocationChange(coords) {
      setLocation(coords);
    },
  });

  const getCurrentLocation = async () => {
    const currentPosition = await getCurrentPositionAsync();
    if (currentPosition && mapRef.current) {
      const region: Region = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region);
    }
  };

  const onGroupClick = async (group: GroupResponse) => {
    router.push({
      pathname: "/groups/members",
      params: { groupId: `${group.id}`, hostId: `${group.host_id}` },
    });
  };
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
        onPress={() => {
          onGroupClick(item);
        }}
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
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider={PROVIDER_GOOGLE}
        scrollDuringRotateOrZoomEnabled={false}
        rotateEnabled={false}
        zoomTapEnabled={false}
        toolbarEnabled={false}
        maxZoomLevel={25}
        minZoomLevel={10}
        googleRenderer="LEGACY"
      >
        {groups?.map((item, index) => (
          // 모임장소 마커
          <CustomMarkerView
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            imageUrl={item.group_image_url}
            name={item.display_name}
          />
        ))}

        {
          // 본인 마커
          <CustomMarkerView
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            imageUrl={user?.user_metadata.picture}
            name={user?.user_metadata.name}
          />
        }
      </MapView>
      <CustomBottomSheet
        ref={groupRef}
        enableDynamicSizing
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
          <TouchableOpacity
            onPress={() => {
              createRef.current?.expand();
              groupRef.current?.close();
            }}
          >
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
      <CustomBottomSheet
        enableDynamicSizing
        index={-1}
        ref={createRef}
        enablePanDownToClose={true}
        contentContainerClassName="px-[32px]"
        onClose={() => {
          groupRef.current?.expand();
        }}
      >
        <Text className="text-white text-[20px] font-semibold">그룹</Text>
        <View className="flex-row mt-[20px]">
          <ConfirmButton
            className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center flex-1"
            title="모임 생성"
            onPress={() => {
              router.push("/groups/create");
            }}
          />
          <View className="w-[10px]" />
          <ConfirmButton
            className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center flex-1"
            title="모임 참여"
            onPress={() => {
              router.push("/groups/join");
            }}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
}
