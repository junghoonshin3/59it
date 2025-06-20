import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCurrentPositionAsync,
  startBackgroundTracking,
  stopLocationUpdatesAsync,
} from "@/services/locationService";
import {
  updateLocationSharingStatus,
  getMyGroups,
  getGroupMembers,
} from "@/services/supabase/supabaseService";

import { useAuthStore } from "@/store/useAuthStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
import { Group, GroupMember, SharingGroup } from "@/types/types";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import GroupListContent from "@/components/GroupListContent";
import GroupDetailContent from "@/components/GroupDetailContent";
import CreateOrJoinGroupSheet from "@/components/CreateOrJoinGroupSheet";
import CommonModal from "@/components/commonpopup";
import NotificationBell from "@/components/NotificationBell";
import { ImageButton } from "@/components/ImageButton";
import { CustomMarkerView } from "@/components/CustomMarkerView";
import BottomSheet from "@gorhom/bottom-sheet";
import { StyleProps } from "react-native-reanimated";
import { storage } from "@/utils/storage";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import ProfileButton from "@/components/ProfileButton";

export default function Map() {
  // refs
  const mapRef = useRef<MapView>(null);
  const groupRef = useRef<BottomSheet>(null);
  const createRef = useRef<BottomSheet>(null);

  // states

  const [myGroups, setMyGroups] = useState<Group[] | null>();
  const [groupMembers, setGroupMembers] = useState<GroupMember[] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isModalShareLoc, setIsModalShareLoc] = useState(false);
  const [showBackgroundButton, setShowBackgroundButton] = useState(true);

  // stores
  const { user } = useAuthStore();
  const { location, setLocation } = useLocationStore();
  const insets = useSafeAreaInsets();

  // 위치 변경시 카메라 위치 설정
  useSyncCameraWithLocation(mapRef);

  // 포그라운드 시 위치변경 훅
  useWatchLocation((location) => {
    console.log(
      "포그라운드에서 위치변경이 되는데.. >>>>>>>>>>> ",
      location.coords
    );
    setLocation(location.coords);
  });

  // 그룹 정보 불러오기
  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        if (!user) return;
        const groups = await getMyGroups(user.id);
        setMyGroups(groups);
      };
      fetchGroups();
    }, [])
  );

  // 📍 현재 위치로 카메라 이동
  const getCurrentLocation = async () => {
    const currentPosition = await getCurrentPositionAsync();
    if (currentPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // 👥 그룹 클릭 시 상세 정보 로드
  const onGroupClick = async (selectedGroup: Group) => {
    const members = await getGroupMembers(selectedGroup.group.id, user!!.id);
    setSelectedGroup(selectedGroup);
    setGroupMembers(members);
    groupRef.current?.snapToIndex(2);
  };

  // 📤 위치 공유 시작 요청
  const handleConfirmStartSharing = async () => {
    if (!selectedGroup || !user) return;

    const { success, error } = await updateLocationSharingStatus(
      selectedGroup.group.id,
      user.id,
      true
    );

    if (success) {
      await startBackgroundTracking();
      await storage.setObject<SharingGroup>("selectedSharingGroup", {
        group_id: selectedGroup.group.id,
        user_id: user.id,
      });
      setGroupMembers(
        (prev) =>
          prev?.map((m) =>
            m.member.id === user.id ? { ...m, is_sharing_location: true } : m
          ) ?? null
      );
    } else {
      console.error("위치 공유 시작 실패:", error);
    }
    setIsModalShareLoc(false);
  };

  // 📥 위치 공유 중지 요청
  const handlePressStopSharing = async () => {
    if (!selectedGroup || !user) return;

    const { success, error } = await updateLocationSharingStatus(
      selectedGroup.group.id,
      user.id,
      false
    );

    if (success) {
      await stopLocationUpdatesAsync();
      await storage.remove("selectedSharingGroup");
      setGroupMembers(
        (prev) =>
          prev?.map((m) =>
            m.member.id === user.id ? { ...m, is_sharing_location: false } : m
          ) ?? null
      );
    } else {
      console.error("위치 공유 중지 실패:", error);
    }
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

  if (!location) return;

  return (
    <View className="flex-1">
      {/* 지도 */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsBuildings={false}
        scrollDuringRotateOrZoomEnabled={false}
        rotateEnabled={false}
        zoomTapEnabled={false}
        toolbarEnabled={false}
        maxZoomLevel={25}
        minZoomLevel={8}
      >
        <CustomMarkerView
          coordinate={location}
          imageUrl={user?.user_metadata.picture}
          name={user?.user_metadata.name}
        />
      </MapView>

      {/* 그룹 목록/상세 바텀시트 */}
      <CustomBottomSheet
        ref={groupRef}
        snapPoints={[40, 200, "90%"]}
        index={1}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onChange={(index) => {
          setShowBackgroundButton(index === 0 || index === 1);
        }}
        backgroundComponent={(props) => (
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
            <CommonModal
              visible={isModalShareLoc}
              cancelText={"아니요"}
              confirmText={"네"}
              title={"위치공유"}
              description={
                "참여 중인 모임의 구성원들과\n나의 위치를 실시간으로 공유합니다.\n위치 공유를 시작하시겠어요?"
              }
              onConfirm={handleConfirmStartSharing}
              onCancel={() => {
                setIsModalShareLoc(false);
              }}
            />
          </CustomBackground>
        )}
      >
        <GroupListContent
          groups={myGroups ?? []}
          onClickGroupItem={onGroupClick}
          addGroup={() => {
            groupRef.current?.close();
            createRef.current?.expand();
          }}
          selectedGroupId={selectedGroup?.group.id}
        />

        <GroupDetailContent
          selectedGroup={selectedGroup}
          members={groupMembers ?? []}
          onShareLocationStart={() => setIsModalShareLoc(true)}
          onShareLocationStop={handlePressStopSharing}
        />
      </CustomBottomSheet>

      {/* 그룹 생성/참여 바텀시트 */}
      <CustomBottomSheet
        index={-1}
        ref={createRef}
        enablePanDownToClose={false}
      >
        <CreateOrJoinGroupSheet
          onClose={() => {
            createRef.current?.close();
            groupRef.current?.snapToIndex(1);
          }}
        />
      </CustomBottomSheet>

      {/* 알림 */}
      <NotificationBell
        top={insets.top + 5}
        hasNotification
        onPress={() => {}}
      />
      <ProfileButton
        profileImage={user?.user_metadata.picture}
        top={insets.top + 5}
        className="left-4"
        onPress={() => {
          router.navigate("/profile");
        }}
      />
      {/* <StatusBar style="dark" /> */}
    </View>
  );
}
