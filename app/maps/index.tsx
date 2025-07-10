// 3. 수정된 Map 컴포넌트
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCurrentPositionAsync } from "@/services/locationService";
import { useLocationStore } from "@/store/useLocationStore";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import { useSyncCameraWithLocation } from "@/hooks/useSyncCameraWithLocation";
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
import { useWatchLocation } from "@/hooks/useWatchLocation";
import ProfileButton from "@/components/ProfileButton";
import { useUserProfile } from "@/api/auth/hooks/useAuth";
import { Group, GroupMember } from "@/api/groups/types";
import {
  useGroupMembers,
  useMyGroups,
  useStartSharingLoation,
  useStopSharingLoation,
} from "@/api/groups/hooks/useGroups";
import { supabase } from "@/services/supabase/supabaseService";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { GroupMemberWithLocation } from "@/store/groups/types";

export default function Map() {
  // refs
  const mapRef = useRef<MapView>(null);
  const groupRef = useRef<BottomSheet>(null);
  const createRef = useRef<BottomSheet>(null);

  const { currentSharingGroup, isSharing } = useLocationSharingStore();
  const { data: user } = useUserProfile();
  const { data: myGroups, isLoading } = useMyGroups(user?.id);

  const {
    location,
    setLocation,
    addGroupMember,
    updateGroupMemberLocation,
    setGroupMember,
  } = useLocationStore();
  const startSharingLocationMutation = useStartSharingLoation();
  const stopSharingLocationMutation = useStopSharingLoation();
  const insets = useSafeAreaInsets();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    currentSharingGroup
  );

  const { data: groupMemberProfiles, isLoading: isGroupMemberLoading } =
    useGroupMembers(selectedGroup?.id ?? null);

  const [isModalShareLoc, setIsModalShareLoc] = useState(false);
  const [showBackgroundButton, setShowBackgroundButton] = useState(true);
  const [subscribeStatus, setSubscribeStatus] = useState<boolean>(false);
  // 위치 변경시 카메라 위치 설정
  useSyncCameraWithLocation(mapRef);

  // 포그라운드 시 위치변경 훅
  useWatchLocation((location) => {
    console.log("포그라운드에서 위치변경 >>>>>>>>>>> ", location.coords);
    setLocation(location.coords);
  });

  // 그룹 멤버 데이터가 변경될 때 store에 저장
  useEffect(() => {
    if (groupMemberProfiles) {
      // GroupMember를 GroupMemberWithLocation으로 변환
      const membersWithLocation: GroupMemberWithLocation[] =
        groupMemberProfiles.map((member) => ({
          ...member,
          latitude: undefined,
          longitude: undefined,
        }));
      setGroupMember(membersWithLocation);
    }
  }, [groupMemberProfiles, setGroupMember]);

  useEffect(() => {
    if (!isSharing || !currentSharingGroup) return;

    const realtimeChannel = supabase
      .channel(`group-member-locations:${currentSharingGroup.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_member_locations",
          filter: `group_id=eq.${currentSharingGroup.id}`,
        },
        (payload) => {
          // 새로운 위치 데이터 처리
          const { user_id, latitude, longitude } = payload.new;

          // 해당 유저의 프로필 정보 찾기
          const profile = groupMemberProfiles?.find((v) => v.id === user_id);
          if (profile) {
            // 새로운 멤버 위치 정보로 업데이트
            const updatedMember: GroupMemberWithLocation = {
              ...profile,
              latitude: latitude,
              longitude: longitude,
            };

            addGroupMember(updatedMember);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "group_member_locations",
          filter: `group_id=eq.${currentSharingGroup.id}`,
        },
        (payload) => {
          // 위치 업데이트 처리
          const { user_id, latitude, longitude } = payload.new;

          if (user_id && latitude && longitude) {
            updateGroupMemberLocation(user_id, {
              latitude,
              longitude,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("실시간 위치 구독 상태:", status);
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          setSubscribeStatus(true);
        } else {
          setSubscribeStatus(false);
        }
      });

    return () => {
      realtimeChannel?.unsubscribe();
    };
  }, [isSharing, currentSharingGroup]);

  // 현재 위치로 카메라 이동
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

  // 그룹 클릭 시 상세 정보 로드
  const onClickGroup = useCallback((selectedGroup: Group) => {
    setSelectedGroup(selectedGroup);
    groupRef.current?.snapToIndex(2);
  }, []);

  // 위치 공유 시작 요청
  const handleConfirmStartSharing = async () => {
    if (!selectedGroup || !user) return;
    try {
      await startSharingLocationMutation.mutateAsync({
        selectedGroup: selectedGroup,
        userId: user.id,
      });
    } catch (error) {
      console.error("위치 공유 시작 오류:", error);
    }
  };

  // 위치 공유 중지 요청
  const handlePressStopSharing = async () => {
    if (!user || !selectedGroup) return;
    try {
      await stopSharingLocationMutation.mutateAsync({
        groupId: selectedGroup?.id,
        userId: user.id,
      });
    } catch (error) {
      console.error("위치 공유 중지 오류:", error);
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

  if (!location) return null;

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
          imageUrl={user?.profile_image}
          name={user?.nickname}
        />
      </MapView>

      {/* 그룹 목록/상세 바텀시트 */}
      <CustomBottomSheet
        ref={groupRef}
        snapPoints={[70, 200, "90%"]}
        index={1}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onChange={(index) => {
          setShowBackgroundButton(index === 0 || index === 1);
        }}
        backgroundComponent={(props) => (
          <CustomBackground {...props}>
            <CommonModal
              visible={isModalShareLoc}
              cancelText={"아니요"}
              confirmText={"네"}
              title={"위치공유"}
              description={
                "참여 중인 모임의 구성원들과\n나의 위치를 실시간으로 공유합니다.\n위치 공유를 시작하시겠어요?"
              }
              onConfirm={() => {
                handleConfirmStartSharing();
                setIsModalShareLoc(false);
              }}
              onCancel={() => {
                setIsModalShareLoc(false);
              }}
            />
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
        )}
      >
        <GroupListContent
          loading={isLoading}
          groups={myGroups ?? []}
          onClickGroup={onClickGroup}
          addGroup={() => {
            groupRef.current?.close();
            createRef.current?.expand();
          }}
          selectedGroupId={selectedGroup?.id ?? null}
          isCurrentlySharing={isSharing}
        />

        <GroupDetailContent
          loading={
            startSharingLocationMutation.isPending ||
            stopSharingLocationMutation.isPending
          }
          selectedGroup={selectedGroup}
          members={groupMemberProfiles ?? []}
          onShareLocationStart={() => {
            setIsModalShareLoc(true);
          }}
          onShareLocationStop={handlePressStopSharing}
          isCurrentlySharing={selectedGroup?.id === currentSharingGroup?.id}
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
        profileImage={user?.profile_image}
        top={insets.top + 5}
        className="left-4"
        onPress={() => {
          router.navigate("/profile");
        }}
      />
    </View>
  );
}
