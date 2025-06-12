import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { Loading } from "@/components/loading";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { CustomMarkerView } from "@/components/CustomMarkerView";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { ImageButton } from "@/components/ImageButton";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import { router, useFocusEffect, useNavigation } from "expo-router";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import { GroupResponse, UserProfile } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getGroupMembers,
  getMyGroups,
} from "@/services/supabase/supabaseService";
import { getCurrentPositionAsync } from "@/services/locationService";
import ConfirmButton from "@/components/confirmbutton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationBell from "@/components/NotificationBell";
import GroupListContent from "@/components/GroupListContent";
import { UserAvatar } from "@/components/UserAvatar";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { location, setLocation } = useLocationStore();
  const groupRef = useRef<BottomSheet>(null);
  const createRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [180, "50%", "90%"], []);
  const [showBackgroundButton, setShowBackgroundButton] = useState(true);
  const [groups, setGroups] = useState<GroupResponse[] | null>([]);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(
    null
  );
  const [groupMembers, setGroupMembers] = useState<UserProfile[] | null>(null);
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
    const members = await getGroupMembers(group.id);
    setGroupMembers(members);
    setSelectedGroup(group);
    groupRef.current?.snapToIndex(1);
  };

  type CustomBackgroundProps = StyleProps & {
    children?: React.ReactNode;
  };

  const renderGroupMember = useCallback(({ item }: { item: UserProfile }) => {
    <UserAvatar
      key={item.id}
      className="w-[68px] h-[68px] rounded-full"
      imageUrl={item.profile_image}
      onPress={() => {}}
    />;
  }, []);

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
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onChange={(index) => {
          setShowBackgroundButton(index === 0);
        }}
        backgroundComponent={(props) => {
          return (
            <CustomBackground {...props}>
              {showBackgroundButton ? (
                <ImageButton
                  image={require("@/assets/images/my_location.png")}
                  onPress={getCurrentLocation}
                  className="shadow-lg"
                  backgroundColor="bg-[#0075FF]"
                  size={50}
                />
              ) : null}
            </CustomBackground>
          );
        }}
      >
        <BottomSheetView>
          <GroupListContent
            groups={groups}
            onClickGroupItem={onGroupClick}
            addGroup={() => {
              groupRef.current?.close();
              createRef.current?.snapToIndex(0);
            }}
          />
        </BottomSheetView>
        {selectedGroup ? (
          <BottomSheetScrollView
            scrollEnabled={true}
            contentContainerClassName="px-[32px]"
          >
            <Text className="text-white text-[20px] font-semibold">
              모임 참여자
            </Text>
            {groupMembers?.map((item) => (
              <UserAvatar
                key={item.id}
                className="w-[68px] h-[68px] rounded-full"
                imageUrl={item.profile_image}
                onPress={() => {}}
              />
            ))}
            <Text className="text-white text-[20px] font-semibold">
              모임장소
            </Text>
            <Text className="text-white text-[14px]">
              이름 : {selectedGroup.display_name}
            </Text>
            <Text className="text-white">
              상세주소 : {selectedGroup.address}
            </Text>
            <MapView
              style={{ width: "100%", height: 350 }}
              initialRegion={{
                latitude: selectedGroup.latitude,
                longitude: selectedGroup.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}
              zoomTapEnabled={false}
            >
              <CustomMarkerView
                coordinate={{
                  latitude: selectedGroup.latitude,
                  longitude: selectedGroup.longitude,
                }}
                imageUrl={selectedGroup.group_image_url}
                name={selectedGroup.display_name}
              />
            </MapView>
          </BottomSheetScrollView>
        ) : null}
      </CustomBottomSheet>
      <CustomBottomSheet
        index={-1}
        ref={createRef}
        enablePanDownToClose={false}
        contentContainerClassName="px-[32px]"
      >
        <BottomSheetView>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                createRef.current?.close();
                groupRef.current?.snapToIndex(0);
              }}
              className="justify-center items-center"
            >
              <Image
                source={require("@/assets/images/back_button.png")}
                resizeMode="contain"
                className="w-[28px] h-[28px]"
              />
            </TouchableOpacity>
            <View className="w-[5px]" />
            <Text className="text-white text-[20px] font-semibold">그룹</Text>
          </View>
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
        </BottomSheetView>
      </CustomBottomSheet>
      <NotificationBell
        hasNotification={true}
        top={insets.top + 5}
        onPress={() => {}}
      />
    </View>
  );
}
